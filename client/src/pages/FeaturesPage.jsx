import { useState } from 'react';
import {
  FiUsers, FiTarget, FiCheckCircle, FiMessageSquare,
  FiTrendingUp, FiShield, FiBriefcase, FiSend, FiCheck,
  FiZap,
} from 'react-icons/fi';

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
    dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400
    light:bg-primary-50 light:border-primary-200 light:text-primary-600">
    <FiZap size={11} />{children}
  </span>
);

const FEATURES = [
  {
    icon: FiUsers,
    title: 'Team Construction & Management',
    desc: 'Add core staff, set permissions, manage member tasks, and coordinate workflow metrics from an integrated admin terminal.',
    tone: 'icon-tile-blue',
  },
  {
    icon: FiTarget,
    title: 'Intelligent Talent Recruitment',
    desc: 'Structure public job application forms, filter candidate pools, check profile tags, and invite builders to team workspaces.',
    tone: 'icon-tile-amber',
  },
  {
    icon: FiCheckCircle,
    title: 'Agile Task Operations',
    desc: 'Assign sprints, write task definitions, update progress status checks, and keep milestones organised chronologically.',
    tone: 'icon-tile-blue',
  },
  {
    icon: FiMessageSquare,
    title: 'Real-Time Team Channels',
    desc: 'Full chat capability using WebSocket channels, enabling members to share design feedback and updates instantly.',
    tone: 'icon-tile-teal',
  },
  {
    icon: FiTrendingUp,
    title: 'Advisor & Mentorship Links',
    desc: 'Connect directly with certified advisors, send collaboration request sheets, and set up live review panels.',
    tone: 'icon-tile-teal',
  },
  {
    icon: FiShield,
    title: 'Enterprise-Grade Security',
    desc: 'Protected data layers using JWT authentication, role-based access control, and industry-standard encryption.',
    tone: 'icon-tile-blue',
  },
];

