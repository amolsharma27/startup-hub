import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiGithub, FiLinkedin, FiBookOpen, FiBriefcase,
  FiArrowLeft, FiUser, FiMail, FiCalendar,
} from 'react-icons/fi';

const ROLE_LABELS = {
  founder: 'Founder',
  member:  'Team Member',
  mentor:  'Mentor',
  admin:   'Admin',
};

const ROLE_BADGE = {
  founder: 'badge-blue',
  member:  'badge-teal',
  mentor:  'badge-purple',
  admin:   'badge-red',
};

const ROLE_COLOR = {
  founder: 'from-primary-500 to-primary-700',
  member:  'from-accent-500  to-accent-700',
  mentor:  'from-purple-500  to-purple-700',
  admin:   'from-danger-500  to-danger-700',
};

const UserProfilePage = ({ user: loggedInUser, showToast }) => {
  const { id } = useParams();
  const [user,          setUser]          = useState(null);
  const [startup,       setStartup]       = useState(null);
  const [startupsCount, setStartupsCount] = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [notFound,      setNotFound]      = useState(false);
  const [isConnected,   setIsConnected]   = useState(false);
  const [connecting,    setConnecting]    = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const data = await api.get(`/users/${id}`);
        setUser(data.user);
        setStartup(data.startup || null);
        setStartupsCount(data.startupsCount || 0);

        if (data.user && loggedInUser) {
          const myId = loggedInUser.id || loggedInUser._id;
          const connected = data.user.followers?.some((f) => f._id === myId || f === myId);
          setIsConnected(!!connected);
        }
      } catch (err) {
        setNotFound(true);
        showToast?.(err.message || 'Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, loggedInUser]);

  const handleConnectToggle = async () => {
    if (connecting) return;
    setConnecting(true);
    try {
      const data = await api.post(`/users/${user._id}/connect`, {});
      setIsConnected(data.isConnected);
      showToast?.(data.message, 'success');
      
      const profileData = await api.get(`/users/${id}`);
      setUser(profileData.user);
      setStartupsCount(profileData.startupsCount || 0);
    } catch (err) {
      showToast?.(err.message || 'Failed to update connection status', 'error');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="skeleton h-5 w-24 rounded-xl" />
          <div className="skeleton h-48 rounded-2xl" />
          <div className="skeleton h-24 rounded-2xl" />
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="skeleton h-28 rounded-2xl" />
            <div className="skeleton h-28 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="card p-14 text-center animate-fade-in">
            <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
              <FiUser size={24} />
            </div>
            <h3 className="text-base font-semibold text-heading mb-1.5">Profile not found</h3>
            <p className="text-sm text-muted mb-5">This user doesn't exist or is no longer available.</p>
            <Link to="/dashboard" className="btn-primary text-sm">
              <FiArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
  const roleColor = ROLE_COLOR[user.role] || 'from-primary-500 to-primary-700';
  const roleBadge = ROLE_BADGE[user.role] || 'badge-gray';
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── Back ── */}
        <Link
          to="/startups"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary-400 transition-colors animate-fade-in-up"
        >
          <FiArrowLeft size={14} /> Back
        </Link>

        {/* ── Profile hero card ── */}
        <div className="card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '40ms' }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-extrabold text-2xl`}>
                  {initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-start mb-1.5">
                <h1 className="text-xl font-extrabold text-heading">{user.name}</h1>
                <span className={`badge ${roleBadge}`}>{roleLabel}</span>
                {loggedInUser && (loggedInUser.id !== user._id && loggedInUser._id !== user._id) && (
                  <button
                    onClick={handleConnectToggle}
                    disabled={connecting}
                    className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-xl transition-all duration-200 ${
                      isConnected
                        ? 'dark:bg-secondary-800 dark:text-secondary-300 light:bg-secondary-200 light:text-secondary-800 hover:opacity-85'
                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-glow'
                    }`}
                  >
                    {connecting ? '...' : isConnected ? 'Connected' : 'Connect'}
                  </button>
                )}
              </div>

              <p className="text-sm text-muted flex items-center gap-1.5 justify-center sm:justify-start">
                <FiMail size={13} className="text-primary-400" /> {user.email}
              </p>

              {user.createdAt && (
                <p className="text-xs text-muted flex items-center gap-1.5 justify-center sm:justify-start mt-1">
                  <FiCalendar size={11} />
                  Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}

              <div className="flex gap-5 mt-3 pt-3 border-t dark:border-secondary-800/40 light:border-secondary-200 justify-center sm:justify-start">
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{user?.followers?.length || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Followers</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{user?.following?.length || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Following</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{startupsCount || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Startups</span>
                </div>
              </div>

              {user.bio && (
                <p className="text-sm text-body mt-4 leading-relaxed">{user.bio}</p>
              )}

              {/* Social links */}
              {(user.github || user.linkedin) && (
                <div className="flex gap-2 mt-4 justify-center sm:justify-start">
                  {user.github && (
                    <a href={user.github} target="_blank" rel="noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200
                        dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/40 dark:hover:text-primary-400
                        light:border-secondary-200 light:text-secondary-500 light:hover:border-primary-300 light:hover:text-primary-600"
                    >
                      <FiGithub size={16} />
                    </a>
                  )}
                  {user.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200
                        dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/40 dark:hover:text-primary-400
                        light:border-secondary-200 light:text-secondary-500 light:hover:border-primary-300 light:hover:text-primary-600"
                    >
                      <FiLinkedin size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Skills ── */}
        {user.skills?.length > 0 && (
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
            <h3 className="text-sm font-semibold text-heading mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <span key={i} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Startup ── */}
        {startup && (
          <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '90ms' }}>
            <h3 className="text-sm font-semibold text-heading mb-4">Associated Startup</h3>
            <div className="flex items-center gap-4">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-16 h-16 rounded-xl object-cover border dark:border-secondary-700/60 light:border-secondary-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-xl">
                  {startup.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2">
                  <Link to={`/startups/${startup._id}`} className="text-base font-bold text-heading hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                    {startup.name}
                  </Link>
                  {startup.category?.name && (
                    <span className="badge badge-gray">{startup.category.name}</span>
                  )}
                  {(startup.founder?._id || startup.founder) === user._id ? (
                    <span className="badge badge-blue">Founder</span>
                  ) : (
                    <span className="badge badge-teal">Team Member</span>
                  )}
                </div>
                <p className="text-sm text-muted mt-1.5 line-clamp-2">{startup.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Education & Experience ── */}
        {(user.education || user.experience) && (
          <div className="grid sm:grid-cols-2 gap-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {user.education && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                  <FiBookOpen size={14} className="text-primary-400" /> Education
                </h3>
                <p className="text-sm text-body leading-relaxed">{user.education}</p>
              </div>
            )}
            {user.experience && (
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
                  <FiBriefcase size={14} className="text-accent-400" /> Experience
                </h3>
                <p className="text-sm text-body leading-relaxed">{user.experience}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
