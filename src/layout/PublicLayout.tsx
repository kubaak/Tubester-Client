import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Navbar */}

      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/tubester_logo.png"
                alt="Tubester logo"
                className="h-10 w-auto max-w-full object-contain shrink-0"
              />
              <span className="text-xl font-bold text-foreground">Tubester</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                Beta
              </span>
            </div>
          </Link>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="glass border border-border/50 text-foreground hover:shadow-soft hover-lift"
              >
                Back to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="bg-gradient-primary text-primary-foreground shadow-moderate hover:shadow-strong hover-lift">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Tubester. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
