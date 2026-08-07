import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiTrendingUp, FiUsers, FiBriefcase, FiCheckCircle,
  FiArrowRight, FiPlus, FiZap, FiClock, FiTarget,
  FiMessageSquare, FiShield, FiActivity,
} from 'react-icons/fi';

/* ── Animated stat card ── */
const StatCard = ({ icon: Icon, label, value, subtitle, tone = 'blue', delay = 0 }) => {
  const tones = {
    blue:   { tile: 'icon-tile-blue',   ring: 'dark:ring-primary-500/20 light:ring-primary-200', val: 'text-primary-400' },
    teal:   { tile: 'icon-tile-teal',   ring: 'dark:ring-accent-500/20  light:ring-accent-200',  val: 'text-accent-400'  },
    green:  { tile: 'icon-tile-green',  ring: 'dark:ring-success-500/20 light:ring-success-200', val: 'text-success-400' },
    amber:  { tile: 'icon-tile-amber',  ring: 'dark:ring-warning-500/20 light:ring-warning-200', val: 'text-warning-400' },
    purple: { tile: 'icon-tile-purple', ring: 'dark:ring-purple-500/20  light:ring-purple-200',  val: 'text-purple-400'  },
  };
  const t = tones[tone] || tones.blue;

  return (
    <div
      className="card p-5 flex items-start justify-between gap-4 hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-3xl font-extrabold ${t.val} leading-none`}>{value}</p>
        {subtitle && <p className="text-xs text-muted mt-1.5">{subtitle}</p>}
      </div>
      <div className={`icon-tile ${t.tile} w-12 h-12 rounded-xl flex-shrink-0`}>
        <Icon size={20} />
      </div>
    </div>
  );
};

/* ── Empty state ── */
const Empty = ({ icon: Icon, title, desc, action, actionTo }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-base font-semibold text-heading mb-1">{title}</h3>
    <p className="text-sm text-muted max-w-xs mb-5">{desc}</p>
    {action && (
      <Link to={actionTo} className="btn-primary text-sm">
        <FiPlus size={14} /> {action}
      </Link>
    )}
  </div>
);

