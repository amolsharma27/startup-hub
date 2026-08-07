import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiUsers, FiTarget, FiMessageSquare, FiTrendingUp,
  FiShield, FiCheckCircle, FiZap, FiStar, FiCode, FiLayers,
} from 'react-icons/fi';

/* ── Reusable section label ── */
const SectionLabel = ({ children }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
    dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400
    light:bg-primary-50 light:border-primary-200 light:text-primary-600">
    <FiZap size={11} />
    {children}
  </span>
);

/* ── Feature card ── */
const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => (
  <div
    className="card p-6 group hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400
      flex items-center justify-center mb-4 group-hover:bg-primary-500 group-hover:text-white group-hover:scale-110 transition-all duration-300">
      <Icon size={20} />
    </div>
    <h3 className="text-base font-semibold text-heading mb-2 group-hover:text-primary-400 transition-colors">{title}</h3>
    <p className="text-sm text-muted leading-relaxed">{desc}</p>
  </div>
);

/* ── Stat chip ── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-extrabold gradient-text">{value}</div>
    <div className="text-xs text-muted font-medium mt-0.5">{label}</div>
  </div>
);

const HomePage = () => (
  <div className="overflow-x-hidden">

    {/* ══════════════════════════════════════════════════════
        HERO
    ══════════════════════════════════════════════════════ */}
    <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="space-y-8 animate-fade-in-up">
            <SectionLabel>The #1 Startup Collaboration Platform</SectionLabel>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-heading">
              Build startup{' '}
              <span className="gradient-text">teams</span>
              <br className="hidden sm:block" />
              {' '}with confidence.
            </h1>

            <p className="text-lg text-muted max-w-lg leading-relaxed">
              StartupHub connects founders, mentors, and builders — giving every
              team the tools to recruit talent, coordinate tasks, and ship faster.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary !py-3 !px-7 text-base group">
                Start for Free
                <FiArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/features" className="btn-outline !py-3 !px-7 text-base">
                See Features
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {['SJ','MC','EW','RV','AT'].map((init, i) => (
                  <div
                    key={init}
                    className="w-8 h-8 rounded-full border-2 dark:border-secondary-950 light:border-white
                      bg-gradient-to-br from-primary-500 to-accent-500
                      flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ zIndex: 5 - i }}
                  >
                    {init}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-heading">10,000+</span> founders already building
              </p>
            </div>
          </div>

          {/* Right — hero card mockup */}
          <div className="relative animate-fade-in-up delay-200">
            {/* Glow ring behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/10 rounded-3xl blur-3xl -z-10" />

            <div className="card-elevated p-6 md:p-8 rounded-3xl space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-muted font-medium uppercase tracking-wider">Live Dashboard</p>
                  <p className="text-lg font-bold text-heading mt-0.5">Team Alpha</p>
                </div>
                <span className="badge badge-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse mr-1" />
                  Active
                </span>
              </div>

              {/* Mock widgets */}
              {[
                { icon: FiUsers,       label: 'Team Members',      value: '5 active',      sub: '2 new this week',    color: 'text-primary-400' },
                { icon: FiTarget,      label: 'Sprint Progress',    value: '85%',           sub: '17/20 tasks done',   color: 'text-accent-400' },
                { icon: FiMessageSquare, label: 'Team Messages',   value: '24 new',        sub: 'Last: 5 min ago',    color: 'text-success-400' },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer group
                    dark:border-secondary-700/40 dark:bg-secondary-800/30 dark:hover:border-primary-500/30
                    light:border-secondary-200 light:bg-secondary-50 light:hover:border-primary-300"
                >
                  <div className={`w-9 h-9 rounded-lg dark:bg-secondary-800 light:bg-white border dark:border-secondary-700/50 light:border-secondary-200 flex items-center justify-center flex-shrink-0 ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="text-sm font-semibold text-heading">{value}</p>
                  </div>
                  <p className="text-xs text-muted hidden sm:block">{sub}</p>
                </div>
              ))}

              {/* Progress bar */}
              <div className="pt-1">
                <div className="flex justify-between text-xs text-muted mb-1.5">
                  <span>Overall Progress</span>
                  <span className="font-semibold text-heading">85%</span>
                </div>
                <div className="h-2 dark:bg-secondary-800 light:bg-secondary-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500+', label: 'Startups' },
            { value: '200+', label: 'Mentors' },
            { value: '24K+', label: 'Tasks Completed' },
          ].map((s) => (
            <div
              key={s.label}
              className="card p-5 text-center hover:-translate-y-0.5 transition-transform duration-200"
            >
              <Stat {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════
        FEATURES
    ══════════════════════════════════════════════════════ */}
    <section className="section-alt px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <SectionLabel>Features Showcase</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
            Everything you need to{' '}
            <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-base leading-relaxed">
            Powerful tools designed to streamline every stage of your startup journey — from first idea to funded company.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: FiUsers,         title: 'Team Management',    desc: 'Create and manage your startup teams effortlessly. Invite members, assign roles, and collaborate in real-time.',            delay: 0 },
            { icon: FiTarget,        title: 'Smart Recruitment',  desc: 'Find the perfect talent. Review applications, check skill profiles, and build your dream team with one click.',             delay: 50 },
            { icon: FiCheckCircle,   title: 'Task Management',    desc: 'Assign tasks, track progress, and hit deadlines with a clean and intuitive task board.',                                      delay: 100 },
            { icon: FiMessageSquare, title: 'Real-Time Chat',     desc: 'Built-in WebSocket-powered messaging keeps every team member in sync, no matter the time zone.',                             delay: 150 },
            { icon: FiTrendingUp,    title: 'Mentorship Network', desc: 'Connect with seasoned mentors who guide your journey with actionable insights and structured feedback.',                     delay: 200 },
            { icon: FiShield,        title: 'Secure Platform',    desc: 'Enterprise-grade JWT auth, encrypted data, and role-based access control keep your work protected.',                         delay: 250 },
          ].map((f) => <FeatureCard key={f.title} {...f} />)}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors group"
          >
            Explore the interactive feature simulator
            <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════
        HOW IT WORKS (teaser)
    ══════════════════════════════════════════════════════ */}
    <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold text-heading">
            From idea to execution{' '}
            <span className="gradient-text">in 3 steps</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            StartupHub provides a streamlined framework to take your startup from raw concept to structured execution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px dark:bg-secondary-800 light:bg-secondary-200 z-0" />

          {[
            { step: '01', icon: FiUsers,       title: 'Create Your Profile',       desc: 'Sign up and choose your role — Founder, Mentor, or Team Member. Add your skills and bio.',       color: 'from-primary-500 to-primary-700' },
            { step: '02', icon: FiLayers,      title: 'Join or Build Startups',    desc: 'Launch your own venture or discover and apply to startups that match your expertise.',           color: 'from-primary-500 to-accent-500' },
            { step: '03', icon: FiCode,        title: 'Collaborate & Grow',        desc: 'Use built-in chat, tasks, and mentorship tools to move fast and hit your milestones.',           color: 'from-accent-500 to-accent-700' },
          ].map(({ step, icon: Icon, title, desc, color }, i) => (
            <div key={step} className="relative card p-7 group hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Step number */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-sm mb-5 shadow-glow-sm group-hover:scale-110 transition-transform duration-300`}>
                {step}
              </div>
              <h3 className="text-base font-semibold text-heading mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors group"
          >
            See the full interactive walkthrough
            <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════
        SOCIAL PROOF / TESTIMONIALS TEASER
    ══════════════════════════════════════════════════════ */}
    <section className="section-alt px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4 animate-fade-in-up">
          <SectionLabel>Loved by Builders</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-bold text-heading">
            What our{' '}
            <span className="gradient-text">community</span>
            {' '}says
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Sarah Johnson',  role: 'Founder, TechFlow',       init: 'SJ', color: 'from-primary-500 to-primary-700', quote: 'StartupHub transformed how we build our team. The recruitment and task management features are game-changing.' },
            { name: 'Michael Chen',   role: 'Mentor & Angel Investor',  init: 'MC', color: 'from-accent-500 to-accent-700',  quote: 'The mentorship tracking system is incredible. I can review the exact progress of multiple teams from one dashboard.' },
            { name: 'Emma Williams',  role: 'Full Stack Engineer',      init: 'EW', color: 'from-primary-400 to-accent-500', quote: 'Finding an early-stage startup that matched my tech stack was simple. My onboarding experience was extremely clean.' },
          ].map(({ name, role, init, color, quote }, i) => (
            <div key={name} className="card p-6 flex flex-col gap-4 group hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, si) => (
                  <FiStar key={si} size={13} className="text-warning-400 fill-warning-400" />
                ))}
              </div>
              <p className="text-sm text-body leading-relaxed flex-1 italic">"{quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t dark:border-secondary-800/60 light:border-secondary-200">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {init}
                </div>
                <div>
                  <p className="text-sm font-semibold text-heading">{name}</p>
                  <p className="text-xs text-muted">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors group"
          >
            Read all testimonials & submit yours
            <FiArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>

    {/* ══════════════════════════════════════════════════════
        CTA
    ══════════════════════════════════════════════════════ */}
    <section className="px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center">
          {/* Gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-primary-500/10 to-accent-500/10 dark:from-primary-600/15" />
          <div className="absolute inset-0 border dark:border-primary-500/20 light:border-primary-200 rounded-3xl" />

          {/* Blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent-500/15 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <SectionLabel>Get Started Today</SectionLabel>

            <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
              Ready to build your{' '}
              <span className="gradient-text">dream team</span>?
            </h2>

            <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
              Join thousands of founders, mentors, and builders already collaborating on StartupHub. Free forever for early-stage teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary !py-3.5 !px-9 text-base group">
                Create Free Account
                <FiArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/features" className="btn-outline !py-3.5 !px-9 text-base">
                Learn More
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-muted">
              <span className="flex items-center gap-1.5"><FiCheckCircle size={13} className="text-success-400" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><FiShield size={13} className="text-primary-400" /> SOC 2 compliant</span>
              <span className="flex items-center gap-1.5"><FiZap size={13} className="text-warning-400" /> Setup in under 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
