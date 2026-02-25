import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    router.navigate({ to: '/' });
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Loan Products' },
    { to: '/apply', label: 'Apply Now' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-navy shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/logo-mark.dim_128x128.png"
              alt="LendBridge Logo"
              className="h-9 w-9 rounded-lg object-cover"
            />
            <span className="font-display text-xl font-bold text-white group-hover:text-gold transition-colors">
              LendBridge<span className="text-gold">USA</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
                activeProps={{ className: 'px-4 py-2 text-sm font-medium text-gold bg-white/10 rounded-md' }}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
                activeProps={{ className: 'px-4 py-2 text-sm font-medium text-gold bg-white/10 rounded-md' }}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
                activeProps={{ className: 'px-4 py-2 text-sm font-medium text-gold bg-white/10 rounded-md' }}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:text-gold hover:bg-white/10 border border-white/20"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-xs">
                      {userProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium max-w-[120px] truncate">
                      {userProfile?.name || 'Account'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="bg-gold hover:bg-gold-dark text-navy font-semibold shadow-gold transition-all"
              >
                {isLoggingIn ? 'Connecting...' : 'Login'}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white/80 hover:text-gold hover:bg-white/10 rounded-md transition-all"
              >
                Admin Panel
              </Link>
            )}
            <div className="pt-2 border-t border-white/10 mt-1">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-white/60 text-sm">
                    <User className="h-4 w-4" />
                    {userProfile?.name || 'Account'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-white/10 rounded-md transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <Button
                  onClick={() => { login(); setMobileOpen(false); }}
                  disabled={isLoggingIn}
                  className="w-full bg-gold hover:bg-gold-dark text-navy font-semibold"
                >
                  {isLoggingIn ? 'Connecting...' : 'Login'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
