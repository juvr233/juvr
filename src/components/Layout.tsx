import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Calculator, Users, User, Info, Zap, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Sparkles },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'Tarot', href: '/tarot?cards=3', icon: Zap },
    { name: 'Zhouyi', href: '/zhouyi', icon: BookOpen },
    { name: 'Compatibility', href: '/compatibility', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'About', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/tarot?cards=3') {
      return location.pathname === '/tarot';
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-[#101118]">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 bg-[#22232E]/90 backdrop-blur-sm border-b border-[#8A2BE2]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Sparkles className="h-8 w-8 text-[#8A2BE2] group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-[#FFFFFF]">Zenith Destiny</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-[#8A2BE2]/20 text-[#FFFFFF]'
                      : 'text-[#8A2BE2] hover:text-[#FFFFFF] hover:bg-[#8A2BE2]/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              to="/calculator"
              className="bg-[#8A2BE2] text-[#FFFFFF] px-6 py-2 rounded-full font-semibold hover:bg-[#FF00FF] transform hover:scale-105 transition-all duration-200"
            >
              Get Reading
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#FFFFFF] p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#22232E]/95 backdrop-blur-sm border-b border-[#8A2BE2]/20">
            <div className="px-6 py-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-[#8A2BE2]/20 text-[#FFFFFF]'
                        : 'text-[#8A2BE2] hover:text-[#FFFFFF] hover:bg-[#8A2BE2]/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/calculator"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-[#8A2BE2] text-[#FFFFFF] px-6 py-3 rounded-full font-semibold text-center mt-4"
              >
                Get Reading
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#22232E]/90 backdrop-blur-sm py-12 border-t border-[#8A2BE2]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6 text-[#8A2BE2]" />
                <span className="text-xl font-bold text-[#FFFFFF]">Zenith Destiny</span>
              </div>
              <p className="text-[#A0A0A0] mb-4 max-w-md">
                Discover your path through the ancient wisdom of numerology, tarot, and I Ching. 
                Get personalized insights and guidance for your life journey.
              </p>
              <div className="flex space-x-4">
                <div className="text-[#A0A0A0] text-sm">
                  <p>&copy; 2025 Zenith Destiny. All rights reserved.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[#FFFFFF] font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[#FFFFFF] font-semibold mb-4">Services</h3>
              <div className="space-y-2 text-[#A0A0A0]">
                <p>Life Path Analysis</p>
                <p>Tarot Readings</p>
                <p>I Ching Consultation</p>
                <p>Compatibility Testing</p>
                <p>Personal Year Forecast</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}