import { useState } from 'react';
import {
  FiStar, FiCheckCircle, FiUsers, FiTrendingUp,
  FiMessageSquare, FiZap,
} from 'react-icons/fi';

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
    dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400
    light:bg-primary-50 light:border-primary-200 light:text-primary-600">
    <FiZap size={11} />{children}
  </span>
);

const INITIAL_REVIEWS = [
  {
    name: 'Sarah Johnson',
    role: 'Founder, TechFlow',
    avatar: 'SJ',
    color: 'from-primary-500 to-primary-700',
    rating: 5,
    date: '2 weeks ago',
    quote: 'StartupHub transformed how we build our team. The recruitment and task management features are game-changing. We coordinated developers across three time zones and completed our beta in record time.',
  },
  {
    name: 'Michael Chen',
    role: 'Mentor & Angel Investor',
    avatar: 'MC',
    color: 'from-warning-500 to-warning-600',
    rating: 5,
    date: '1 month ago',
    quote: 'The mentorship tracking system is incredible. I can review the exact progress of multiple teams, read historical notes, and provide targeted feedback directly from my dashboard.',
  },
  {
    name: 'Emma Williams',
    role: 'Full Stack Engineer',
    avatar: 'EW',
    color: 'from-accent-500 to-accent-700',
    rating: 5,
    date: '3 weeks ago',
    quote: 'Finding an early-stage startup that matched my tech stack was simple. The apply interface and direct integration with team chat made my onboarding experience extremely clean.',
  },
];

const Stars = ({ count, size = 14 }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <FiStar key={i} size={size} className={i < count ? 'text-warning-400 fill-warning-400' : 'dark:text-secondary-700 light:text-secondary-300'} />
    ))}
  </div>
);

const TestimonialsPage = () => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [form,    setForm]    = useState({ name: '', role: '', quote: '', rating: 5 });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.quote) return;
    const newReview = {
      ...form,
      avatar: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      date:   'Just now',
      color:  'from-primary-500 to-accent-500',
    };
    setReviews([newReview, ...reviews]);
    setForm({ name: '', role: '', quote: '', rating: 5 });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <SectionLabel>Success Stories</SectionLabel>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading leading-tight">
          What our{' '}
          <span className="gradient-text">community</span>
          {' '}says
        </h1>
        <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          From early brainstorming sessions to funding milestones — hear from the founders, members, and mentors using StartupHub.
        </p>
      </div>

      {/* Platform metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-20">
        {[
          { icon: FiUsers,         count: '10K+',  label: 'Active Builders',   sub: 'Platform accounts' },
          { icon: FiTrendingUp,    count: '500+',  label: 'Startups',          sub: 'Registered ventures' },
          { icon: FiCheckCircle,   count: '24K+',  label: 'Tasks Completed',   sub: 'Milestones hit' },
          { icon: FiMessageSquare, count: '120K+', label: 'Messages Sent',     sub: 'Real-time WebSocket' },
        ].map(({ icon: Icon, count, label, sub }) => (
          <div key={label} className="card p-6 text-center group relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            <div className="icon-tile icon-tile-blue w-10 h-10 rounded-xl mx-auto mb-3">
              <Icon size={18} />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-heading">{count}</p>
            <p className="text-sm font-semibold text-heading mt-0.5">{label}</p>
            <p className="text-xs text-muted mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid: form + reviews */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">

        {/* Submit form — left */}
        <div className="lg:col-span-5 card p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-heading mb-1.5">Share Your Feedback</h2>
          <p className="text-sm text-muted mb-6">Using StartupHub to build or consult? Tell us about your experience.</p>

          {success && (
            <div className="mb-5 alert alert-success animate-scale-in">
              <FiCheckCircle size={16} className="flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Thank you for your review!</p>
                <p className="text-xs opacity-80 mt-0.5">Your testimonial is now live in the feed.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Your Name</label>
              <input className="input-field" type="text" placeholder="Jane Miller" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Your Role / Startup</label>
              <input className="input-field" type="text" placeholder="Co-founder, SolarGrids" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className="hover:scale-110 transition-transform p-0.5"
                  >
                    <FiStar size={22} className={star <= form.rating ? 'text-warning-400 fill-warning-400' : 'dark:text-secondary-700 light:text-secondary-300'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Your Review</label>
              <textarea className="textarea-field" rows={4} placeholder="Write your testimonial here…" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary w-full text-sm">Submit Testimonial</button>
          </form>
        </div>

        {/* Reviews feed — right */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex justify-between items-center pb-3 border-b dark:border-secondary-800/60 light:border-secondary-200">
            <h3 className="text-lg font-bold text-heading">Live Reviews</h3>
            <span className="badge badge-blue">{reviews.length} reviews</span>
          </div>

          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="card p-6 flex gap-4 items-start hover:-translate-y-px transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${rev.color} text-white font-bold text-sm shadow-sm`}>
                  {rev.avatar}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between flex-wrap gap-1">
                    <div>
                      <h4 className="text-sm font-bold text-heading">{rev.name}</h4>
                      <p className="text-xs text-muted">{rev.role}</p>
                    </div>
                    <span className="text-[10px] text-muted">{rev.date}</span>
                  </div>
                  <Stars count={rev.rating} />
                  <p className="text-sm text-body italic leading-relaxed">"{rev.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
