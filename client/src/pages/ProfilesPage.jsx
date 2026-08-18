import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import {
  FiSearch, FiUsers, FiUserCheck, FiUserPlus, FiBriefcase,
  FiArrowRight, FiExternalLink, FiCheck
} from 'react-icons/fi';

const ROLE_BADGE = {
  founder: 'badge-blue',
  member:  'badge-teal',
  mentor:  'badge-purple',
  admin:   'badge-red',
};

const ROLE_LABELS = {
  founder: 'Founder',
  member:  'Member',
  mentor:  'Mentor',
  admin:   'Admin',
};

const ProfilesPage = ({ user: currentUser, showToast }) => {
  const [profiles,     setProfiles]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchTerm,   setSearchTerm]   = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [connectingId, setConnectingId] = useState(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedRole !== 'all') params.append('role', selectedRole);
      if (searchTerm.trim()) params.append('search', searchTerm.trim());

      const data = await api.get(`/users?${params.toString()}`);
      // Filter out admin accounts — they are hidden from community view
      setProfiles((data.users || []).filter((u) => u.role !== 'admin'));
    } catch (err) {
      showToast?.(err.message || 'Failed to load community profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProfiles();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedRole]);

  const handleConnectToggle = async (targetId, currentConnected) => {
    if (connectingId) return;
    setConnectingId(targetId);
    try {
      const data = await api.post(`/users/${targetId}/connect`, {});
      showToast?.(data.message, 'success');

      // Update locally
      setProfiles((prev) =>
        prev.map((p) => {
          if (p._id !== targetId) return p;
          const myId = currentUser?.id || currentUser?._id;
          const followers = p.followers || [];
          const isNowConnected = data.isConnected;
          const updatedFollowers = isNowConnected
            ? [...followers, { _id: myId }]
            : followers.filter((f) => (f._id || f) !== myId);

          return {
            ...p,
            followers: updatedFollowers,
          };
        })
      );
    } catch (err) {
      showToast?.(err.message || 'Failed to update connection', 'error');
    } finally {
      setConnectingId(null);
    }
  };

  const myId = currentUser?.id || currentUser?._id;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-heading">Community Profiles</h1>
            <span className="badge badge-red">{profiles.length}</span>
          </div>
          <p className="text-sm text-muted">
            Discover and connect with founders, mentors, and builders across StartupHub.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={15} />
          <input
            type="text"
            placeholder="Search by name, skill, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field !pl-9 text-sm"
          />
        </div>
      </div>

      {/* ── Role Filter Pills ── */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { id: 'all',     label: 'All Profiles' },
          { id: 'founder', label: 'Founders' },
          { id: 'mentor',  label: 'Mentors' },
          { id: 'member',  label: 'Team Members' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedRole(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedRole === tab.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'dark:bg-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 light:bg-white light:text-secondary-700 light:hover:bg-secondary-100 border dark:border-secondary-800 light:border-secondary-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Profiles Grid (Instagram/Networking Style) ── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="skeleton h-80 rounded-2xl" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center mx-auto mb-3 text-muted">
            <FiUsers size={24} />
          </div>
          <h3 className="text-base font-bold text-heading mb-1">No profiles found</h3>
          <p className="text-sm text-muted">Try refining your search query or role filter.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {profiles.map((profile, i) => {
            const isMe = profile._id === myId;
            const isConnected = profile.followers?.some((f) => (f._id || f) === myId);
            const initials = profile.name
              ? profile.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
              : '?';

            return (
              <div
                key={profile._id}
                className="card overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-200 shadow-sm hover:shadow-card-md animate-fade-in-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Top Banner Accent */}
                <div className="h-16 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-500/20 dark:from-primary-600/30 relative" />

                {/* Profile Avatar & Info */}
                <div className="px-5 pb-5 pt-0 flex-1 flex flex-col items-center text-center -mt-9">
                  {/* Avatar — always a fixed circle, never stretches the card */}
                  <Link to={`/users/${profile._id}`} className="relative group/avatar">
                    {profile.profilePhoto ? (
                      <div
                        className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-secondary-900 shadow-md group-hover/avatar:scale-105 transition-transform overflow-hidden flex-shrink-0"
                        style={{ minWidth: '4rem', minHeight: '4rem' }}
                      >
                        <img
                          src={getImageUrl(profile.profilePhoto, profile.name)}
                          alt={profile.name}
                          onError={(e) => handleImageError(e, profile?.name)}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-white font-extrabold text-xl flex items-center justify-center ring-4 ring-white dark:ring-secondary-900 shadow-md group-hover/avatar:scale-105 transition-transform flex-shrink-0">
                        {initials}
                      </div>
                    )}
                  </Link>

                  {/* Name & Role */}
                  <div className="mt-2.5 w-full">
                    <Link
                      to={`/users/${profile._id}`}
                      className="text-base font-bold text-heading hover:text-primary-600 transition-colors block truncate"
                    >
                      {profile.name}
                    </Link>
                    <span className={`badge ${ROLE_BADGE[profile.role] || 'badge-gray'} text-[10px] uppercase font-bold tracking-wider mt-1 inline-block`}>
                      {ROLE_LABELS[profile.role] || profile.role}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed min-h-[32px] w-full">
                    {profile.bio || 'Building and collaborating on StartupHub.'}
                  </p>

                  {/* Stats Count Row (Instagram style: followers, following, startups) */}
                  <div className="grid grid-cols-3 gap-2 w-full py-2.5 my-2.5 border-y dark:border-secondary-800 light:border-secondary-100 text-center">
                    <div>
                      <span className="text-xs font-bold text-heading block">
                        {profile.followers?.length || 0}
                      </span>
                      <span className="text-[9px] text-muted uppercase tracking-wider font-semibold">Followers</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-heading block">
                        {profile.following?.length || 0}
                      </span>
                      <span className="text-[9px] text-muted uppercase tracking-wider font-semibold">Following</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-heading block">
                        {profile.startupsCount || 0}
                      </span>
                      <span className="text-[9px] text-muted uppercase tracking-wider font-semibold">Startups</span>
                    </div>
                  </div>

                  {/* Associated Startups list */}
                  {profile.startups && profile.startups.length > 0 ? (
                    <div className="w-full text-left mb-3">
                      <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Startups:</p>
                      <div className="flex flex-wrap gap-1">
                        {profile.startups.slice(0, 2).map((s) => (
                          <Link
                            key={s._id}
                            to={`/startups/${s._id}`}
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg bg-secondary-100 dark:bg-secondary-800 text-heading hover:text-primary-600 transition-colors truncate max-w-full"
                          >
                            <FiBriefcase size={10} className="text-primary-600 flex-shrink-0" />
                            <span className="truncate">{s.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Skills tags */}
                  {profile.skills?.length > 0 && (
                    <div className="w-full flex flex-wrap gap-1 justify-center mb-3">
                      {profile.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag !text-[10px] !py-0.5 !px-2">
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 3 && (
                        <span className="text-[10px] text-muted self-center">
                          +{profile.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="w-full flex gap-2 mt-auto pt-1">
                    {!isMe ? (
                      <button
                        onClick={() => handleConnectToggle(profile._id, isConnected)}
                        disabled={connectingId === profile._id}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                          isConnected
                            ? 'dark:bg-secondary-800 dark:text-secondary-300 dark:hover:bg-secondary-700 light:bg-secondary-200 light:text-secondary-800 light:hover:bg-secondary-300'
                            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-glow'
                        }`}
                      >
                        {connectingId === profile._id ? (
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : isConnected ? (
                          <>
                            <FiCheck size={13} />
                            Connected
                          </>
                        ) : (
                          <>
                            <FiUserPlus size={13} />
                            Connect
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        to="/profile"
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center btn-outline"
                      >
                        My Profile
                      </Link>
                    )}

                    <Link
                      to={`/users/${profile._id}`}
                      className="py-2 px-3 rounded-xl text-xs font-semibold btn-outline flex items-center justify-center"
                      title="View Full Profile & Startups"
                    >
                      <FiExternalLink size={13} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;
