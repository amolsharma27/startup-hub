import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiUsers, FiSend, FiMessageSquare, FiStar,
  FiX, FiCheckCircle, FiXCircle, FiClock,
} from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const map = {
    pending:  'badge badge-yellow',
    accepted: 'badge badge-green',
    rejected: 'badge badge-red',
  };
  return <span className={map[status] || 'badge badge-gray capitalize'}>{status}</span>;
};

const MentorshipPage = ({ user, showToast }) => {
  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('requests');
  const [form,         setForm]         = useState({ mentor: '', message: '' });
  const [feedbackText, setFeedbackText] = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [mentors,      setMentors]      = useState([]);

  const isMentor = user?.role === 'mentor';

  const loadRequests = async () => {
    try {
      const data = await api.get('/mentorship');
      setRequests(data.mentorships || []);
    } catch (err) {
      showToast?.(err.message || 'Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    if (!isMentor) {
      const fetchMentors = async () => {
        try {
          const data = await api.get('/users/role/mentor');
          setMentors(data.mentors || []);
        } catch (err) {
          console.error('Failed to load mentors', err);
        }
      };
      fetchMentors();
    }
  }, [isMentor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/mentorship', form);
      showToast('Mentorship request sent', 'success');
      setForm({ mentor: '', message: '' });
      setActiveTab('requests');
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Failed to send request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/mentorship/${id}/status`, { status });
      showToast(`Request ${status}`, 'success');
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const handleFeedback = async (id) => {
    const text = feedbackText[id];
    if (!text?.trim()) return;
    try {
      await api.post(`/mentorship/${id}/feedback`, { feedback: text });
      showToast('Feedback submitted', 'success');
      setFeedbackText((prev) => ({ ...prev, [id]: '' }));
      loadRequests();
    } catch (err) {
      showToast(err.message || 'Failed to submit feedback', 'error');
    }
  };

  const pending  = requests.filter((r) => r.status === 'pending').length;
  const accepted = requests.filter((r) => r.status === 'accepted').length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-2xl font-extrabold text-heading">Mentorship</h1>
              {requests.length > 0 && <span className="badge badge-blue">{requests.length}</span>}
            </div>
            <p className="text-sm text-muted">
              {isMentor ? 'Manage your mentorship requests and guide your mentees' : 'Connect with experienced mentors to grow your startup'}
            </p>
          </div>
        </div>

        {/* ── Summary stats (mentor view) ── */}
        {isMentor && requests.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '40ms' }}>
            {[
              { label: 'Total',    value: requests.length, icon: FiUsers,       tone: 'icon-tile-blue'   },
              { label: 'Pending',  value: pending,         icon: FiClock,       tone: 'icon-tile-amber'  },
              { label: 'Active',   value: accepted,        icon: FiCheckCircle, tone: 'icon-tile-green'  },
            ].map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="card p-4 flex items-center gap-3">
                <div className={`icon-tile ${tone} w-10 h-10 rounded-xl flex-shrink-0`}><Icon size={16} /></div>
                <div>
                  <p className="text-xl font-extrabold text-heading leading-none">{value}</p>
                  <p className="text-xs text-muted mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 mb-5 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'requests'
                ? 'dark:bg-primary-500/15 dark:text-primary-400 dark:border dark:border-primary-500/30 light:bg-primary-50 light:text-primary-600 light:border light:border-primary-200'
                : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
            }`}
          >
            {isMentor ? 'Received Requests' : 'My Requests'}
            {requests.length > 0 && (
              <span className="ml-2 badge badge-blue !py-0 !px-1.5">{requests.length}</span>
            )}
          </button>

          {!isMentor && (
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'new'
                  ? 'dark:bg-primary-500/15 dark:text-primary-400 dark:border dark:border-primary-500/30 light:bg-primary-50 light:text-primary-600 light:border light:border-primary-200'
                  : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
              }`}
            >
              <FiSend size={13} />
              New Request
            </button>
          )}
        </div>

        {/* ════════════════════════════════
            REQUESTS LIST
        ════════════════════════════════ */}
        {activeTab === 'requests' && (
          loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" style={{ animationDelay: `${i * 60}ms` }} />)}
            </div>
          ) : requests.length === 0 ? (
            <div className="card p-14 text-center animate-fade-in">
              <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
                <FiUsers size={24} />
              </div>
              <h3 className="text-base font-semibold text-heading mb-1.5">No requests yet</h3>
              <p className="text-sm text-muted mb-5">
                {isMentor ? 'Mentees will send requests to you here.' : 'Send a mentorship request to get started.'}
              </p>
              {!isMentor && (
                <button onClick={() => setActiveTab('new')} className="btn-primary text-sm">
                  <FiSend size={14} /> Send Request
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req, i) => {
                const person  = isMentor ? req.mentee : req.mentor;
                const initial = person?.name?.charAt(0)?.toUpperCase() || '?';

                return (
                  <div
                    key={req._id}
                    className="card p-5 animate-fade-in-up hover:-translate-y-px transition-all duration-200"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left — person info */}
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-heading">
                              {isMentor ? '' : 'Mentor: '}
                              {person?._id ? (
                                <Link to={`/users/${person._id}`} className="hover:text-primary-400 transition-colors">
                                  {person?.name || 'Unknown'}
                                </Link>
                              ) : (person?.name || 'Unknown')}
                            </h3>
                            <StatusBadge status={req.status} />
                          </div>
                          <p className="text-sm text-body leading-relaxed">{req.message}</p>
                        </div>
                      </div>

                      {/* Right — actions (mentor + pending) */}
                      {isMentor && req.status === 'pending' && (
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleStatus(req._id, 'accepted')}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                              bg-success-500/10 text-success-400 border border-success-500/20 hover:bg-success-500/20 transition-all"
                          >
                            <FiCheckCircle size={13} /> Accept
                          </button>
                          <button
                            onClick={() => handleStatus(req._id, 'rejected')}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                              bg-danger-500/10 text-danger-400 border border-danger-500/20 hover:bg-danger-500/20 transition-all"
                          >
                            <FiXCircle size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Feedback section */}
                    {req.status === 'accepted' && (
                      <div className="mt-4 pt-4 border-t dark:border-secondary-800/60 light:border-secondary-200">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <FiStar size={12} className="text-warning-400" /> Feedback
                        </p>
                        {req.feedback ? (
                          <div className="p-3.5 rounded-xl dark:bg-secondary-800/40 light:bg-secondary-50 border dark:border-secondary-700/50 light:border-secondary-200">
                            <p className="text-sm text-body italic">"{req.feedback}"</p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              className="input-field text-sm flex-1"
                              placeholder="Write feedback for this mentorship session…"
                              value={feedbackText[req._id] || ''}
                              onChange={(e) => setFeedbackText((p) => ({ ...p, [req._id]: e.target.value }))}
                            />
                            <button
                              onClick={() => handleFeedback(req._id)}
                              className="btn-primary text-xs !px-4 flex-shrink-0"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ════════════════════════════════
            NEW REQUEST FORM
        ════════════════════════════════ */}
        {activeTab === 'new' && !isMentor && (
          <div className="card p-6 md:p-8 animate-fade-in-up">
            <div className="text-center mb-7">
              <div className="icon-tile icon-tile-blue w-14 h-14 rounded-2xl mx-auto mb-3">
                <FiMessageSquare size={22} />
              </div>
              <h2 className="text-lg font-bold text-heading mb-1">Request Mentorship</h2>
              <p className="text-sm text-muted">Send a request to a mentor to guide your startup journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="form-label">Select Mentor</label>
                <select
                  className="input-field"
                  value={form.mentor}
                  onChange={(e) => setForm({ ...form, mentor: e.target.value })}
                  required
                >
                  <option value="">Select a Mentor</option>
                  {mentors.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} {m.bio ? `— ${m.bio}` : ''}
                    </option>
                  ))}
                </select>
                {form.mentor && (
                  <div className="mt-2.5 p-3 rounded-xl border dark:border-secondary-700 light:border-secondary-200 flex items-center justify-between gap-3 dark:bg-secondary-800/40 light:bg-secondary-50 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {mentors.find((m) => m._id === form.mentor)?.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-heading truncate">
                          {mentors.find((m) => m._id === form.mentor)?.name}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          {mentors.find((m) => m._id === form.mentor)?.bio || 'Mentor'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/users/${form.mentor}`}
                      target="_blank"
                      className="btn-outline !py-1 !px-2.5 text-xs font-semibold flex-shrink-0 inline-flex items-center gap-1"
                    >
                      View Profile & Startups ↗
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Message</label>
                <textarea
                  className="textarea-field"
                  placeholder="Tell the mentor about your startup and what guidance you're looking for…"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={submitting} className="btn-primary text-sm">
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  ) : (
                    <><FiSend size={14} /> Send Request</>
                  )}
                </button>
                <button type="button" onClick={() => setActiveTab('requests')} className="btn-outline text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
