import { type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { Button } from '@/components/ui/button';

interface PublicLayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
  { to: '/help', label: 'Help' },
];

const footerLinks = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
  { to: '/help', label: 'Help' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-surface flex flex-col">
      {/* Navbar */}
      <header className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/tubester_logo.png"
              alt="Tubester logo"
              className="h-10 w-auto max-w-full object-contain shrink-0"
            />

            <span className="text-xl font-bold text-foreground">Tubester</span>

            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
              Beta
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Public navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground transition-colors'
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <Link to="/login">
              <Button className="bg-gradient-primary text-primary-foreground shadow-moderate hover:shadow-strong hover-lift">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span>&copy; {new Date().getFullYear()} Tubester. All rights reserved.</span>

            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
              {footerLinks.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
