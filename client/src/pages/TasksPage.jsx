import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiCheckCircle, FiClock, FiList, FiCircle,
  FiLoader, FiAlertCircle, FiPlus, FiX, FiUser
} from 'react-icons/fi';

/* ── Status config ── */
const STATUS_CONFIG = {
  all:          { label: 'All Tasks',   color: 'badge-blue',   dot: 'bg-secondary-500' },
  todo:         { label: 'To Do',       color: 'badge-blue',   dot: 'bg-primary-500'  },
  'in-progress':{ label: 'In Progress', color: 'badge-yellow', dot: 'bg-warning-500'  },
  done:         { label: 'Done',        color: 'badge-green',  dot: 'bg-success-500'  },
};

const StatusDot = ({ status }) => (
  <span className={`status-dot ${STATUS_CONFIG[status]?.dot || 'bg-secondary-500'}`} />
);

/* ── Task row card ── */
const TaskCard = ({ task, onStatusChange, delay = 0 }) => (
  <div
    className="card p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3
      hover:-translate-y-px transition-all duration-200 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Left */}
    <div className="flex items-start gap-3 flex-1 min-w-0">
      <StatusDot status={task.status} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <h3 className={`text-sm font-semibold leading-snug ${
            task.status === 'done' ? 'line-through text-muted' : 'text-heading'
          }`}>
            {task.title}
          </h3>
        </div>

        {task.description && (
          <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-relaxed">{task.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted">
          {task.assignedTo && (
            <Link
              to={`/users/${task.assignedTo._id || task.assignedTo}`}
              className="flex items-center gap-1 text-primary-600 hover:underline font-semibold"
            >
              <FiUser size={11} />
              {task.assignedTo.name || 'Assigned User'}
            </Link>
          )}
          {task.startup?.name && (
            <span className="flex items-center gap-1">
              <FiList size={10} className="text-accent-400" />
              {task.startup.name}
            </span>
          )}
          {task.deadline && (
            <span className={`flex items-center gap-1 ${
              new Date(task.deadline) < new Date() && task.status !== 'done'
                ? 'text-danger-400 font-medium'
                : ''
            }`}>
              <FiClock size={10} />
              Due {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>

    {/* Right — status select */}
    <div className="flex-shrink-0 sm:w-36">
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="input-field !py-1.5 text-xs w-full"
        aria-label="Change task status"
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
const TasksPage = ({ user, showToast }) => {
  const [tasks,       setTasks]       = useState([]);
  const [filter,      setFilter]      = useState('all');
  const [loading,     setLoading]     = useState(true);
  const [connections, setConnections] = useState([]);
  const [startups,    setStartups]    = useState([]);
  const [showForm,    setShowForm]    = useState(false);
  const [taskForm,    setTaskForm]    = useState({ title: '', description: '', assignedTo: '', startup: '', deadline: '' });
  const [submitting,  setSubmitting]  = useState(false);

  const loadTasks = async () => {
    try {
      const data = await api.get('/tasks/user');
      setTasks(data.tasks || []);
    } catch (err) {
      showToast?.(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadConnectionsAndStartups = async () => {
    try {
      const connData = await api.get('/users/connections/all');
      setConnections(connData.connections || []);

      const startupData = await api.get('/startups');
      const all = startupData.startups || [];
      const me = all.filter(s => 
        s.founder?._id === user?.id || 
        s.founder === user?.id || 
        s.founder?._id === user?._id || 
        s.founder === user?._id ||
        s.teamMembers?.some(m => m._id === user?.id || m === user?.id || m._id === user?._id || m === user?._id)
      );
      setStartups(me);
    } catch (err) {
      console.error('Failed to load connections or startups', err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadConnectionsAndStartups();
  }, [user]);

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      showToast('Task updated', 'success');
      loadTasks();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tasks', taskForm);
      showToast('Task assigned successfully to connection!', 'success');
      setTaskForm({ title: '', description: '', assignedTo: '', startup: '', deadline: '' });
      setShowForm(false);
      loadTasks();
    } catch (err) {
      showToast(err.message || 'Failed to assign task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    all:          tasks.length,
    todo:         tasks.filter((t) => t.status === 'todo').length,
    'in-progress':tasks.filter((t) => t.status === 'in-progress').length,
    done:         tasks.filter((t) => t.status === 'done').length,
  };

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  /* Progress percentage */
  const pct = tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-2xl font-extrabold text-heading">My Tasks</h1>
              <span className="badge badge-blue">{tasks.length}</span>
            </div>
            <p className="text-sm text-muted">Track and manage your assigned work</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-xs !py-1.5 !px-3.5 flex items-center gap-1.5"
          >
            {showForm ? <><FiX size={12} /> Cancel</> : <><FiPlus size={12} /> Assign Task</>}
          </button>
        </div>

        {/* Task assignment form */}
        {showForm && (
          <form onSubmit={handleAssignTask} className="mb-6 p-5 rounded-2xl border dark:border-secondary-700/50 dark:bg-secondary-800/20 light:border-secondary-200 light:bg-secondary-50 space-y-4 animate-fade-in max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-heading mb-1">Assign Task to Connection</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label text-xs">Task Title</label>
                <input className="input-field text-sm" placeholder="e.g. Design landing page" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="form-label text-xs">Assign To (Connected User)</label>
                <select
                  className="input-field text-sm"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select Connection</option>
                  {connections.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {taskForm.assignedTo && (
                  <div className="mt-1 flex justify-end">
                    <Link
                      to={`/users/${taskForm.assignedTo}`}
                      target="_blank"
                      className="text-[11px] font-semibold text-primary-600 hover:underline inline-flex items-center gap-1"
                    >
                      View {connections.find(c => c._id === taskForm.assignedTo)?.name}'s Profile & Startups ↗
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <label className="form-label text-xs">Associated Startup</label>
                <select
                  className="input-field text-sm"
                  value={taskForm.startup}
                  onChange={(e) => setTaskForm({ ...taskForm, startup: e.target.value })}
                  required
                >
                  <option value="">Select Startup</option>
                  {startups.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label text-xs">Deadline</label>
                <input type="date" className="input-field text-sm" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label text-xs">Description</label>
                <textarea className="textarea-field text-sm" rows={2} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary text-xs">
              {submitting ? 'Assigning...' : 'Assign Task'}
            </button>
          </form>
        )}

        {/* ── Progress summary card ── */}
        {!loading && tasks.length > 0 && (
          <div className="card p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-5">
                {[
                  { key: 'todo',         label: 'To Do',       icon: FiCircle,      cls: 'text-primary-400' },
                  { key: 'in-progress',  label: 'In Progress', icon: FiLoader,      cls: 'text-warning-400' },
                  { key: 'done',         label: 'Completed',   icon: FiCheckCircle, cls: 'text-success-400' },
                ].map(({ key, label, icon: Icon, cls }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Icon size={14} className={cls} />
                    <div>
                      <p className="text-lg font-extrabold text-heading leading-none">{counts[key]}</p>
                      <p className="text-[10px] text-muted">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-1 max-w-xs">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">Overall progress</span>
                  <span className="font-semibold text-heading">{pct}%</span>
                </div>
                <div className="h-2 dark:bg-secondary-800 light:bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Filter tabs ── */}
        <div className="flex gap-1.5 mb-5 flex-wrap animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                filter === key
                  ? `badge ${cfg.color} !rounded-xl !px-3.5 !py-1.5 ring-2 ring-offset-1 dark:ring-offset-secondary-950 light:ring-offset-white ring-primary-500/30`
                  : 'dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-secondary-600 dark:hover:text-white light:border-secondary-200 light:text-secondary-600 light:hover:border-secondary-300'
              }`}
            >
              {cfg.label}
              <span className="opacity-75">({counts[key]})</span>
            </button>
          ))}
        </div>

        {/* ── Task list ── */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-14 text-center animate-fade-in">
            <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
              {filter === 'done' ? <FiCheckCircle size={24} /> : filter === 'in-progress' ? <FiAlertCircle size={24} /> : <FiList size={24} />}
            </div>
            <h3 className="text-base font-semibold text-heading mb-1.5">
              {filter === 'all' ? 'No tasks yet' : `No ${STATUS_CONFIG[filter]?.label.toLowerCase()} tasks`}
            </h3>
            <p className="text-sm text-muted">
              {filter === 'all'
                ? 'Tasks assigned to you will appear here once you join a startup.'
                : 'No tasks match this filter right now.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                delay={i * 40}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
