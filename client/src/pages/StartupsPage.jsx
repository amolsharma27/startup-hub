import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  FiPlus, FiEdit2, FiTrash2, FiArrowRight, FiBriefcase,
  FiSearch, FiX, FiUsers, FiCalendar, FiFilter,
} from 'react-icons/fi';

/* ── Status badge ── */
const StatusBadge = ({ status }) => {
  const map = {
    open:   'badge badge-green',
    closed: 'badge badge-red',
    draft:  'badge badge-yellow',
  };
  return <span className={map[status] || 'badge badge-gray capitalize'}>{status}</span>;
};

/* ── Startup card ── */
const StartupCard = ({ startup, user, onEdit, onDelete }) => {
  const isOwner = user?.role === 'founder' || user?.role === 'admin';
  const initial = startup.name.charAt(0).toUpperCase();

  return (
    <div className="card p-5 flex flex-col gap-4 group hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
            {initial}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-heading truncate leading-tight">{startup.name}</h2>
            <p className="text-xs text-muted mt-0.5 truncate">
              by {startup.founder?.name || 'Unknown'}
            </p>
          </div>
        </div>
        <StatusBadge status={startup.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-body line-clamp-2 leading-relaxed flex-1">
        {startup.description}
      </p>

      {/* Category */}
      {startup.category?.name && (
        <div className="flex items-center gap-1.5">
          <FiBriefcase size={11} className="text-accent-400 flex-shrink-0" />
          <span className="text-xs font-medium text-accent-400">{startup.category.name}</span>
        </div>
      )}

      {/* Skills */}
      {startup.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {startup.requiredSkills.slice(0, 3).map((s) => (
            <span key={s} className="skill-tag">{s}</span>
          ))}
          {startup.requiredSkills.length > 3 && (
            <span className="text-xs text-muted self-center">
              +{startup.requiredSkills.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between pt-3 border-t dark:border-secondary-800/60 light:border-secondary-200 mt-auto">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <FiUsers size={11} />
            {startup.teamMembers?.length || 0}
          </span>
          <span className="flex items-center gap-1">
            <FiCalendar size={11} />
            {new Date(startup.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit(startup)}
                title="Edit startup"
                className="p-1.5 rounded-lg transition-colors text-muted hover:text-warning-400 dark:hover:bg-secondary-800 light:hover:bg-secondary-100"
              >
                <FiEdit2 size={13} />
              </button>
              <button
                onClick={() => onDelete(startup._id, startup.name)}
                title="Delete startup"
                className="p-1.5 rounded-lg transition-colors text-muted hover:text-danger-400 dark:hover:bg-secondary-800 light:hover:bg-secondary-100"
              >
                <FiTrash2 size={13} />
              </button>
            </>
          )}
          <Link
            to={`/startups/${startup._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group/link"
          >
            Details
            <FiArrowRight size={12} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
const StartupsPage = ({ user, showToast }) => {
  const [startups,   setStartups]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [form,       setForm]       = useState({ name: '', description: '', requiredSkills: '', category: '' });
  const [editingId,  setEditingId]  = useState(null);
  const [showForm,   setShowForm]   = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat,  setFilterCat]  = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading,    setLoading]    = useState(true);

  const fetchStartups = async () => {
    try {
      const [sd, cd] = await Promise.all([
        api.get('/startups'),
        api.get('/startups/categories/all'),
      ]);
      setStartups(sd.startups || []);
      setCategories(cd.categories || []);
    } catch (err) {
      showToast?.(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStartups(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/startups/${editingId}`, payload);
        showToast('Startup updated', 'success');
      } else {
        await api.post('/startups', payload);
        showToast('Startup created', 'success');
      }
      setForm({ name: '', description: '', requiredSkills: '', category: '' });
      setEditingId(null);
      setShowForm(false);
      fetchStartups();
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/startups/${id}`);
      showToast('Startup deleted', 'success');
      fetchStartups();
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const handleEdit = (startup) => {
    setForm({
      name: startup.name,
      description: startup.description,
      requiredSkills: (startup.requiredSkills || []).join(', '),
      category: startup.category?._id || startup.category || '',
    });
    setEditingId(startup._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', description: '', requiredSkills: '', category: '' });
  };

  const filtered = startups.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      s.name?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.founder?.name?.toLowerCase().includes(term);
    const matchCat    = !filterCat    || s.category?._id === filterCat || s.category === filterCat;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const isOwner = user?.role === 'founder' || user?.role === 'admin';

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-7 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h1 className="text-2xl font-extrabold text-heading">Startups</h1>
              <span className="badge badge-blue">{startups.length}</span>
            </div>
            <p className="text-sm text-muted">Discover and manage startup ventures</p>
          </div>

          {isOwner && (
            <button
              onClick={() => { showForm ? clearForm() : setShowForm(true); }}
              className={showForm ? 'btn-outline text-sm' : 'btn-primary text-sm'}
            >
              {showForm ? <><FiX size={14} /> Cancel</> : <><FiPlus size={14} /> New Startup</>}
            </button>
          )}
        </div>

        {/* ── Create / Edit form ── */}
        {showForm && (
          <div className="card p-6 mb-7 animate-fade-in-up border-primary-500/20">
            <h2 className="text-base font-semibold text-heading mb-5">
              {editingId ? 'Edit Startup' : 'Create New Startup'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Startup Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. EcoSmart Tech"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="input-field"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="textarea-field"
                    placeholder="Describe your startup idea and vision..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Required Skills</label>
                  <input
                    className="input-field"
                    placeholder="React, Node.js, UI/UX (comma separated)"
                    value={form.requiredSkills}
                    onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" className="btn-primary text-sm">
                  {editingId ? 'Update Startup' : 'Create Startup'}
                </button>
                <button type="button" onClick={clearForm} className="btn-outline text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Search & filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '60ms' }}>
          <div className="relative flex-1">
            <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, description, or founder…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors"
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <FiFilter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                className="input-field pl-8 !py-2 text-sm min-w-[140px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {categories.length > 0 && (
              <select
                className="input-field !py-2 text-sm min-w-[140px]"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {(filterStatus || filterCat || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {searchTerm && (
              <span className="badge badge-blue flex items-center gap-1.5">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:opacity-70"><FiX size={10} /></button>
              </span>
            )}
            {filterStatus && (
              <span className="badge badge-teal flex items-center gap-1.5">
                Status: {filterStatus}
                <button onClick={() => setFilterStatus('')} className="hover:opacity-70"><FiX size={10} /></button>
              </span>
            )}
            {filterCat && (
              <span className="badge badge-purple flex items-center gap-1.5">
                Category: {categories.find(c => c._id === filterCat)?.name}
                <button onClick={() => setFilterCat('')} className="hover:opacity-70"><FiX size={10} /></button>
              </span>
            )}
            <button
              onClick={() => { setSearchTerm(''); setFilterStatus(''); setFilterCat(''); }}
              className="text-xs text-muted hover:text-danger-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ── Results count ── */}
        {!loading && (
          <p className="text-xs text-muted mb-4">
            Showing <span className="font-semibold text-heading">{filtered.length}</span> of {startups.length} startups
          </p>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-14 text-center animate-fade-in">
            <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
              <FiBriefcase size={24} />
            </div>
            <h3 className="text-base font-semibold text-heading mb-1.5">No startups found</h3>
            <p className="text-sm text-muted mb-5">
              {searchTerm || filterStatus || filterCat
                ? 'Try adjusting your search or filters.'
                : 'No startups yet. Be the first to create one!'}
            </p>
            {!searchTerm && !filterStatus && !filterCat && isOwner && (
              <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
                <FiPlus size={14} /> Create Startup
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((startup, i) => (
              <div key={startup._id} style={{ animationDelay: `${i * 40}ms` }}>
                <StartupCard
                  startup={startup}
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupsPage;