/* ── Section header ── */
const SectionHeader = ({ title, linkTo, linkLabel = 'View All' }) => (
  <div className="flex items-center justify-between mb-5">
    <h2 className="text-base font-semibold text-heading">{title}</h2>
    {linkTo && (
      <Link
        to={linkTo}
        className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group"
      >
        {linkLabel}
        <FiArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

/* ── Status badge helper ── */
const StatusBadge = ({ status }) => {
  const map = {
    open:         'badge badge-green',
    closed:       'badge badge-red',
    draft:        'badge badge-yellow',
    done:         'badge badge-green',
    'in-progress':'badge badge-yellow',
    todo:         'badge badge-blue',
    pending:      'badge badge-yellow',
    accepted:     'badge badge-green',
    rejected:     'badge badge-red',
  };
  return <span className={map[status] || 'badge badge-gray'}>{status}</span>;
};

/* ══════════════════════════════════════════════════════════════
   ROLE DASHBOARDS
══════════════════════════════════════════════════════════════ */

/* ── Founder ── */
const FounderDashboard = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiBriefcase}   label="My Startups"    value={stats?.total || 0}   subtitle="Total ventures created"  tone="blue"   delay={0}   />
      <StatCard icon={FiUsers}       label="Team Members"   value={stats?.members || 0} subtitle="Across all startups"     tone="teal"   delay={60}  />
      <StatCard icon={FiTarget}      label="Open Positions" value={stats?.open || 0}    subtitle="Currently recruiting"    tone="amber"  delay={120} />
    </div>

    <div className="card p-6">
      <SectionHeader title="My Startups" linkTo="/startups" linkLabel="Manage All" />
      {!stats?.startups?.length ? (
        <Empty icon={FiPlus} title="No startups yet" desc="Create your first startup to get started." action="Create Startup" actionTo="/startups" />
      ) : (
        <div className="space-y-3">
          {stats.startups.map((s, i) => (
            <div
              key={s._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200
                dark:border-secondary-800/60 dark:hover:border-primary-500/30 dark:bg-secondary-800/20
                light:border-secondary-200 light:hover:border-primary-300 light:bg-secondary-50/50
                animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-heading truncate">{s.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-muted">{s.teamMembers?.length || 0} members</span>
                  </div>
                </div>
              </div>
              <Link to={`/startups/${s._id}`} className="btn-outline text-xs !py-1.5 !px-4 flex-shrink-0">
                Manage
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── Member ── */
const MemberDashboard = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiCheckCircle} label="Assigned Tasks" value={stats?.tasks?.length || 0}                                       subtitle="Total tasks"     tone="blue"  delay={0}   />
      <StatCard icon={FiZap}         label="In Progress"    value={stats?.tasks?.filter(t => t.status === 'in-progress').length || 0} subtitle="Currently active" tone="amber" delay={60}  />
      <StatCard icon={FiTrendingUp}  label="Completed"      value={stats?.tasks?.filter(t => t.status === 'done').length || 0}        subtitle="Tasks finished"  tone="green" delay={120} />
    </div>

    <div className="card p-6">
      <SectionHeader title="My Tasks" linkTo="/tasks" />
      {!stats?.tasks?.length ? (
        <Empty icon={FiCheckCircle} title="No tasks yet" desc="Once you're added to a startup, tasks will appear here." />
      ) : (
        <div className="space-y-2.5">
          {stats.tasks.slice(0, 8).map((task, i) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-4 rounded-xl border transition-all duration-200
                dark:border-secondary-800/60 dark:hover:border-primary-500/20 dark:bg-secondary-800/20
                light:border-secondary-200 light:hover:border-primary-300 light:bg-secondary-50/50
                animate-fade-in-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  task.status === 'done' ? 'bg-success-500' :
                  task.status === 'in-progress' ? 'bg-warning-500' : 'bg-primary-500'
                }`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-heading truncate">{task.title}</p>
                  {task.startup?.name && (
                    <p className="text-xs text-muted mt-0.5">{task.startup.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {task.deadline && (
                  <span className="text-xs text-muted flex items-center gap-1">
                    <FiClock size={10} />
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── Mentor ── */
const MentorDashboard = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard icon={FiUsers}       label="Total Requests" value={stats?.requests?.length || 0}                                          subtitle="All time"           tone="blue"  delay={0}   />
      <StatCard icon={FiZap}         label="Pending"        value={stats?.requests?.filter(r => r.status === 'pending').length || 0}       subtitle="Awaiting your review" tone="amber" delay={60}  />
      <StatCard icon={FiCheckCircle} label="Active Mentees" value={stats?.requests?.filter(r => r.status === 'accepted').length || 0}      subtitle="Currently guiding"  tone="green" delay={120} />
    </div>

    <div className="card p-6">
      <SectionHeader title="Mentorship Requests" linkTo="/mentorship" />
      {!stats?.requests?.length ? (
        <Empty icon={FiUsers} title="No requests yet" desc="When someone sends you a mentorship request it will appear here." />
      ) : (
        <div className="space-y-3">
          {stats.requests.slice(0, 6).map((req, i) => (
            <div
              key={req._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200
                dark:border-secondary-800/60 dark:hover:border-primary-500/20 dark:bg-secondary-800/20
                light:border-secondary-200 light:bg-secondary-50/50 animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {req.mentee?.name?.charAt(0) || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-heading truncate">{req.mentee?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted truncate max-w-xs">{req.message}</p>
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── Admin ── */
const AdminDashboard = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={FiUsers}    label="Total Users"    value={stats?.users || 0}      tone="blue"   delay={0}   />
      <StatCard icon={FiBriefcase} label="Startups"      value={stats?.startups || 0}   tone="teal"   delay={60}  />
      <StatCard icon={FiActivity}  label="Categories"    value={stats?.categories || 0} tone="purple" delay={120} />
      <StatCard icon={FiShield}    label="Platform"      value="Live"                   subtitle="All systems operational" tone="green" delay={180} />
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div className="card p-6">
        <SectionHeader title="Quick Actions" />
        <div className="space-y-2.5">
          {[
            { to: '/admin', label: 'Manage Users',      icon: FiUsers,     color: 'text-primary-400' },
            { to: '/admin', label: 'Manage Startups',   icon: FiBriefcase, color: 'text-accent-400'  },
            { to: '/admin', label: 'Manage Categories', icon: FiActivity,  color: 'text-purple-400'  },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200
                dark:hover:bg-secondary-800 light:hover:bg-secondary-100 group"
            >
              <Icon size={16} className={`${color} flex-shrink-0`} />
              <span className="text-sm font-medium text-body group-hover:text-heading transition-colors">{label}</span>
              <FiArrowRight size={13} className="ml-auto text-muted group-hover:text-primary-400 transition-colors group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <SectionHeader title="Platform Health" />
        <div className="space-y-4">
          {[
            { label: 'API Uptime',       val: '99.9%', color: 'bg-success-500', pct: 99 },
            { label: 'Active Sessions',  val: '2.4K',  color: 'bg-primary-500',  pct: 72 },
            { label: 'Storage Used',     val: '64%',   color: 'bg-warning-500',  pct: 64 },
          ].map(({ label, val, color, pct }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted">{label}</span>
                <span className="font-semibold text-heading">{val}</span>
              </div>
              <div className="h-1.5 dark:bg-secondary-800 light:bg-secondary-200 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
const DashboardPage = ({ user, showToast }) => {
  const [founderStats, setFounderStats] = useState(null);
  const [memberStats,  setMemberStats]  = useState(null);
  const [mentorStats,  setMentorStats]  = useState(null);
  const [adminStats,   setAdminStats]   = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        if (user.role === 'founder') {
          const data = await api.get('/startups');
          const myId = user._id || user.id;
          const mine = (data.startups || []).filter(
            (s) => s.founder?._id === myId || s.founder === myId
          );
          setFounderStats({
            total:   mine.length,
            members: mine.reduce((acc, s) => acc + (s.teamMembers?.length || 0), 0),
            open:    mine.filter((s) => s.status === 'open').length,
            startups: mine,
          });
        }
        if (user.role === 'member') {
          const td = await api.get('/tasks/user');
          setMemberStats({ tasks: td.tasks || [] });
        }
        if (user.role === 'mentor') {
          const md = await api.get('/mentorship');
          setMentorStats({ requests: md.mentorships || [] });
        }
        if (user.role === 'admin') {
          const ad = await api.get('/admin/dashboard');
          setAdminStats(ad.totals);
        }
      } catch (err) {
        showToast?.(err.message || 'Failed to load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const role = user?.role || 'member';

  const roleConfig = {
    founder: { label: 'Founder',     color: 'badge-blue',   greeting: 'Your startups are waiting.' },
    member:  { label: 'Team Member', color: 'badge-teal',   greeting: 'Check your latest tasks.' },
    mentor:  { label: 'Mentor',      color: 'badge-purple', greeting: 'Your mentees need you.' },
    admin:   { label: 'Admin',       color: 'badge-red',    greeting: 'Platform at a glance.' },
  };
  const rc = roleConfig[role] || roleConfig.member;

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Skeleton header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
              <div className="skeleton h-5 w-48" />
              <div className="skeleton h-8 w-72" />
            </div>
            <div className="flex gap-3">
              <div className="skeleton h-10 w-32 rounded-xl" />
              <div className="skeleton h-10 w-28 rounded-xl" />
            </div>
          </div>
          {/* Skeleton cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
          <div className="skeleton h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-2xl font-extrabold text-heading">Dashboard</h1>
              <span className={`badge ${rc.color} capitalize`}>{rc.label}</span>
            </div>
            <p className="text-sm text-muted">
              Welcome back, <span className="font-semibold text-heading">{user?.name || 'there'}</span>
              {' '}— {rc.greeting}
            </p>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            <Link to="/startups" className="btn-primary text-sm !py-2 !px-4">
              <FiBriefcase size={14} />
              <span className="hidden sm:inline">Browse Startups</span>
              <span className="sm:hidden">Startups</span>
            </Link>
            <Link to="/profile" className="btn-outline text-sm !py-2 !px-4">
              <span>My Profile</span>
            </Link>
          </div>
        </div>

        {/* ── Quick-action pills ── */}
        <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {[
            { to: '/startups',   label: 'Startups',      icon: FiBriefcase },
            { to: '/tasks',      label: 'Tasks',         icon: FiCheckCircle },
            { to: '/chat',       label: 'Chat',          icon: FiMessageSquare },
            { to: '/mentorship', label: 'Mentorship',    icon: FiUsers },
          ].map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/40 dark:hover:text-primary-400 dark:hover:bg-primary-500/5
                light:border-secondary-200  light:text-secondary-600 light:hover:border-primary-300  light:hover:text-primary-600 light:hover:bg-primary-50"
            >
              <Icon size={12} />
              {label}
            </Link>
          ))}
        </div>

        {/* ── Role-specific content ── */}
        {role === 'founder' && <FounderDashboard stats={founderStats} />}
        {role === 'member'  && <MemberDashboard  stats={memberStats}  />}
        {role === 'mentor'  && <MentorDashboard  stats={mentorStats}  />}
        {role === 'admin'   && <AdminDashboard   stats={adminStats}   />}
      </div>
    </div>
  );
};

export default DashboardPage;
