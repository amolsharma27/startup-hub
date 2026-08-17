import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

/**
 * Wraps every public-facing page with the sticky navbar and footer.
 * The top padding compensates for the fixed header (h-16 / h-18).
 */
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col dark:bg-[#0a0a0a] light:bg-[#FAFAFA] transition-colors duration-300">
    <PublicNavbar />

    {/* pt-16/pt-18 offsets the fixed navbar height */}
    <main className="flex-1 pt-16">
      {children}
    </main>

    <PublicFooter />
  </div>
);

export default PublicLayout;
