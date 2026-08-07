import { useState } from 'react';
import {
  FiUserCheck, FiCompass, FiLayers, FiList,
  FiTrendingUp, FiArrowRight, FiZap,
} from 'react-icons/fi';

const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
    dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400
    light:bg-primary-50 light:border-primary-200 light:text-primary-600">
    <FiZap size={11} />{children}
  </span>
);

const steps = [
  {
    icon: FiUserCheck,
    badge: 'Step 01',
    title: 'Complete Profile & Select Role',
    description: 'Create your account and choose your role: Founder, Team Member, or Mentor. Fill in your skillset, bio, and professional background to customise your collaborative workspace.',
    preview: (
      <div className="card p-5 space-y-4 max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center font-bold text-lg">JS</div>
          <div>
            <h4 className="font-bold text-heading text-sm">Jordan Smith</h4>
            <p className="text-xs text-muted">Web Developer / Systems Engineer</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['React.js','Tailwind','Node.js','MongoDB'].map((s) => <span key={s} className="skill-tag">{s}</span>)}
        </div>
        <div className="flex justify-between items-center text-xs pt-2 border-t dark:border-secondary-800/60 light:border-secondary-200">
          <span className="text-muted">Preferred Role</span>
          <span className="badge badge-teal">Team Member</span>
        </div>
      </div>
    ),
  },
  {
    icon: FiCompass,
    badge: 'Step 02',
    title: 'Initialize Startup or Browse Opportunities',
    description: 'Founders register startup profiles, list categories, and specify required skills. Members search, filter, and discover teams that align with their skill profiles.',
    preview: (
      <div className="card p-5 space-y-3 max-w-sm mx-auto">
        <div className="flex justify-between items-start">
          <span className="badge badge-teal">CleanTech</span>
          <span className="text-xs text-success-400 font-semibold">Active Hiring</span>
        </div>
        <div>
          <h4 className="font-bold text-heading text-base">Solarix Grids</h4>
          <p className="text-xs text-muted mt-1 line-clamp-2">Decentralised hardware and telemetry panels for off-grid rural micro-grids.</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-heading mb-1.5">Required Skills</p>
          <div className="flex gap-1.5 flex-wrap">
            {['React Native','IoT','Express.js'].map((s) => <span key={s} className="skill-tag">{s}</span>)}
          </div>
        </div>
        <button className="w-full btn-primary text-xs !py-2">Apply to Join</button>
      </div>
    ),
  },
  {
    icon: FiLayers,
    badge: 'Step 03',
    title: 'Submit Applications & Build Teams',
    description: 'Founders receive instant application notifications. They can review applicant profiles, check skill sets, and accept or reject candidates with one click.',
    preview: (
      <div className="card p-4 space-y-3 max-w-sm mx-auto">
        <div className="flex justify-between items-center pb-2 border-b dark:border-secondary-800/60 light:border-secondary-200">
          <span className="text-xs font-bold text-heading">Active Applications</span>
          <span className="w-2.5 h-2.5 bg-warning-500 rounded-full" />
        </div>
        <div className="p-3 rounded-xl border dark:border-secondary-700/60 dark:bg-secondary-800/30 light:border-secondary-200 light:bg-secondary-50 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-heading">Jordan Smith</p>
            <p className="text-[10px] text-muted">Applied as: Fullstack Dev</p>
          </div>
          <div className="flex gap-1">
            <button className="px-2.5 py-1 bg-success-500 text-white rounded text-[10px] font-semibold">Accept</button>
            <button className="px-2.5 py-1 dark:bg-secondary-700 light:bg-secondary-200 text-muted rounded text-[10px]">Decline</button>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted">Applications update team lists in real-time.</p>
      </div>
    ),
  },
  {
    icon: FiList,
    badge: 'Step 04',
    title: 'Coordinate Tasks & Meet Deadlines',
    description: 'Once candidates are accepted, founders create, assign, and track tasks. Members receive instant alerts and can toggle progress checklists dynamically.',
    preview: (
      <div className="card p-5 space-y-3 max-w-sm mx-auto">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-heading text-sm">Sprint Dashboard</h4>
          <span className="badge badge-green">On Track</span>
        </div>
        <div className="space-y-2">
          {[
            { done: true,  text: 'Draft Pitch Deck' },
            { done: false, text: 'Develop REST API endpoints' },
          ].map(({ done, text }) => (
            <div key={text} className="flex items-center gap-2.5 p-2.5 rounded-lg border dark:border-secondary-800/60 light:border-secondary-200 dark:bg-secondary-800/20 light:bg-secondary-50">
              <div className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center text-white text-[9px] flex-shrink-0 ${done ? 'bg-primary-500 border-primary-500' : 'dark:border-secondary-600 light:border-secondary-400'}`}>
                {done && '✓'}
              </div>
              <span className={`text-xs ${done ? 'line-through text-muted' : 'text-heading font-medium'}`}>{text}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs border-t dark:border-secondary-800/60 light:border-secondary-200 pt-2">
          <span className="text-muted">Progress</span>
          <span className="font-bold text-heading">50% Complete</span>
        </div>
      </div>
    ),
  },
  {
    icon: FiTrendingUp,
    badge: 'Step 05',
    title: 'Collaborate with Certified Mentors',
    description: 'Founders invite expert mentors to review architecture and business progress. Mentors accept requests, audit pipelines, and leave structured feedback notes.',
    preview: (
      <div className="card p-5 space-y-3 max-w-sm mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-xs font-bold">MC</div>
          <div>
            <h4 className="font-bold text-heading text-xs">Marcus Chen</h4>
            <p className="text-[10px] text-muted">Venture Partner / Advisor</p>
          </div>
        </div>
        <div className="p-3 rounded-xl dark:bg-accent-500/5 light:bg-accent-50 border dark:border-accent-500/20 light:border-accent-200">
          <p className="text-[10px] text-accent-500 font-bold mb-1">Advisor Feedback:</p>
          <p className="text-[11px] text-muted italic">"Focus on solidifying early customer validation letters before scheduling pitch preparation sessions."</p>
        </div>
      </div>
    ),
  },
];

const HowItWorksPage = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto animate-fade-in">

      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <SectionLabel>How It Works</SectionLabel>
        <h1 className="text-4xl md:text-6xl font-extrabold text-heading leading-tight">
          A structured incubation{' '}
          <span className="gradient-text">journey</span>
        </h1>
        <p className="text-lg text-muted max-w-3xl mx-auto leading-relaxed">
          StartupHub provides a step-by-step framework to take your startup from raw idea to structured execution. Explore the process below.
        </p>
      </div>

      {/* Interactive stepper */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">

        {/* Step list — left */}
        <div className="lg:col-span-7 space-y-3">
          {steps.map((step, idx) => {
            const Icon     = step.icon;
            const isActive = active === idx;

            return (
              <div
                key={idx}
                onClick={() => setActive(idx)}
                className={`card p-5 cursor-pointer flex gap-4 items-start transition-all duration-300 ${
                  isActive
                    ? 'border-primary-500/40 dark:bg-primary-500/5 light:bg-primary-50/50 shadow-glow-sm'
                    : 'hover:border-primary-500/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                  isActive ? 'bg-primary-500 text-white' : 'icon-tile-blue'
                }`}>
                  <Icon size={20} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">{step.badge}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-ping-slow" />}
                  </div>
                  <h3 className={`text-base font-bold transition-colors ${isActive ? 'text-heading' : 'text-muted'}`}>
                    {step.title}
                  </h3>
                  {isActive && (
                    <p className="text-sm text-muted leading-relaxed pt-2 animate-fade-in">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview — right */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-500/10 rounded-3xl blur-3xl -z-10" />
            <div className="card-glass p-6 rounded-3xl animate-fade-in" key={active}>
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  {steps[active].badge} Preview
                </span>
              </div>
              {steps[active].preview}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <button
              onClick={() => setActive((p) => Math.max(0, p - 1))}
              disabled={active === 0}
              className="btn-outline text-xs !py-2 !px-4 disabled:opacity-30"
            >
              ← Prev
            </button>
            <span className="text-xs text-muted">{active + 1} / {steps.length}</span>
            <button
              onClick={() => setActive((p) => Math.min(steps.length - 1, p + 1))}
              disabled={active === steps.length - 1}
              className="btn-primary text-xs !py-2 !px-4 disabled:opacity-30"
            >
              Next <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
