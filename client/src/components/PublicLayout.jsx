import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

/**
 * Wraps every public-facing page with the sticky navbar and footer.
 * The top padding compensates for the fixed header (h-16 / h-18).
 * Ambient mesh gradients are rendered once here so individual pages
 * don't need to repeat them.
 */
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col dark:bg-[#0a0f1e] light:bg-[#F8FAFC] transition-colors duration-300">

    {/* ── Ambient decorative gradients (dark only — light mode looks clean flat) ── */}
    <div className="dark:block light:hidden fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute -top-40 -left-40  w-[600px] h-[600px] bg-primary-600/8  rounded-full blur-[120px] animate-float" />
      <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-accent-500/6  rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/4 rounded-full blur-[100px]" />
    </div>

    <PublicNavbar />

    {/* pt-16/pt-18 offsets the fixed navbar height */}
    <main className="flex-1 pt-16">
      {children}
    </main>

    <PublicFooter />
  </div>
);

export default PublicLayout;
