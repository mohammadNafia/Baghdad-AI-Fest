import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Languages, Sun, Moon, Search, Menu, X, LayoutDashboard, LogOut, User as UserIcon, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SummitLogo } from '@/components/SummitLogo';
import SpotlightSearch from './SpotlightSearch';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { user, userRole, adminLoggedIn, logout, adminLogout } = useAuth();
  /* eslint-enable @typescript-eslint/no-unused-vars */
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.includes('Mac');
      const isModKey = isMac ? e.metaKey : e.ctrlKey;
      
      // Don't trigger if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      if (isModKey && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 },
  };

  const mobileMenuVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const menuItemVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: lang === 'ar' ? 20 : -20, opacity: 0 },
  };

  const handleLogout = () => {
    if (adminLoggedIn) {
      adminLogout();
      // Force redirect to admin login if on admin page, else home
      if (location.pathname.startsWith('/admin')) {
        navigate('/admin/login');
      } else {
        navigate('/');
      }
    } else {
      logout();
      navigate('/');
    }
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (adminLoggedIn || userRole === 'admin' || user?.name?.toLowerCase() === 'admin') return '/admin/dashboard';
    if (userRole === 'staff') return '/staff/dashboard';
    return '/profile';
  };

  const getDashboardLabel = () => {
    if (adminLoggedIn || userRole === 'admin' || user?.name?.toLowerCase() === 'admin') return t.admin?.dashboard || 'Dashboard';
    if (userRole === 'staff') return lang === 'ar' ? 'عملي' : 'My Work';
    return lang === 'ar' ? 'حسابي' : 'My Account';
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        theme === 'light'
          ? scrolled
            ? 'bg-white/90 backdrop-blur-xl border-gray-200 py-2 md:py-3 lg:py-4 shadow-sm'
            : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
          : scrolled
          ? 'bg-[#00040F]/80 backdrop-blur-xl border-white/10 py-2 md:py-3 lg:py-4'
          : 'bg-transparent border-transparent py-4 md:py-5 lg:py-6'
      }`}
      variants={navVariants}
      animate={scrollDirection === 'down' && scrolled ? 'hidden' : 'visible'}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 flex justify-between items-center">
        <Link 
          to="/"
          className="flex items-center gap-3 cursor-pointer"
        >
          <SummitLogo />
          <div className="flex flex-col">
            <span className={`font-bold text-lg leading-none tracking-wide ${
              theme === 'light' ? 'text-gray-900' : 'text-white'
            }`}>BAGHDAD</span>
            <span className={`text-[10px] tracking-[0.3em] font-bold uppercase mt-1 ${
              theme === 'light' ? 'text-blue-600' : 'text-blue-400'
            }`}>AI Summit 2026</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
              isActive('/') && location.pathname === '/'
                ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
              isActive('/about')
                ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {t.nav.about}
          </Link>
          <Link
            to="/agenda"
            className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
              isActive('/agenda')
                ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {t.nav.agenda}
          </Link>
          <Link
            to="/ecosystem"
            className={`text-sm font-medium transition-all hover:text-blue-400 relative group ${
              isActive('/ecosystem')
                ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                : theme === 'light' ? 'text-gray-700' : 'text-gray-400'
            }`}
          >
            {t.nav.ecosystem}
          </Link>
          
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-400 bg-white'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30 bg-white/5'
            }`}
            aria-label={t.spotlight?.search || 'Search'}
          >
            <Search size={14} />
            <span className="hidden md:inline">{t.spotlight?.search || 'Search'}</span>
            <span className={`hidden lg:flex items-center gap-1 text-[10px] ${
              theme === 'light' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <kbd className={`px-1 py-0.5 rounded ${
                theme === 'light' ? 'bg-gray-100' : 'bg-white/10'
              }`}>
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
              </kbd>
              <span>K</span>
            </span>
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-yellow-600'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white'
            }`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {/* Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs transition-all ${
              theme === 'light'
                ? 'border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-400'
                : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            <Languages size={14} />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>

          {/* Sign In Button */}
          {/* Auth Buttons or User Menu */}
          {(!user && !adminLoggedIn) ? (
            <>
          <button
            onClick={() => navigate('/signin')}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
              theme === 'light'
                ? 'text-gray-700 hover:text-blue-600'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.nav.signIn}
          </button>

          <button 
            onClick={() => navigate('/register')}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              theme === 'light'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]'
            }`}
          >
            {t.nav.register}
          </button>
          </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                  theme === 'light'
                    ? 'border-gray-200 bg-white hover:border-blue-400'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  <UserIcon size={14} />
                </div>
                <span className={`text-sm font-medium max-w-[100px] truncate ${
                  theme === 'light' ? 'text-gray-700' : 'text-gray-200'
                }`}>
                  {user?.name || (adminLoggedIn ? 'Admin' : 'User')}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute end-0 top-full mt-2 w-48 rounded-xl shadow-lg border overflow-hidden ${
                      theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0a0a1a] border-white/10'
                    }`}
                  >
                    <div className="p-1">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          theme === 'light' 
                            ? 'text-gray-700 hover:bg-gray-100' 
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {userRole === 'staff' ? <Briefcase size={16} /> : <LayoutDashboard size={16} />}
                        {getDashboardLabel()}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          theme === 'light' 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-red-400 hover:bg-red-500/10'
                        }`}
                      >
                        <LogOut size={16} />
                        {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
            theme === 'light'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-white/10 text-white'
          }`}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isMobileMenuOpen ? 'open' : 'closed'}
            transition={{ duration: 0.3 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={`md:hidden overflow-hidden border-t ${
              theme === 'light' ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#00040F]'
            }`}
          >
            <div className="px-4 py-4 space-y-3">
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive('/')
                      ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {t.nav.home}
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive('/about')
                      ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {t.nav.about}
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/agenda"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive('/agenda')
                      ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {t.nav.agenda}
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants}>
                <Link
                  to="/ecosystem"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium ${
                    isActive('/ecosystem')
                      ? theme === 'light' ? 'text-blue-600' : 'text-blue-400'
                      : theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                  }`}
                >
                  {t.nav.ecosystem}
                </Link>
              </motion.div>
              <motion.div variants={menuItemVariants} className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTheme}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    {theme === 'light' ? 'Dark' : 'Light'}
                  </button>
                  <button
                    onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm ${
                      theme === 'light'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <Languages size={18} />
                    {lang === 'en' ? 'العربية' : 'English'}
                  </button>
                </div>
              </motion.div>

              {(user || adminLoggedIn) && (
                <motion.div variants={menuItemVariants} className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2 text-sm font-medium ${
                      theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                    }`}
                  >
                    {userRole === 'staff' ? <Briefcase size={18} /> : <LayoutDashboard size={18} />}
                    {getDashboardLabel()}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2 text-sm font-medium text-red-500"
                  >
                    <LogOut size={18} />
                    {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spotlight Search */}
      <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.nav>
  );
};

export default Navbar;

