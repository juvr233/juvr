import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, Calculator, Users, User, Info, Zap, BookOpen, Star, Calendar, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Listen for scroll events to add effects to the navigation bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Sparkles },
    { name: 'Numerology Calculator', href: '/calculator', icon: Calculator },
    { name: 'Community', href: '/community', icon: Users }, // Added Community link
    { name: 'Tarot', href: '/tarot?cards=3', icon: Zap },
    { name: 'Zhouyi', href: '/zhouyi', icon: BookOpen },
    { name: 'Bazi Analysis', href: '/bazi-analysis', icon: Calendar },
    { name: 'Star Astrology', href: '/star-astrology', icon: Star },
    { name: 'Holistic Divination', href: '/holistic-divination', icon: Scroll },
    { name: 'Compatibility Analysis', href: '/compatibility', icon: Users },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'My Orders', href: '/my-orders', icon: Scroll },
    { name: 'About Us', href: '/about', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/tarot?cards=3') {
      return location.pathname === '/tarot';
    }
    return location.pathname === path;
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.5
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05, // Sequential animation effect
        duration: 0.3
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-theme-primary theme-transition">
      {/* Navigation */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md theme-transition border-b border-theme ${
          scrolled 
            ? 'bg-theme-secondary bg-opacity-95 shadow-md' 
            : 'bg-theme-secondary bg-opacity-80'
        }`}
        variants={navVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-8 w-8 text-[--accent-primary] group-hover:text-[--accent-secondary] theme-transition" />
            </motion.div>
            <span className="text-2xl font-bold text-theme-primary theme-transition">Peak of Destiny</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg theme-transition ${
                        isActive(item.href)
                          ? 'bg-[--accent-primary] bg-opacity-20 text-theme-primary font-medium'
                          : 'text-[--accent-primary] hover:text-theme-primary hover:bg-[--accent-primary] hover:bg-opacity-10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/calculator"
                  className="button-primary"
                >
                  Start Analysis
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-theme-primary p-2"
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden absolute top-full left-0 right-0 bg-theme-secondary theme-transition border-b border-theme"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-6 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.name}
                      variants={menuItemVariants}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full theme-transition ${
                          isActive(item.href)
                            ? 'bg-[--accent-primary] bg-opacity-20 text-theme-primary font-medium'
                            : 'text-[--accent-primary] hover:text-theme-primary hover:bg-[--accent-primary] hover:bg-opacity-10'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  variants={menuItemVariants}
                  custom={navigation.length}
                  initial="hidden"
                  animate="visible"
                  className="pt-2"
                >
                  <Link
                    to="/calculator"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-[--accent-primary] text-white px-6 py-2 rounded-full font-semibold hover:bg-[--button-hover] transform hover:scale-105 transition-all duration-300 w-full flex justify-center"
                  >
                    Start Analysis
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content with Animation */}
      <motion.main 
        className="flex-1 pt-20 theme-transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Footer with Animation */}
      <motion.footer 
        className="bg-theme-secondary theme-transition py-12 border-t border-theme"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                  <Sparkles className="h-6 w-6 text-[--accent-primary]" />
                </motion.div>
                <span className="text-xl font-bold text-theme-primary">Peak of Destiny</span>
              </div>
              <p className="text-theme-secondary mb-4 max-w-md">
                Explore your life path through ancient numerology, Tarot, and Zhouyi wisdom.
                Get personalized insights and guidance to help you on your journey.
              </p>
              <div className="flex space-x-4">
                <div className="text-theme-secondary text-sm">
                  <p>&copy; 2025 Peak of Destiny. All rights reserved.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-theme-primary font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigation.map((item, i) => (
                  <motion.div 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className="block text-theme-secondary hover:text-theme-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-theme-primary font-semibold mb-4">Services</h3>
              <div className="space-y-2 text-theme-secondary">
                <p>Personalized Numerology Analysis</p>
                <p>Tarot Reading</p>
                <p>Zhouyi 64 Hexagrams Analysis</p>
                <p>Compatibility and Relationship Analysis</p>
                <p>Holistic Numerology Consultation</p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
