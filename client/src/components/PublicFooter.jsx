import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiArrowUpRight } from 'react-icons/fi';
import logo from '../assets/logos/sh-logo.jpg';

const platformLinks = [
  { to: '/features',     label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact',      label: 'Contact' },
];

const companyLinks = [
  { label: 'About Us' },
  { label: 'Blog' },
  { label: 'Careers' },
  { label: 'Press Kit' },
];

const legalLinks = [
  { label: 'Privacy Policy' },
  { label: 'Terms of Service' },
  { label: 'Cookie Policy' },
];

const socials = [
  { icon: FiGithub,   href: '#', label: 'GitHub' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiTwitter,  href: '#', label: 'Twitter / X' },
];

const PublicFooter = () => (
  <footer className="relative border-t dark:border-secondary-800/50 light:border-secondary-200">

    {/* ── CTA strip ── */}
    <div className="dark:bg-primary-600/5 light:bg-primary-50/60 border-b dark:border-secondary-800/40 light:border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <p className="text-lg font-bold text-heading">Ready to build your startup?</p>
          <p className="text-sm text-muted mt-0.5">Join thousands of founders already on StartupHub.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/login"    className="btn-outline text-sm !py-2.5 !px-5">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm !py-2.5 !px-6">Get Started Free</Link>
        </div>
      </div>
    </div>

    {/* ── Main footer grid ── */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">

        {/* Brand column */}
        <div className="col-span-2 lg:col-span-2 space-y-5">
          <Link to="/" className="flex items-center gap-2.5 group w-fit">
            <img src={logo} alt="StartupHub" className="h-8 w-auto rounded-lg transition-transform group-hover:scale-105" />
            <span className="text-base font-bold gradient-text">StartupHub</span>
          </Link>

          <p className="text-sm text-muted leading-relaxed max-w-xs">
            The all-in-one platform for founders, mentors, and builders to collaborate, recruit talent, and grow groundbreaking ideas together.
          </p>

          {/* Socials */}
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200
                  dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/50 dark:hover:text-primary-400 dark:hover:bg-primary-500/10
                  light:border-secondary-200  light:text-secondary-500 light:hover:border-primary-300  light:hover:text-primary-600 light:hover:bg-primary-50"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Platform */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-heading">Platform</h4>
          <ul className="space-y-2.5">
            {platformLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted hover:dark:text-primary-400 hover:light:text-primary-600 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-heading">Company</h4>
          <ul className="space-y-2.5">
            {companyLinks.map(({ label }) => (
              <li key={label}>
                <a
                  href="#"
                  className="text-sm text-muted hover:dark:text-primary-400 hover:light:text-primary-600 transition-colors duration-150 inline-flex items-center gap-1 group"
                >
                  {label}
                  <FiArrowUpRight size={11} className="opacity-0 group-hover:opacity-60 transition-opacity -mt-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-heading">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <FiMail size={14} className="text-primary-400 flex-shrink-0" />
              hello@startuphub.com
            </li>
            <li className="flex items-center gap-2.5 text-sm text-muted">
              <FiMapPin size={14} className="text-primary-400 flex-shrink-0" />
              San Francisco, CA
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="border-t dark:border-secondary-800/50 light:border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} StartupHub, Inc. All rights reserved.
        </p>
        <div className="flex gap-5">
          {legalLinks.map(({ label }) => (
            <a
              key={label}
              href="#"
              className="text-xs text-muted hover:dark:text-secondary-300 hover:light:text-secondary-600 transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
