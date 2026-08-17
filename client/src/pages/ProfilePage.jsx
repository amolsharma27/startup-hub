import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiUser, FiMail, FiCalendar, FiGithub, FiLinkedin,
  FiSave, FiCamera, FiShield, FiBookOpen, FiBriefcase,
  FiArrowRight, FiEdit3, FiX, FiZoomIn, FiCheck,
} from 'react-icons/fi';

/* ── Image Crop Modal ── */
const CropModal = ({ src, onConfirm, onCancel }) => {
  const canvasRef   = useRef(null);
  const imgRef      = useRef(new Image());
  const [zoom,      setZoom]     = useState(1);
  const [offset,    setOffset]   = useState({ x: 0, y: 0 });
  const [dragging,  setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const SIZE = 300; // canvas display size

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    if (!img.complete) return;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    const scale = zoom;
    const dw = img.naturalWidth  * scale;
    const dh = img.naturalHeight * scale;
    const dx = (SIZE - dw) / 2 + offset.x;
    const dy = (SIZE - dh) / 2 + offset.y;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // ring
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(220,38,38,0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }, [zoom, offset]);

  useEffect(() => {
    imgRef.current.onload = draw;
    imgRef.current.src = src;
  }, [src]);

  useEffect(() => { draw(); }, [draw]);

  const onMouseDown = (e) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp   = () => setDragging(false);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y });
  };
  const onTouchMove = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const handleConfirm = () => {
    // render at higher resolution for upload
    const OUT = 400;
    const out = document.createElement('canvas');
    out.width = out.height = OUT;
    const ctx  = out.getContext('2d');
    const img  = imgRef.current;
    const ratio = OUT / SIZE;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    ctx.clip();

    const dw = img.naturalWidth  * zoom * ratio;
    const dh = img.naturalHeight * zoom * ratio;
    const dx = (OUT - dw) / 2 + offset.x * ratio;
    const dy = (OUT - dh) / 2 + offset.y * ratio;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    out.toBlob((blob) => {
      const file = new File([blob], 'avatar.png', { type: 'image/png' });
      onConfirm(file);
    }, 'image/png');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      <div className="card p-6 w-full max-w-sm mx-4 space-y-5 shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-heading">Crop Photo</h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-muted hover:text-heading transition-colors">
            <FiX size={18} />
          </button>
        </div>

        <p className="text-xs text-muted">Drag to reposition · Use the slider to zoom</p>

        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            style={{
              cursor: dragging ? 'grabbing' : 'grab',
              borderRadius: '50%',
              width: SIZE,
              height: SIZE,
              display: 'block',
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3">
          <FiZoomIn size={14} className="text-muted flex-shrink-0" />
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary-600"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5"
          >
            <FiCheck size={14} /> Apply Crop
          </button>
          <button onClick={onCancel} className="btn-outline text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfilePage = ({ showToast }) => {
  const [user,      setUser]      = useState(null);
  const [form,      setForm]      = useState({ bio: '', skills: '', education: '', experience: '', github: '', linkedin: '' });
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [myStartups, setMyStartups] = useState([]);
  const [cropSrc,   setCropSrc]   = useState(null); // raw data-URL waiting to be cropped

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get('/users/profile');
        setUser(data.user);
        setForm({
          bio:        data.user.bio        || '',
          skills:     (data.user.skills || []).join(', '),
          education:  data.user.education  || '',
          experience: data.user.experience || '',
          github:     data.user.github     || '',
          linkedin:   data.user.linkedin   || '',
        });

        /* Load startups this user founded or joined */
        if (data.user) {
          const sd = await api.get('/startups');
          const uid = data.user._id || data.user.id;
          const mine = (sd.startups || []).filter(
            (s) => s.founder?._id === uid || s.founder === uid ||
                   s.teamMembers?.some((m) => m._id === uid || m === uid)
          );
          setMyStartups(mine);
        }
      } catch (err) {
        showToast?.(err.message || 'Failed to load profile', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.put('/users/profile', {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      showToast('Profile updated', 'success');
      setUser(data.user);
      setEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step 1 — read file into a data-URL and open the crop modal
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // reset input so same file can be re-selected after cancel
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = (ev) => setCropSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Step 2 — called by CropModal with the cropped Blob/File
  const handleCroppedUpload = async (croppedFile) => {
    setCropSrc(null);
    const formData = new FormData();
    formData.append('photo', croppedFile);
    try {
      const data = await api.upload('/users/upload-photo', formData);
      showToast('Profile photo updated', 'success');
      setUser(data.user);
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    }
  };

  const roleColor = {
    admin:   'from-purple-500 to-purple-700',
    founder: 'from-primary-500 to-primary-700',
    mentor:  'from-accent-500  to-accent-700',
    member:  'from-secondary-500 to-secondary-600',
  }[user?.role] || 'from-primary-500 to-primary-700';

  const roleBadge = {
    admin:   'badge-purple',
    founder: 'badge-blue',
    mentor:  'badge-teal',
    member:  'badge-gray',
  }[user?.role] || 'badge-gray';

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="skeleton h-40 rounded-2xl" />
          <div className="skeleton h-64 rounded-2xl" />
          <div className="skeleton h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  const initials = user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const skillList = user?.skills?.length ? user.skills : [];

  return (
    <>
      {/* Crop modal — rendered outside the page flow */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={handleCroppedUpload}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2 animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-extrabold text-heading">My Profile</h1>
            <p className="text-sm text-muted">Manage your personal information and public profile</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? 'btn-outline text-sm' : 'btn-primary text-sm'}
          >
            {editing ? <><FiX size={14} /> Cancel</> : <><FiEdit3 size={14} /> Edit Profile</>}
          </button>
        </div>

        {/* ── Profile hero card ── */}
        <div className="card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '40ms' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar with upload */}
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-extrabold text-2xl`}>
                    {initials}
                  </div>
                )}
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <FiCamera size={18} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
              </label>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="text-xl font-extrabold text-heading">{user?.name}</h2>
                <span className={`badge ${roleBadge} capitalize`}>{user?.role}</span>
              </div>
              <p className="text-sm text-muted flex items-center gap-1.5 mb-1">
                <FiMail size={13} className="text-primary-400" /> {user?.email}
              </p>
              <p className="text-xs text-muted flex items-center gap-1.5">
                <FiCalendar size={12} />
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
              </p>

              <div className="flex gap-5 mt-3 pt-3 border-t dark:border-secondary-800/40 light:border-secondary-200">
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{user?.followers?.length || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Followers</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{user?.following?.length || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Following</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-sm font-extrabold text-heading block leading-none">{myStartups?.length || 0}</span>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">Startups</span>
                </div>
              </div>

              {user?.bio && !editing && (
                <p className="text-sm text-body mt-3 leading-relaxed max-w-lg">{user.bio}</p>
              )}
            </div>

            {/* Social links */}
            {(user?.github || user?.linkedin) && !editing && (
              <div className="flex gap-2 flex-shrink-0">
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

          {/* Skills display (non-edit mode) */}
          {skillList.length > 0 && !editing && (
            <div className="mt-5 pt-5 border-t dark:border-secondary-800/60 light:border-secondary-200">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2.5">Skills</p>
              <div className="flex flex-wrap gap-2">
                {skillList.map((s) => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          )}

          {/* Education / Experience display */}
          {(user?.education || user?.experience) && !editing && (
            <div className="mt-5 pt-5 border-t dark:border-secondary-800/60 light:border-secondary-200 grid sm:grid-cols-2 gap-4">
              {user.education && (
                <div className="flex items-start gap-2.5">
                  <FiBookOpen size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Education</p>
                    <p className="text-sm text-body">{user.education}</p>
                  </div>
                </div>
              )}
              {user.experience && (
                <div className="flex items-start gap-2.5">
                  <FiBriefcase size={15} className="text-accent-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">Experience</p>
                    <p className="text-sm text-body">{user.experience}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* ── Edit form ── */}
        {editing && (
          <div className="card p-6 md:p-8 animate-fade-in-up border-primary-500/20">
            <h2 className="text-base font-semibold text-heading mb-5 flex items-center gap-2">
              <FiEdit3 size={16} className="text-primary-400" />
              Edit Profile Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="textarea-field"
                    placeholder="Tell us about yourself — your background, interests, and what you're looking to build..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Skills */}
                <div className="sm:col-span-2">
                  <label className="form-label">Skills <span className="text-muted font-normal">(comma separated)</span></label>
                  <input
                    className="input-field"
                    placeholder="React, Node.js, UI/UX Design, Python…"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="form-label">Education</label>
                  <input
                    className="input-field"
                    placeholder="B.Tech in Computer Science, MIT"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="form-label">Experience</label>
                  <input
                    className="input-field"
                    placeholder="3 years as Full Stack Developer"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="form-label">GitHub URL</label>
                  <div className="input-wrapper">
                    <FiGithub size={14} className="input-icon-left" />
                    <input
                      className="input-field pl-10"
                      placeholder="https://github.com/username"
                      value={form.github}
                      onChange={(e) => setForm({ ...form, github: e.target.value })}
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="form-label">LinkedIn URL</label>
                  <div className="input-wrapper">
                    <FiLinkedin size={14} className="input-icon-left" />
                    <input
                      className="input-field pl-10"
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin}
                      onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-70">
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                  ) : (
                    <><FiSave size={14} /> Save Changes</>
                  )}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-outline text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── My Startups section ── */}
        <div className="card p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-heading flex items-center gap-2">
              <FiBriefcase size={16} className="text-primary-400" />
              My Startups
              {myStartups.length > 0 && <span className="badge badge-blue">{myStartups.length}</span>}
            </h2>
            <Link to="/startups" className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 group">
              Browse All <FiArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {myStartups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted mb-4">
                {user?.role === 'founder'
                  ? "You haven't created any startups yet."
                  : "You haven't joined any startup yet."}
              </p>
              <Link to="/startups" className="btn-primary text-sm">
                {user?.role === 'founder' ? 'Create a Startup' : 'Browse Startups'}
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {myStartups.map((s, i) => {
                const isFounder = s.founder?._id === user?._id || s.founder === user?._id;
                const statusMap = { open: 'badge-green', closed: 'badge-red', draft: 'badge-yellow' };
                return (
                  <div
                    key={s._id}
                    className="flex items-start gap-3 p-4 rounded-xl border transition-all duration-200
                      dark:border-secondary-800/60 dark:hover:border-primary-500/30 dark:bg-secondary-800/20
                      light:border-secondary-200 light:hover:border-primary-300 light:bg-secondary-50
                      animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-heading truncate">{s.name}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`badge ${statusMap[s.status] || 'badge-gray'}`}>{s.status}</span>
                        {s.category?.name && (
                          <span className="badge badge-teal">{s.category.name}</span>
                        )}
                        {isFounder && <span className="badge badge-blue">Founder</span>}
                      </div>
                      {s.description && (
                        <p className="text-xs text-muted mt-1 line-clamp-2">{s.description}</p>
                      )}
                    </div>
                    <Link
                      to={`/startups/${s._id}`}
                      className="flex-shrink-0 p-1.5 rounded-lg text-muted hover:text-primary-400 transition-colors"
                      title="View details"
                    >
                      <FiArrowRight size={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Account details card ── */}
        <div className="card p-6 animate-fade-in-up" style={{ animationDelay: '140ms' }}>
          <h2 className="text-base font-semibold text-heading mb-4 flex items-center gap-2">
            <FiShield size={15} className="text-primary-400" />
            Account Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: FiUser,     label: 'Full Name', value: user?.name },
              { icon: FiMail,     label: 'Email',     value: user?.email },
              { icon: FiShield,   label: 'Role',      value: user?.role },
              { icon: FiCalendar, label: 'Joined',    value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl border dark:border-secondary-800/60 light:border-secondary-200 dark:bg-secondary-800/20 light:bg-secondary-50">
                <Icon size={14} className="text-primary-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted uppercase tracking-wider font-medium">{label}</p>
                  <p className="text-sm font-semibold text-heading capitalize truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProfilePage;
