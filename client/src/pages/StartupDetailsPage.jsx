import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import {
  FiArrowLeft, FiEdit2, FiSend, FiUsers, FiCheckSquare,
  FiClipboard, FiPlus, FiClock, FiStar, FiX, FiCalendar,
} from 'react-icons/fi';

/* ── Helpers ── */
const StatusBadge = ({ status }) => {
  const map = {
    open:          'badge badge-green',
    closed:        'badge badge-red',
    draft:         'badge badge-yellow',
    done:          'badge badge-green',
    'in-progress': 'badge badge-yellow',
    todo:          'badge badge-blue',
    pending:       'badge badge-yellow',
    accepted:      'badge badge-green',
    rejected:      'badge badge-red',
  };
  return <span className={map[status] || 'badge badge-gray capitalize'}>{status}</span>;
};

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
      active
        ? 'dark:bg-primary-500/15 dark:text-primary-400 dark:border dark:border-primary-500/30 light:bg-primary-50 light:text-primary-600 light:border light:border-primary-200'
        : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:text-white hover:light:text-secondary-900 hover:dark:bg-secondary-800/60 hover:light:bg-secondary-100'
    }`}
  >
    {children}
  </button>
);

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
const StartupDetailsPage = ({ user, showToast }) => {
  const { id } = useParams();
  const [startup,        setStartup]        = useState(null);
  const [applications,   setApplications]   = useState([]);
  const [tasks,          setTasks]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeTab,      setActiveTab]      = useState('overview');
  const [applyMessage,   setApplyMessage]   = useState('');
  const [taskForm,       setTaskForm]       = useState({ title: '', description: '', assignedTo: '', deadline: '' });
  const [showTaskForm,   setShowTaskForm]   = useState(false);
  const [editingStartup, setEditingStartup] = useState(false);
  const [editForm,       setEditForm]       = useState({ name: '', description: '', status: '', requiredSkills: '' });
  const [feedbackText,   setFeedbackText]   = useState({});

  const fetchStartup = async () => {
    try {
      const data = await api.get(`/startups/${id}`);
      setStartup(data.startup);
      if (data.startup) {
        setEditForm({
          name: data.startup.name,
          description: data.startup.description,
          status: data.startup.status,
          requiredSkills: (data.startup.requiredSkills || []).join(', '),
        });
      }
    } catch (err) {
      showToast?.(err.message || 'Failed to load startup', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const data = await api.get(`/applications/startup/${id}`);
      setApplications(data.applications || []);
    } catch {}
  };

  const fetchTasks = async () => {
    try {
      const data = await api.get('/tasks/user');
      setTasks((data.tasks || []).filter((t) => t.startup?._id === id || t.startup === id));
    } catch {}
  };

  useEffect(() => { fetchStartup(); }, [id]);

  const handleApply = async () => {
    try {
      await api.post('/applications', { startup: id, message: applyMessage || 'I would love to join this startup' });
      showToast('Application submitted!', 'success');
      setApplyMessage('');
    } catch (err) {
      showToast(err.message || 'Application failed', 'error');
    }
  };

  const handleApplicationStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      showToast(`Application ${status}`, 'success');
      fetchApplications();
      fetchStartup();
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const handleEditStartup = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/startups/${id}`, {
        ...editForm,
        requiredSkills: editForm.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      showToast('Startup updated', 'success');
      setEditingStartup(false);
      fetchStartup();
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...taskForm, startup: id });
      showToast('Task assigned', 'success');
      setTaskForm({ title: '', description: '', assignedTo: '', deadline: '' });
      setShowTaskForm(false);
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to assign task', 'error');
    }
  };

  const handleTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status });
      showToast('Task updated', 'success');
      fetchTasks();
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  /* Tab change triggers data load */
  useEffect(() => {
    if (activeTab === 'applications' && isFounder) fetchApplications();
    if (activeTab === 'tasks')        fetchTasks();
  }, [activeTab]);

  const myId = user?.id || user?._id;
  const isFounder = startup?.founder?._id === myId || startup?.founder === myId;
  const isMember  = startup?.teamMembers?.some((m) => m._id === myId || m === myId);
  const isOpen    = startup?.status === 'open';

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="skeleton h-5 w-32 rounded-xl" />
          <div className="skeleton h-44 rounded-2xl" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="skeleton h-9 w-28 rounded-xl" />)}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Startup not found.</p>
        <Link to="/startups" className="btn-primary mt-4 inline-flex">Back to Startups</Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview',     label: 'Overview' },
    { id: 'team',         label: `Team (${startup.teamMembers?.length || 0})` },
    ...(isFounder ? [
      { id: 'applications', label: `Applications (${applications.length})` },
      { id: 'tasks',        label: `Tasks (${tasks.length})` },
    ] : []),
    ...((isMember && !isFounder) ? [
      { id: 'tasks', label: `Tasks (${tasks.length})` },
    ] : []),
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Back ── */}
        <Link
          to="/startups"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-400 transition-colors mb-5"
        >
          <FiArrowLeft size={14} /> Back to Startups
        </Link>

        {/* ── Startup header card ── */}
        <div className="card p-6 md:p-8 mb-5 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Logo placeholder */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0">
                {startup.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5 mb-1">
                  <h1 className="text-xl font-extrabold text-heading">{startup.name}</h1>
                  <StatusBadge status={startup.status} />
                </div>
                <p className="text-sm text-muted">
                  Founded by{' '}
                  {startup.founder?._id
                    ? <Link to={`/users/${startup.founder._id}`} className="font-medium text-primary-400 hover:underline">{startup.founder.name}</Link>
                    : <span className="font-medium">{startup.founder?.name || 'Unknown'}</span>
                  }
                </p>
                {startup.category?.name && (
                  <span className="badge badge-teal mt-2 inline-flex">{startup.category.name}</span>
                )}
              </div>
            </div>

            {isFounder && (
              <button
                onClick={() => setEditingStartup(!editingStartup)}
                className="btn-outline text-xs !py-2 !px-3.5 flex-shrink-0"
              >
                <FiEdit2 size={13} />
                {editingStartup ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-body leading-relaxed mt-5">{startup.description}</p>

          {/* Skills */}
          {startup.requiredSkills?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-muted mb-2">Required Skills</p>
              <div className="flex flex-wrap gap-2">
                {startup.requiredSkills.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Edit form */}
          {editingStartup && (
            <form onSubmit={handleEditStartup} className="mt-6 pt-6 border-t dark:border-secondary-800/60 light:border-secondary-200 space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name</label>
                  <input className="input-field" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="input-field" value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea className="textarea-field" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <label className="form-label">Required Skills</label>
                  <input className="input-field" value={editForm.requiredSkills} onChange={(e) => setEditForm({ ...editForm, requiredSkills: e.target.value })} placeholder="React, Node.js (comma separated)" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary text-sm">Save Changes</button>
                <button type="button" onClick={() => setEditingStartup(false)} className="btn-outline text-sm">Cancel</button>
              </div>
            </form>
          )}

          {/* Apply section */}
          {!isFounder && !isMember && isOpen && (
            <div className="mt-6 pt-6 border-t dark:border-secondary-800/60 light:border-secondary-200">
              <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                <FiSend size={14} className="text-primary-400" />
                Apply to Join
              </h3>
              <div className="flex gap-3">
                <input
                  className="input-field flex-1 text-sm"
                  placeholder="Why do you want to join? (optional)"
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                />
                <button onClick={handleApply} className="btn-primary text-sm !px-5 flex-shrink-0">
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 mb-5 flex-wrap animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          {tabs.map((t) => (
            <TabButton key={t.id} active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </TabButton>
          ))}
        </div>

        {/* ════════════════════════════════════════
            TAB: OVERVIEW
        ════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="grid sm:grid-cols-3 gap-4 animate-fade-in">
            {[
              { label: 'Status',       value: startup.status,               badge: true },
              { label: 'Team Size',    value: `${startup.teamMembers?.length || 0} members`, badge: false },
              { label: 'Category',     value: startup.category?.name || '—', badge: false },
            ].map(({ label, value, badge }) => (
              <div key={label} className="card p-5">
                <p className="text-xs text-muted font-medium uppercase tracking-wider mb-2">{label}</p>
                {badge ? <StatusBadge status={value} /> : <p className="text-sm font-semibold text-heading">{value}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: TEAM
        ════════════════════════════════════════ */}
        {activeTab === 'team' && (
          <div className="card p-6 animate-fade-in">
            <h2 className="text-base font-semibold text-heading mb-4 flex items-center gap-2">
              <FiUsers size={16} className="text-primary-400" />
              Team Members
            </h2>
            {!startup.teamMembers?.length ? (
              <p className="text-sm text-muted text-center py-8">No team members yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {startup.teamMembers.map((member) => (
                  <Link
                    key={member._id}
                    to={`/users/${member._id}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200
                      dark:border-secondary-800/60 dark:hover:border-primary-500/30 dark:bg-secondary-800/20
                      light:border-secondary-200 light:hover:border-primary-300 light:bg-secondary-50"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                      {member.profilePhoto ? (
                        <img src={getImageUrl(member.profilePhoto)} alt={member.name} className="w-full h-full object-cover animate-scale-in" />
                      ) : (
                        member.name?.charAt(0)?.toUpperCase() || '?'
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-heading truncate">{member.name}</p>
                      <p className="text-xs text-muted capitalize">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: APPLICATIONS (founder only)
        ════════════════════════════════════════ */}
        {activeTab === 'applications' && isFounder && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-heading flex items-center gap-2">
                <FiClipboard size={16} className="text-warning-400" />
                Applications
                {applications.length > 0 && <span className="badge badge-yellow">{applications.length}</span>}
              </h2>
              <button onClick={fetchApplications} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                Refresh
              </button>
            </div>

            {!applications.length ? (
              <p className="text-sm text-muted text-center py-8">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border
                    dark:border-secondary-800/60 dark:bg-secondary-800/20 light:border-secondary-200 light:bg-secondary-50">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                        {app.applicant?.profilePhoto ? (
                          <img src={app.applicant.profilePhoto} alt={app.applicant.name} className="w-full h-full object-cover animate-scale-in" />
                        ) : (
                          app.applicant?.name?.charAt(0) || '?'
                        )}
                      </div>
                      <div className="min-w-0">
                        {app.applicant?._id
                          ? <Link to={`/users/${app.applicant._id}`} className="text-sm font-semibold text-heading hover:text-primary-400 transition-colors">{app.applicant.name}</Link>
                          : <p className="text-sm font-semibold text-heading">{app.applicant?.name || 'Unknown'}</p>
                        }
                        <p className="text-xs text-muted mt-0.5 truncate">{app.message}</p>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApplicationStatus(app._id, 'accepted')}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-success-500/10 text-success-400 border border-success-500/20 hover:bg-success-500/20 transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(app._id, 'rejected')}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-danger-500/10 text-danger-400 border border-danger-500/20 hover:bg-danger-500/20 transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB: TASKS
        ════════════════════════════════════════ */}
        {activeTab === 'tasks' && (
          <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-heading flex items-center gap-2">
                <FiCheckSquare size={16} className="text-primary-400" />
                Tasks
              </h2>
              {isFounder && (
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="btn-primary text-xs !py-1.5 !px-3.5"
                >
                  {showTaskForm ? <><FiX size={12} /> Cancel</> : <><FiPlus size={12} /> Assign Task</>}
                </button>
              )}
            </div>

            {/* Task form */}
            {showTaskForm && isFounder && (
              <form onSubmit={handleAssignTask} className="mb-6 p-4 rounded-xl border dark:border-secondary-700/50 dark:bg-secondary-800/30 light:border-secondary-200 light:bg-secondary-50 space-y-3 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Task Title</label>
                    <input className="input-field text-sm" placeholder="e.g. Design landing page" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="form-label">Assign To</label>
                    <select
                      className="input-field text-sm"
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      required
                    >
                      <option value="">Select Team Member</option>
                      {startup?.teamMembers?.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea className="textarea-field text-sm" rows={2} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Deadline</label>
                    <input type="date" className="input-field text-sm" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary text-xs">Assign Task</button>
              </form>
            )}

            {!tasks.length ? (
              <p className="text-sm text-muted text-center py-8">No tasks assigned to this startup yet.</p>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div key={task._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border
                    dark:border-secondary-800/60 dark:bg-secondary-800/20 light:border-secondary-200 light:bg-secondary-50">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        task.status === 'done' ? 'bg-success-500' :
                        task.status === 'in-progress' ? 'bg-warning-500' : 'bg-primary-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-heading">{task.title}</p>
                        {task.description && <p className="text-xs text-muted mt-0.5 truncate">{task.description}</p>}
                        {task.deadline && (
                          <span className="text-xs text-muted flex items-center gap-1 mt-1">
                            <FiClock size={10} />
                            Due {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatus(task._id, e.target.value)}
                      className="input-field !py-1.5 text-xs !w-auto flex-shrink-0"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupDetailsPage;
