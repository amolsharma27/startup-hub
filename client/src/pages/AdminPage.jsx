import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getAuthToken } from '../utils/auth';
import AdminLayout from '../components/AdminLayout';
import {
  FiUsers, FiBriefcase, FiTrash2,
  FiShield, FiSearch, FiMail, FiMessageSquare,
  FiCheckCircle, FiExternalLink, FiClock, FiFilter,
  FiSend, FiChevronRight,
} from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const map = {
    open:   'badge badge-green',
    closed: 'badge badge-red',
    draft:  'badge badge-yellow',
  };
  return <span className={map[status] || 'badge badge-gray capitalize'}>{status}</span>;
};

const RoleBadge = ({ role }) => {
  const map = {
    admin:   'badge badge-red',
    founder: 'badge badge-blue',
    mentor:  'badge badge-purple',
    member:  'badge badge-teal',
  };
  return <span className={map[role] || 'badge badge-gray capitalize'}>{role}</span>;
};

const MessageStatusBadge = ({ status }) => {
  const map = {
    unread:  'bg-danger-500/10 text-danger-500 border border-danger-500/20',
    read:    'bg-secondary-500/10 text-secondary-400 border border-secondary-500/20',
    replied: 'bg-success-500/10 text-success-500 border border-success-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

// Custom SVG Bar Chart Component for Premium look without external libs
const SimpleSVGChart = ({ title, rawData, color }) => {
  if (!rawData || rawData.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-muted">
        No monthly data available
      </div>
    );
  }

  const maxVal = Math.max(...rawData.map(d => d.count), 1);
  const chartHeight = 120;
  const padding = 15;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</p>
      <div className="flex items-end justify-between gap-2 h-[120px] pt-4 border-b border-secondary-800/40">
        {rawData.map((d, index) => {
          const barHeight = (d.count / maxVal) * (chartHeight - padding);
          
          // Format '2026-07' to 'Jul'
          const date = new Date(d._id + '-02'); // add day to avoid timezone issue
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });

          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary-950 border border-secondary-800 text-white text-[10px] font-bold py-1 px-1.5 rounded-lg pointer-events-none z-20">
                {d.count}
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full rounded-t-md transition-all duration-500 ease-out`}
                style={{ 
                  height: `${barHeight || 4}px`, 
                  background: color || '#c41e3a',
                  opacity: barHeight === 0 ? 0.2 : 0.8
                }}
              />
              {/* Label */}
              <span className="text-[9px] text-muted font-bold mt-1.5 uppercase truncate max-w-full">
                {monthName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminPage = ({ user, showToast }) => {
  const navigate = useNavigate();
  const [activeTab,         setActiveTab]     = useState('dashboard');
  const [dashboard,         setDashboard]     = useState(null);
  const [charts,            setCharts]        = useState(null);
  const [users,             setUsers]         = useState([]);
  const [startups,          setStartups]      = useState([]);
  const [contacts,          setContacts]      = useState([]);
  
  // Search states
  const [userSearch,    setUserSearch]    = useState('');
  const [startupSearch, setStartupSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  // Filter states
  const [roleFilter,    setRoleFilter]    = useState('all');
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [msgFilter,     setMsgFilter]     = useState('all');
  const [sortOrder,     setSortOrder]     = useState('newest');

  const [loading,       setLoading]       = useState(true);
  const [submitting,    setSubmitting]    = useState(false);
  const [replyText,     setReplyText]     = useState({});

  // Confirmation Modals State
  const [confirmModal,  setConfirmModal]  = useState({ show: false, type: '', id: '', name: '' });

  // Security Check: Redirect immediately if not admin
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate('/login', { replace: true });
    } else if (user && user.role !== 'admin') {
      showToast?.('Access denied. Admin authorization required.', 'error');
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [db, ud, sd, md] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/startups'),
        api.get('/admin/contacts'),
      ]);
      setDashboard(db.totals);
      setCharts(db.charts);
      setUsers(ud.users || []);
      setStartups(sd.startups || []);
      setContacts(md.contacts || []);
    } catch (err) {
      showToast?.(err.message || 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  // Delete Startup Action
  const performDeleteStartup = async (id) => {
    try {
      setSubmitting(true);
      await api.delete(`/admin/startups/${id}`);
      showToast('Startup and applications deleted successfully', 'success');
      setStartups((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete startup', 'error');
    } finally {
      setSubmitting(false);
      setConfirmModal({ show: false, type: '', id: '', name: '' });
    }
  };

  // Delete User Action
  const performDeleteUser = async (id) => {
    try {
      setSubmitting(true);
      await api.delete(`/admin/users/${id}`);
      showToast('User and associated data deleted successfully', 'success');
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setSubmitting(false);
      setConfirmModal({ show: false, type: '', id: '', name: '' });
    }
  };

  // Contact Message Actions
  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/admin/contacts/${id}/read`, {});
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: 'read' } : c))
      );
      showToast('Message marked as read', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update message', 'error');
    }
  };

  const handleReplyMessage = async (id) => {
    const text = replyText[id];
    if (!text || !text.trim()) return;
    try {
      await api.post(`/admin/contacts/${id}/reply`, { reply: text });
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, reply: text, status: 'replied' } : c))
      );
      setReplyText((prev) => ({ ...prev, [id]: '' }));
      showToast('Reply saved and message status updated', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit reply', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      showToast('Message deleted successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete message', 'error');
    }
  };

  const triggerConfirmation = (type, id, name) => {
    setConfirmModal({ show: true, type, id, name });
  };

  // Sort and Filters processing
  const getSortedData = (data) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  };

  const filteredUsers = getSortedData(users.filter((u) => {
    const matchesSearch = !userSearch || u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase()) || u._id?.includes(userSearch);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  }));

  const filteredStartups = getSortedData(startups.filter((s) => {
    const matchesSearch = !startupSearch || s.name?.toLowerCase().includes(startupSearch.toLowerCase()) || s.founder?.name?.toLowerCase().includes(startupSearch.toLowerCase()) || s._id?.includes(startupSearch);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  const filteredContacts = getSortedData(contacts.filter((c) => {
    const matchesSearch = !contactSearch || c.name?.toLowerCase().includes(contactSearch.toLowerCase()) || c.email?.toLowerCase().includes(contactSearch.toLowerCase()) || c.subject?.toLowerCase().includes(contactSearch.toLowerCase()) || c.message?.toLowerCase().includes(contactSearch.toLowerCase());
    const matchesMsgStatus = msgFilter === 'all' || c.status === msgFilter;
    return matchesSearch && matchesMsgStatus;
  }));

  const tabs = [
    { id: 'dashboard',  label: 'Overview',    icon: FiShield },
    { id: 'users',      label: 'Users',       icon: FiUsers,    count: users.length },
    { id: 'startups',   label: 'Startups',    icon: FiBriefcase, count: startups.length },
    { id: 'contacts',   label: 'Messages',    icon: FiMessageSquare, count: contacts.filter(c => c.status === 'unread').length },
  ];

  if (!user || user.role !== 'admin' || loading) {
    return (
      <AdminLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
        <div className="p-6 md:p-8">
          <div className="max-w-5xl mx-auto space-y-5">
            <div className="skeleton h-8 w-40 rounded-xl" />
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
            <div className="skeleton h-64 rounded-2xl animate-pulse" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
    <div className="p-5 md:p-8 relative">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-2xl font-extrabold text-heading">Admin Console</h1>
              <span className="badge badge-red uppercase tracking-wider font-semibold">Restricted</span>
            </div>
            <p className="text-sm text-muted">Monitor statistics, manage platform users, review startups, and reply to inquiries.</p>
          </div>
        </div>


        {/* ════════════════════════════════
            OVERVIEW TAB
        ════════════════════════════════ */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Metric Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: 'Total Users Registered', value: dashboard?.users || 0, sub: `${dashboard?.founders || 0} Founders · ${dashboard?.teamMembers || 0} Members · ${dashboard?.mentors || 0} Mentors`, color: 'border-l-primary-500' },
                { label: 'Total Startups Registered', value: dashboard?.startups || 0, sub: `${dashboard?.activeStartups || 0} Active · ${dashboard?.closedStartups || 0} Closed`, color: 'border-l-success-500' },
                { label: 'Contact Messages & Applications', value: dashboard?.contactMessages || 0, sub: `${dashboard?.pendingApplications || 0} Pending Applications`, color: 'border-l-warning-500' }
              ].map(({ label, value, sub, color }) => (
                <div key={label} className={`card p-6 flex flex-col justify-between border-l-4 ${color} hover:-translate-y-0.5 transition-all duration-200`}>
                  <p className="text-xs text-muted uppercase tracking-wider font-bold">{label}</p>
                  <p className="text-3xl font-black text-heading my-2">{value}</p>
                  <p className="text-[11px] text-muted font-medium">{sub}</p>
                </div>
              ))}
            </div>

            {/* Growth Charts */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-5">
                <SimpleSVGChart title="Users Registered per Month" rawData={charts?.users} color="#c41e3a" />
              </div>
              <div className="card p-5">
                <SimpleSVGChart title="Startups Created per Month" rawData={charts?.startups} color="#e11d48" />
              </div>
              <div className="card p-5">
                <SimpleSVGChart title="Messages Received per Month" rawData={charts?.contacts} color="#475569" />
              </div>
            </div>

            {/* Quick summaries list */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent registered users */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b dark:border-secondary-800/60 flex items-center justify-between">
                  <p className="text-sm font-extrabold text-heading">Recent Registrations</p>
                  <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    Manage All <FiChevronRight />
                  </button>
                </div>
                <div className="divide-y dark:divide-secondary-800/60">
                  {users.slice(0, 5).map((u) => (
                    <div key={u._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary-50/50 dark:hover:bg-secondary-850/30 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-heading truncate">{u.name}</p>
                          <p className="text-[10px] text-muted truncate">{u.email}</p>
                        </div>
                      </div>
                      <RoleBadge role={u.role} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent registered startups */}
              <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b dark:border-secondary-800/60 flex items-center justify-between">
                  <p className="text-sm font-extrabold text-heading">Recent Startups</p>
                  <button onClick={() => setActiveTab('startups')} className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1">
                    Manage All <FiChevronRight />
                  </button>
                </div>
                <div className="divide-y dark:divide-secondary-800/60">
                  {startups.slice(0, 5).map((s) => (
                    <div key={s._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary-50/50 dark:hover:bg-secondary-850/30 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-secondary-700 to-secondary-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-heading truncate">{s.name}</p>
                          <p className="text-[10px] text-muted truncate">Founder: {s.founder?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            USERS TAB
        ════════════════════════════════ */}
        {activeTab === 'users' && (
          <div className="animate-fade-in space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative max-w-sm flex-1">
                <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field pl-10 text-xs font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiFilter size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Role:</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="founder">Founder</option>
                    <option value="member">Team Member</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiClock size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Sort:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest Joined</option>
                    <option value="oldest">Oldest Joined</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">User Info</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">User ID</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Role</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Joined Date</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Created/Joined</th>
                      <th className="text-center px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-secondary-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="table-row hover:bg-secondary-50/20 dark:hover:bg-secondary-850/10">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-heading block truncate">{u.name}</span>
                              <span className="text-[10px] text-muted block truncate mt-0.5">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono text-muted">{u._id}</td>
                        <td className="px-5 py-4"><RoleBadge role={u.role} /></td>
                        <td className="px-5 py-4 text-muted text-xs font-medium">
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4 text-muted text-xs font-bold">
                          <span className="text-primary-500">{u.startupsCreated || 0}</span> Created · <span className="text-secondary-400">{u.startupsJoined || 0}</span> Joined
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <Link to={`/users/${u._id}`} className="p-2 text-muted hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all" title="View Profile">
                              <FiExternalLink size={14} />
                            </Link>
                            {u.role !== 'admin' && (
                              <button
                                onClick={() => triggerConfirmation('user', u._id, u.name)}
                                className="p-2 text-danger-400 hover:text-danger-500 hover:bg-danger-500/10 rounded-xl transition-all"
                                title="Delete User"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <div className="text-center text-sm text-muted py-14">
                    <FiUsers size={28} className="mx-auto mb-3 opacity-30" />
                    No registered users match your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            STARTUPS TAB
        ════════════════════════════════ */}
        {activeTab === 'startups' && (
          <div className="animate-fade-in space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative max-w-sm flex-1">
                <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by startup name, founder, or ID..."
                  value={startupSearch}
                  onChange={(e) => setStartupSearch(e.target.value)}
                  className="input-field pl-10 text-xs font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiFilter size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiClock size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Sort:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest Created</option>
                    <option value="oldest">Oldest Created</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Startups Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="table-header">
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Startup Name</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Founder Details</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Category</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Team Size</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Status</th>
                      <th className="text-left px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Created Date</th>
                      <th className="text-center px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-secondary-800/60">
                    {filteredStartups.map((s) => (
                      <tr key={s._id} className="table-row hover:bg-secondary-50/20 dark:hover:bg-secondary-850/10">
                        <td className="px-5 py-4">
                          <span className="font-extrabold text-heading block">{s.name}</span>
                          <span className="text-[10px] font-mono text-muted block mt-0.5">{s._id}</span>
                        </td>
                        <td className="px-5 py-4">
                          {s.founder ? (
                            <Link to={`/users/${s.founder._id}`} className="hover:underline">
                              <span className="font-semibold text-heading block">{s.founder.name}</span>
                              <span className="text-[10px] text-muted block mt-0.5">{s.founder.email}</span>
                            </Link>
                          ) : (
                            <span className="text-xs text-muted font-medium italic">Deleted User</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-semibold text-heading bg-secondary-100 dark:bg-secondary-850 px-2.5 py-1 rounded-lg">
                            {s.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-heading text-xs">
                          {s.teamMembers?.length || 0} Members
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                        <td className="px-5 py-4 text-muted text-xs font-medium">
                          {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <Link to={`/startups/${s._id}`} className="p-2 text-muted hover:text-primary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-xl transition-all" title="View Startup">
                              <FiExternalLink size={14} />
                            </Link>
                            <button
                              onClick={() => triggerConfirmation('startup', s._id, s.name)}
                              className="p-2 text-danger-400 hover:text-danger-500 hover:bg-danger-500/10 rounded-xl transition-all"
                              title="Delete Startup"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredStartups.length === 0 && (
                  <div className="text-center text-sm text-muted py-14">
                    <FiBriefcase size={28} className="mx-auto mb-3 opacity-30" />
                    No registered startups match your search filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════
            CONTACT MESSAGES TAB
        ════════════════════════════════ */}
        {activeTab === 'contacts' && (
          <div className="animate-fade-in space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative max-w-sm flex-1">
                <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sender, email, subject, content..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className="input-field pl-10 text-xs font-semibold"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiFilter size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Status:</span>
                  <select
                    value={msgFilter}
                    onChange={(e) => setMsgFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-secondary-100 dark:bg-secondary-800 px-3 py-1.5 rounded-xl border border-secondary-200 dark:border-secondary-700">
                  <FiClock size={11} className="text-muted" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Sort:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent text-xs font-bold text-heading focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredContacts.map((c) => (
                <div key={c._id} className={`card p-5 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden ${
                  c.status === 'unread' ? 'border-l-4 border-l-danger-500' : ''
                }`}>
                  {/* Top Bar info */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b dark:border-secondary-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-heading text-sm">{c.name}</span>
                        <span className="text-xs text-muted">({c.email})</span>
                        <MessageStatusBadge status={c.status} />
                      </div>
                      <h3 className="text-xs text-heading font-black mt-1 uppercase tracking-wide">
                        Subject: <span className="text-primary-500 normal-case font-bold">{c.subject || 'No Subject'}</span>
                      </h3>
                    </div>
                    <span className="text-xs text-muted flex items-center gap-1.5 font-semibold">
                      <FiClock size={11} />
                      {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="bg-secondary-50 dark:bg-secondary-950 p-4 rounded-2xl border dark:border-secondary-800 text-xs font-medium text-body leading-relaxed whitespace-pre-wrap">
                    {c.message}
                  </div>

                  {/* Admin Reply Display */}
                  {c.reply && (
                    <div className="bg-primary-500/5 dark:bg-primary-950/20 border border-primary-500/10 p-4 rounded-2xl space-y-1">
                      <p className="text-[10px] text-primary-500 uppercase tracking-widest font-black flex items-center gap-1">
                        <FiCheckCircle size={10} /> Admin Response
                      </p>
                      <p className="text-xs text-heading font-medium leading-relaxed">{c.reply}</p>
                    </div>
                  )}

                  {/* Operations bar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      {c.status === 'unread' && (
                        <button
                          onClick={() => handleMarkAsRead(c._id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-heading bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-xl transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteMessage(c._id)}
                        className="p-2 text-danger-400 hover:text-danger-500 hover:bg-danger-500/10 rounded-xl transition-all"
                        title="Delete Message"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>

                    {/* Quick Inline Reply Input */}
                    {!c.reply && (
                      <div className="flex items-center gap-2 flex-1 max-w-md">
                        <input
                          type="text"
                          placeholder="Type response to store..."
                          value={replyText[c._id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [c._id]: e.target.value })}
                          className="input-field py-1.5 px-3 text-xs font-semibold flex-1 rounded-xl"
                        />
                        <button
                          onClick={() => handleReplyMessage(c._id)}
                          disabled={!replyText[c._id]?.trim()}
                          className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center flex-shrink-0"
                          title="Save Reply"
                        >
                          <FiSend size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredContacts.length === 0 && (
                <div className="text-center text-sm text-muted py-14 card">
                  <FiMail size={28} className="mx-auto mb-3 opacity-30" />
                  No contact submissions match your search parameters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════════════════════════════════
          CONFIRMATION DIALOG MODAL
      ════════════════════════════════ */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-secondary-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="card max-w-md w-full p-6 space-y-4 border border-secondary-200 dark:border-secondary-800 animate-scale-in">
            <h3 className="text-base font-extrabold text-heading uppercase tracking-wide">
              Confirm Permanent Deletion
            </h3>
            
            <p className="text-xs text-muted leading-relaxed font-semibold">
              Are you sure you want to delete the {confirmModal.type === 'user' ? 'user' : 'startup'}{' '}
              <span className="text-primary-500 font-extrabold">"{confirmModal.name}"</span>? 
              {confirmModal.type === 'user' 
                ? ' This will permanently remove their profile and delete all startups they founded.'
                : ' This will permanently remove the startup and delete all applicant submissions.'
              } This operation is irreversible.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ show: false, type: '', id: '', name: '' })}
                className="px-4 py-2 text-xs font-bold text-heading bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 rounded-xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmModal.type === 'user' ? performDeleteUser(confirmModal.id) : performDeleteStartup(confirmModal.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-danger-600 hover:bg-danger-700 rounded-xl transition-colors shadow-md shadow-danger-500/10 flex items-center gap-1.5"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiTrash2 size={12} />
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default AdminPage;
