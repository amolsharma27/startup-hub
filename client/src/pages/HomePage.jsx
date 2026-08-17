import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiUsers, FiTarget, FiMessageSquare, FiTrendingUp,
  FiShield, FiCheckCircle, FiZap, FiStar, FiCode, FiLayers,
} from 'react-icons/fi';
import heroTeamImg from '../assets/images/hero-team.jpg';

/* ── Section Tag / Category ── */
const CategoryTag = ({ children }) => (
  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-secondary-500 dark:text-secondary-400">
    <span className="w-1 h-4 bg-primary-600 rounded-full inline-block" />
    {children}
  </div>
);

/* ── Reusable section label badge ── */
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
    <div className="w-11 h-11 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-500
      flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
      <Icon size={20} />
    </div>
    <h3 className="text-base font-semibold text-heading mb-2 group-hover:text-primary-600 transition-colors">{title}</h3>
    <p className="text-sm text-muted leading-relaxed">{desc}</p>
  </div>
);

/* ── Stat chip ── */
const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-extrabold text-heading">
      <span className="text-primary-600">{value}</span>
    </div>
    <div className="text-xs text-muted font-medium mt-1">{label}</div>
  </div>
);

const HomePage = () => (
  <div className="overflow-x-hidden">

    {/* ══════════════════════════════════════════════════════
        HERO
    ══════════════════════════════════════════════════════ */}
    <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:pt-16 md:pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">

          {/* Left Column — Copy */}
          <div className="space-y-6 animate-fade-in-up">
            <CategoryTag>THE #1 STARTUP COLLABORATION PLATFORM</CategoryTag>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.1] tracking-tight text-heading">
              Great teams{' '}
              <span className="text-primary-600">start here.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted max-w-lg leading-relaxed">
              Recruit talent, manage projects, and turn ideas into successful startups.
            </p>

            <div className="flex items-center flex-wrap gap-4 pt-1">
              <Link
                to="/register"
                className="btn-primary !py-3 !px-7 text-sm sm:text-base font-semibold rounded-xl shadow-md hover:shadow-glow transition-all"
              >
                Start for Free
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-heading hover:text-primary-600 transition-colors group px-3 py-2"
              >
                Learn More
                <FiArrowRight size={16} className="text-primary-600 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust strip */}
            <div className="space-y-2.5 pt-4">
              <p className="text-xs sm:text-sm text-muted font-medium">
                Trusted by thousands of founders and teams worldwide.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Founder 1"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Founder 2"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                    alt="Founder 3"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-secondary-900 object-cover"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt="Founder 4"
                  />
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 dark:bg-secondary-800 text-xs font-bold text-secondary-600 dark:text-secondary-300 ring-2 ring-white dark:ring-secondary-900">
                    +
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Hero Image & Floating Metric Card */}
          <div className="relative animate-fade-in-up delay-200">
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-secondary-200/70 dark:border-secondary-800/80 bg-secondary-100 dark:bg-secondary-900">
              <img
                src={heroTeamImg}
                alt="Startup team collaborating"
                className="w-full h-[360px] sm:h-[420px] lg:h-[440px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlaid Floating Metrics Card */}
            <div className="mt-4 sm:-mt-16 sm:mx-6 relative z-10 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-card-lg border border-secondary-200 dark:border-secondary-700/60 transition-all duration-300 hover:shadow-xl">
              {/* 3 Metrics Top Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 pb-4 border-b border-secondary-100 dark:border-secondary-800">
                <div>
                  <span className="text-[11px] sm:text-xs font-medium text-muted block mb-1">Team Members</span>
                  <span className="text-sm sm:text-base font-bold text-heading">5 active</span>
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs font-medium text-muted block mb-1">Sprint Progress</span>
                  <span className="text-sm sm:text-base font-bold text-heading block mb-1.5">85%</span>
                  <div className="w-full h-1.5 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs font-medium text-muted block mb-1">Messages</span>
                  <span className="text-sm sm:text-base font-bold text-heading">24 new</span>
                </div>
              </div>

              {/* Overall Progress Bottom Row */}
              <div className="pt-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-muted">Overall Progress</span>
                  <span className="text-heading font-bold">85%</span>
                </div>
                <div className="w-full h-2 bg-secondary-100 dark:bg-secondary-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-primary-500 rounded-full transition-all duration-1000"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Row */}
        <div className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500+', label: 'Startups' },
            { value: '200+', label: 'Mentors' },
            { value: '24K+', label: 'Tasks Completed' },
          ].map((s) => (
            <div
              key={s.label}
              className="card p-5 text-center hover:-translate-y-0.5 transition-transform duration-200 shadow-sm hover:shadow-card"
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
            <span className="text-primary-600">succeed</span>
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors group"
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
            <span className="text-primary-600">in 3 steps</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            StartupHub provides a streamlined framework to take your startup from raw concept to structured execution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px dark:bg-secondary-800 light:bg-secondary-200 z-0" />

          {[
            { step: '01', icon: FiUsers,       title: 'Create Your Profile',       desc: 'Sign up and choose your role — Founder, Mentor, or Team Member. Add your skills and bio.',       color: 'from-primary-600 to-primary-700' },
            { step: '02', icon: FiLayers,      title: 'Join or Build Startups',    desc: 'Launch your own venture or discover and apply to startups that match your expertise.',           color: 'from-primary-600 to-primary-800' },
            { step: '03', icon: FiCode,        title: 'Collaborate & Grow',        desc: 'Use built-in chat, tasks, and mentorship tools to move fast and hit your milestones.',           color: 'from-primary-500 to-primary-700' },
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors group"
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
            <span className="text-primary-600">community</span>
            {' '}says
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: 'Sarah Johnson',  role: 'Founder, TechFlow',       init: 'SJ', color: 'from-primary-600 to-primary-700', quote: 'StartupHub transformed how we build our team. The recruitment and task management features are game-changing.' },
            { name: 'Michael Chen',   role: 'Mentor & Angel Investor',  init: 'MC', color: 'from-primary-500 to-primary-700',  quote: 'The mentorship tracking system is incredible. I can review the exact progress of multiple teams from one dashboard.' },
            { name: 'Emma Williams',  role: 'Full Stack Engineer',      init: 'EW', color: 'from-primary-600 to-primary-800', quote: 'Finding an early-stage startup that matched my tech stack was simple. My onboarding experience was extremely clean.' },
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors group"
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/15 via-primary-500/10 to-primary-600/5 dark:from-primary-600/20" />
          <div className="absolute inset-0 border dark:border-primary-500/20 light:border-primary-200 rounded-3xl" />

          {/* Blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary-600/15 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <SectionLabel>Get Started Today</SectionLabel>

            <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
              Ready to build your{' '}
              <span className="text-primary-600">dream team</span>?
            </h2>

            <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
              Join thousands of founders, mentors, and builders already collaborating on StartupHub. Free forever for early-stage teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary !py-3.5 !px-9 text-base font-semibold group shadow-md hover:shadow-glow">
                Create Free Account
                <FiArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/features" className="btn-outline !py-3.5 !px-9 text-base">
                Learn More
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-muted">
              <span className="flex items-center gap-1.5"><FiCheckCircle size={13} className="text-success-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><FiShield size={13} className="text-primary-600" /> SOC 2 compliant</span>
              <span className="flex items-center gap-1.5"><FiZap size={13} className="text-warning-500" /> Setup in under 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
