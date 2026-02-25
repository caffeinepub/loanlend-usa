import { Link } from '@tanstack/react-router';
import { Heart, Shield, Lock, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'lendbridge-usa');

  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/generated/logo-mark.dim_128x128.png"
                alt="LendBridge Logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <span className="font-display text-lg font-bold">
                LendBridge<span className="text-gold">USA</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Empowering Americans with transparent, accessible lending solutions since 2024.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Shield className="h-3.5 w-3.5 text-gold" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-white/50">
                <Lock className="h-3.5 w-3.5 text-gold" />
                <span>Encrypted</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Loan Products' },
                { to: '/apply', label: 'Apply Now' },
                { to: '/dashboard', label: 'My Dashboard' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Loan Types */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Loan Types</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>Personal Loans</li>
              <li>Home Improvement</li>
              <li>Debt Consolidation</li>
              <li>Auto Loans</li>
              <li>Business Loans</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="h-4 w-4 text-gold flex-shrink-0" />
                <span>1-800-LEND-USA</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="h-4 w-4 text-gold flex-shrink-0" />
                <span>support@lendbridgeusa.com</span>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span>123 Financial District<br />New York, NY 10004</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/40 text-xs text-center md:text-left">
              <p>© {year} LendBridge USA. All rights reserved.</p>
              <p className="mt-1">
                Loans subject to credit approval. APR ranges vary based on creditworthiness.
                This is not a commitment to lend. Equal Housing Lender.
              </p>
            </div>
            <div className="text-white/40 text-xs flex items-center gap-1">
              Built with{' '}
              <Heart className="h-3 w-3 text-gold fill-gold mx-0.5" />
              {' '}using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