/* ── Simulator ── */
const Simulator = () => {
  const [activeRole, setActiveRole] = useState('founder');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Design marketing website landing page', completed: false, assignee: 'Alex Morgan' },
    { id: 2, name: 'Setup Node/Express Server routing',      completed: true,  assignee: 'Emma Stone' },
    { id: 3, name: 'Connect MongoDB schemas & indexes',       completed: false, assignee: 'John Doe' },
  ]);
  const [messages, setMessages] = useState([
    { sender: 'Emma', text: 'Hey! Database models are connected.', time: '10:45 AM' },
    { sender: 'Alex', text: "Awesome! I'm finishing up the landing page design now.", time: '10:48 AM' },
  ]);
  const [newMsg, setNewMsg] = useState('');
  const [applications, setApplications] = useState([
    { id: 1, name: 'Sarah Jenkins', role: 'Full Stack Engineer', status: 'Pending' },
    { id: 2, name: 'David Miller',  role: 'UI/UX Designer',      status: 'Accepted' },
  ]);

  const toggleTask = (id) => setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMessages([...messages, { sender: 'You', text: newMsg, time: 'Just now' }]);
    setNewMsg('');
  };
  const handleApp = (id, status) => setApplications(applications.map((a) => a.id === id ? { ...a, status } : a));

  const personas = [
    { id: 'founder', label: 'Founder Dashboard', icon: FiBriefcase },
    { id: 'member',  label: 'Member Console',     icon: FiUsers },
    { id: 'mentor',  label: 'Mentor Platform',    icon: FiTrendingUp },
  ];

  return (
    <div className="card p-6 md:p-10 border-primary-500/20">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">Interactive Simulator</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-heading mb-2">Explore the platform live</h2>
        <p className="text-sm text-muted">Select a user persona to see their dashboard experience</p>
      </div>

      {/* Persona tabs */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-8">
        {personas.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveRole(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeRole === id
                ? 'btn-primary'
                : 'dark:border dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/30 dark:hover:text-primary-400 light:border light:border-secondary-200 light:text-secondary-600 light:hover:border-primary-300'
            }`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Main panel */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl overflow-hidden border dark:border-secondary-800/60 light:border-secondary-200">
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b dark:border-secondary-800/60 light:border-secondary-200 dark:bg-secondary-900/60 light:bg-secondary-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-danger-400" />
              <span className="w-3 h-3 rounded-full bg-warning-400" />
              <span className="w-3 h-3 rounded-full bg-success-400" />
            </div>
            <span className="text-xs text-muted font-mono">{activeRole}-console.sh</span>
            <div className="w-12 h-1.5 dark:bg-secondary-700 light:bg-secondary-300 rounded-full" />
          </div>

          <div className="flex-1 p-5 dark:bg-secondary-900/20 light:bg-secondary-50/50">
            {/* Founder view */}
            {activeRole === 'founder' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-heading">Applications for EcoSmart Tech</h3>
                  <span className="badge badge-yellow">2 Pending</span>
                </div>
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3.5 rounded-xl border dark:border-secondary-800/60 dark:bg-secondary-800/30 light:border-secondary-200 light:bg-white transition-all">
                    <div>
                      <p className="text-sm font-semibold text-heading">{app.name}</p>
                      <p className="text-xs text-muted">{app.role}</p>
                    </div>
                    {app.status === 'Pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleApp(app.id, 'Accepted')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-success-500/10 text-success-400 border border-success-500/20 hover:bg-success-500/20 transition-all">Accept</button>
                        <button onClick={() => handleApp(app.id, 'Rejected')} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-danger-500/10 text-danger-400 border border-danger-500/20 hover:bg-danger-500/20 transition-all">Reject</button>
                      </div>
                    ) : (
                      <span className={`badge ${app.status === 'Accepted' ? 'badge-green' : 'badge-red'}`}>{app.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Member view */}
            {activeRole === 'member' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-heading">Task Board</h3>
                  <span className="badge badge-blue">{tasks.filter(t => !t.completed).length} remaining</span>
                </div>
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                      task.completed
                        ? 'dark:border-secondary-800/40 dark:bg-secondary-900/30 light:border-secondary-200 light:bg-secondary-100 opacity-60'
                        : 'dark:border-secondary-700/60 dark:bg-secondary-800/30 light:border-secondary-200 light:bg-white hover:dark:border-primary-500/30 hover:light:border-primary-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed ? 'bg-primary-500 border-primary-500 text-white' : 'dark:border-secondary-600 light:border-secondary-400'
                    }`}>
                      {task.completed && <FiCheck size={11} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted' : 'text-heading'}`}>{task.name}</p>
                      <p className="text-xs text-muted">Assignee: {task.assignee}</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted text-center pt-1">Click a task to toggle completion</p>
              </div>
            )}

            {/* Mentor view */}
            {activeRole === 'mentor' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-heading mb-3">Mentorship Requests</h3>
                <div className="p-4 rounded-xl border dark:border-secondary-700/60 dark:bg-secondary-800/30 light:border-secondary-200 light:bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-heading">Solarix CleanTech</p>
                      <p className="text-xs text-muted">Founder: Robert Vance</p>
                    </div>
                    <span className="badge badge-yellow">Awaiting</span>
                  </div>
                  <p className="text-xs text-muted line-clamp-2 mb-3">
                    "We are developing decentralised solar grids and seek mentorship regarding enterprise sales cycles and hardware supply chain logistics."
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 btn-primary text-xs">Accept Mentorship</button>
                    <button className="px-3 py-2 text-xs btn-outline">Decline</button>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t dark:border-secondary-800/60 light:border-secondary-200">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-xs font-bold">MT</div>
                  <div>
                    <p className="text-xs font-semibold text-heading">Next Mentoring Call</p>
                    <p className="text-xs text-muted">July 15, 2026 · 4:30 PM</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat sandbox */}
        <div className="lg:col-span-4 flex flex-col rounded-2xl overflow-hidden border dark:border-secondary-800/60 light:border-secondary-200">
          <div className="flex items-center gap-2 px-4 py-3 border-b dark:border-secondary-800/60 light:border-secondary-200 dark:bg-secondary-900/60 light:bg-secondary-100">
            <span className="w-2.5 h-2.5 bg-success-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-heading">Live Sandbox Chat</span>
          </div>
          <div className="flex-1 p-4 space-y-2.5 overflow-y-auto max-h-64 dark:bg-secondary-900/10 light:bg-secondary-50/30 flex flex-col justify-end">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-muted mb-0.5">{m.sender} · {m.time}</span>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-xs leading-snug ${
                  m.sender === 'You'
                    ? 'bg-primary-500 text-white rounded-br-none'
                    : 'dark:bg-secondary-800 light:bg-white border dark:border-secondary-700/50 light:border-secondary-200 text-heading rounded-bl-none'
                }`}>{m.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t dark:border-secondary-800/60 light:border-secondary-200 dark:bg-secondary-900/40 light:bg-secondary-50">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message…"
              className="input-field flex-1 text-xs !py-2"
            />
            <button type="submit" className="btn-primary !px-3 !py-2">
              <FiSend size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FeaturesPage = () => (
  <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto animate-fade-in">

    {/* Header */}
    <div className="text-center mb-16 space-y-4">
      <SectionLabel>Platform Capabilities</SectionLabel>
      <h1 className="text-4xl md:text-6xl font-extrabold text-heading leading-tight">
        Tools built for the{' '}
        <span className="gradient-text">future</span>
        {' '}of startups
      </h1>
      <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
        StartupHub is loaded with collaborative workflow features tailored to help builders, contributors, and advisors construct category-defining businesses together.
      </p>
    </div>

    {/* Interactive simulator */}
    <div className="mb-20">
      <Simulator />
    </div>

    {/* Features grid */}
    <div className="mb-16">
      <div className="text-center mb-10 space-y-3">
        <SectionLabel>Full Feature Set</SectionLabel>
        <h2 className="text-2xl md:text-4xl font-extrabold text-heading">Everything in one place</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc, tone }, i) => (
          <div
            key={title}
            className="card p-7 group hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`icon-tile ${tone} w-12 h-12 rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={20} />
            </div>
            <h3 className="text-base font-bold text-heading mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default FeaturesPage;
