import { useState } from 'react';
import { api } from '../services/api';
import {
  FiMail, FiPhone, FiMapPin, FiChevronDown,
  FiChevronUp, FiCheckCircle, FiZap, FiSend,
} from 'react-icons/fi';

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
    dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400
    light:bg-primary-50 light:border-primary-200 light:text-primary-600">
    <FiZap size={11} />{children}
  </span>
);

const INITIAL_FAQS = [
  {
    q: 'Is StartupHub free to use?',
    a: 'Yes! Our base platform is 100% free for early-stage founders and student teams. You can build teams, coordinate tasks, register startups, and exchange chat messages without any licensing requirements.',
    open: false,
  },
  {
    q: 'What roles can I select during registration?',
    a: 'StartupHub supports three roles — Founder (create startups, post required skills, screen applicants), Member (search startups, submit applications, manage tasks), and Mentor (review consultation requests, provide structured feedback).',
    open: false,
  },
  {
    q: 'How does real-time team chat work?',
    a: 'Team Chat uses Socket.IO WebSocket channels to stream text updates instantly. When you join a startup workspace, your chat interface connects to that startup room automatically, enabling real-time communication.',
    open: false,
  },
  {
    q: 'How do applications and task updates sync?',
    a: 'Every write operation is saved to our central MongoDB database. Changes are pushed via WebSockets or fetched on page navigation, ensuring everyone on the team sees identical task cards and statuses.',
    open: false,
  },
  {
    q: 'Can I change my role after registration?',
    a: 'Role changes are handled through your profile settings or by contacting the admin. Each role has distinct permissions so changes require a brief review to maintain platform integrity.',
    open: false,
  },
];

const ContactPage = () => {
  const [faqs,    setFaqs]    = useState(INITIAL_FAQS);
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');
  const [sending, setSending] = useState(false);

  const toggleFaq = (idx) => setFaqs(faqs.map((f, i) => i === idx ? { ...f, open: !f.open } : f));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const contacts = [
    { icon: FiMail,    title: 'Email Support',    info: 'hello@startuphub.com',   sub: 'Avg. response: 4 hours' },
    { icon: FiPhone,   title: 'Direct Hotline',   info: '+1 (555) 432-8765',      sub: 'Mon–Fri, 9am–6pm EST' },
    { icon: FiMapPin,  title: 'Global HQ',        info: 'San Francisco, CA',      sub: '100 Pine Street, Suite 450' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <SectionLabel>Support Center</SectionLabel>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading leading-tight">
          Connect with{' '}
          <span className="gradient-text">StartupHub</span>
        </h1>
        <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          Need integration help? Have feedback about our platform? Explore the FAQ or reach out directly.
        </p>
      </div>

      {/* Contact cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-16">
        {contacts.map(({ icon: Icon, title, info, sub }) => (
          <div key={title} className="card p-6 text-center hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="icon-tile icon-tile-blue w-12 h-12 rounded-xl mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon size={20} />
            </div>
            <h3 className="font-bold text-heading text-base mb-1">{title}</h3>
            <p className="text-sm font-semibold text-primary-400">{info}</p>
            <p className="text-xs text-muted mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* FAQ + Form split */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">

        {/* FAQ accordion — left */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-extrabold text-heading mb-6 pb-3 border-b dark:border-secondary-800/60 light:border-secondary-200">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center gap-3 transition-colors
                    dark:hover:bg-secondary-800/40 light:hover:bg-secondary-50"
                >
                  <span className="text-sm font-semibold text-heading">{faq.q}</span>
                  {faq.open
                    ? <FiChevronUp size={16} className="text-primary-400 flex-shrink-0" />
                    : <FiChevronDown size={16} className="text-muted flex-shrink-0" />
                  }
                </button>
                {faq.open && (
                  <div className="px-5 pb-5 border-t dark:border-secondary-800/60 light:border-secondary-200 pt-4 animate-fade-in">
                    <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form — right */}
        <div className="lg:col-span-5 card p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-heading mb-1.5">Send Us a Message</h2>
          <p className="text-sm text-muted mb-6">Fill in the details below. Our team will reply within 24 hours.</p>

          {success && (
            <div className="mb-5 alert alert-success animate-scale-in">
              <FiCheckCircle size={16} className="flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Message sent!</p>
                <p className="text-xs opacity-80 mt-0.5">We'll be in touch within 24 hours.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 alert alert-danger animate-scale-in">
              <div className="text-xs font-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Your Name</label>
              <input className="input-field" type="text" placeholder="Jordan Miller" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Email Address</label>
              <input className="input-field" type="email" placeholder="jordan@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Subject <span className="text-muted font-normal">(optional)</span></label>
              <input className="input-field" type="text" placeholder="General Query" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea className="textarea-field" rows={5} placeholder="Write your message here…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>

            <button type="submit" disabled={sending} className="btn-primary w-full text-sm">
              {sending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
              ) : (
                <><FiSend size={14} /> Send Message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
