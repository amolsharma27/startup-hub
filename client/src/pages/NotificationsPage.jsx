import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { FiBell, FiCheck, FiMail, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotificationsPage = ({ showToast }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading,       setLoading]       = useState(true);

  const loadNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (err) {
      showToast?.(err.message || 'Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      showToast?.(err.message || 'Failed to mark as read', 'error');
    }
  };

  const handleStatusChange = async (appId, status, notificationId) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      showToast?.(`Application ${status} successfully`, 'success');
      
      setNotifications((prev) =>
        prev.map((n) => {
          if (n._id === notificationId && n.applicationId) {
            return {
              ...n,
              read: true,
              applicationId: { ...n.applicationId, status }
            };
          }
          return n;
        })
      );
      
      await api.put(`/notifications/${notificationId}/read`, {});
    } catch (err) {
      showToast?.(err.message || 'Failed to update application status', 'error');
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    try {
      for (const n of unread) await markAsRead(n._id);
      showToast('All notifications marked as read', 'success');
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-2xl font-extrabold text-heading">Notifications</h1>
              {unreadCount > 0 && (
                <span className="badge badge-blue">{unreadCount} new</span>
              )}
            </div>
            <p className="text-sm text-muted">Stay updated with your latest activity</p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-outline text-xs !py-2 !px-4 flex items-center gap-1.5"
            >
              <FiCheck size={13} />
              Mark All Read
            </button>
          )}
        </div>

        {/* ── List ── */}
        {loading ? (
          <div className="space-y-2.5">
            {[1,2,3,4].map((i) => (
              <div key={i} className="skeleton h-20 rounded-2xl" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="card p-14 text-center animate-fade-in">
            <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
              <FiBell size={24} />
            </div>
            <h3 className="text-base font-semibold text-heading mb-1.5">All caught up!</h3>
            <p className="text-sm text-muted">You have no notifications. New ones will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => {
              const sender    = n.fromUser;
              const initials  = sender?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
              const isUnread  = !n.read;

              return (
                <div
                  key={n._id}
                  onClick={() => isUnread && markAsRead(n._id)}
                  className={`
                    card p-4 flex items-start gap-3.5 cursor-pointer transition-all duration-200
                    animate-fade-in-up hover:-translate-y-px
                    ${isUnread ? 'border-l-4 dark:border-l-primary-500 light:border-l-primary-500' : 'opacity-75'}
                  `}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold
                    ${isUnread
                      ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                      : 'dark:bg-secondary-800 light:bg-secondary-200 dark:text-secondary-400 light:text-secondary-500'
                    }`}
                  >
                    {sender?.profilePhoto ? (
                      <img src={sender.profilePhoto} alt={sender.name} className="w-full h-full rounded-xl object-cover" />
                    ) : initials ? (
                      initials
                    ) : (
                      <FiMail size={15} />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h3 className={`text-sm font-semibold leading-snug ${isUnread ? 'text-heading' : 'text-muted'}`}>
                        {n.title}
                        {sender?.name && (
                          <span className="text-muted font-normal">
                            {' '}· from{' '}
                            <Link
                              to={`/users/${sender._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline"
                            >
                              {sender.name}
                            </Link>
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-muted whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                        <FiClock size={10} />
                        {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{n.message}</p>

                    {n.type === 'application' && n.applicationId && (
                      <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        {n.applicationId.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(n.applicationId._id, 'accepted', n._id)}
                              className="btn-primary !py-1.5 !px-3.5 text-xs font-semibold flex items-center gap-1.5"
                            >
                              <FiCheck size={12} /> Accept
                            </button>
                            <button
                              onClick={() => handleStatusChange(n.applicationId._id, 'rejected', n._id)}
                              className="btn-outline !py-1.5 !px-3.5 text-xs font-semibold flex items-center gap-1.5 hover:!bg-red-500 hover:!text-white hover:!border-red-500"
                            >
                              <FiX size={12} /> Reject
                            </button>
                          </>
                        ) : (
                          <span className={`badge ${n.applicationId.status === 'accepted' ? 'badge-teal' : 'badge-red'} capitalize`}>
                            {n.applicationId.status}
                          </span>
                        )}
                      </div>
                    )}

                    {isUnread && !n.applicationId && (
                      <span className="badge badge-blue mt-2 inline-flex">New</span>
                    )}
                  </div>

                  {/* Mark-read button (shows on hover for unread) */}
                  {isUnread && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(n._id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:dark:bg-secondary-800 hover:light:bg-secondary-100 text-muted hover:text-success-400"
                      title="Mark as read"
                    >
                      <FiCheckCircle size={15} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
