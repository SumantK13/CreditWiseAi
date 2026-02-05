import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, User as UserIcon, Calculator, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/');
  };

  // Function to handle "How it Works" scroll
  const handleScrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="absolute top-6 inset-x-0 mx-auto z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="relative group/nav">
        {/* Background Border */}
        <div className="absolute -inset-[1px] rounded-full overflow-hidden">
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#1e293b_50%,#06b6d4_75%,#8b5cf6_100%)] opacity-70 group-hover/nav:opacity-100 transition-opacity duration-500" />
        </div>
        
        {/* Content */}
        <div className="relative flex items-center justify-between h-14 px-6 rounded-full bg-black/90 backdrop-blur-xl">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group/logo">
            <div className="p-1.5 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-white/5 group-hover/logo:border-cyan-500/50 transition-colors">
              <Sparkles size={16} className="text-cyan-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">
              CreditWise
            </span>
          </Link>

          {/* Desktop Links - UPDATED HERE */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/dashboard">Dashboard</NavLink>
            
            {/* Scroll Link instead of Page Link */}
            <button 
              onClick={() => handleScrollToSection('how-it-works')}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group"
            >
              How it Works
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
            </button>

            <NavLink to="/about">About Us</NavLink>
          </div>

          {/* Right Side (Auth) */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <div 
                className="relative z-50"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                       <UserIcon size={14} className="text-white" />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-4 w-48 rounded-xl bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden py-1 z-50"
                    >
                      <Link 
                        to="/dashboard" 
                        className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-cyan-400" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link 
                  to="/auth" 
                  className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  state={{ from: "/check-eligibility" }} 
                  className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                >
                  Check Eligibility
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden md:hidden"
      >
        <div className="mt-2 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl p-4 flex flex-col gap-4 shadow-2xl">
          <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
          
          <button 
            onClick={() => handleScrollToSection('how-it-works')}
            className="block w-full text-left text-base font-medium text-neutral-300 hover:text-white px-2 py-1"
          >
            How it Works
          </button>
          
          <MobileNavLink to="/about">About Us</MobileNavLink>
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20"
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <>
              <Link 
                to="/auth" 
                className="block text-center text-neutral-400 py-2 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/auth"
                state={{ from: "/check-eligibility" }} 
                className="block text-center px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Check Eligibility
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
};

const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

const MobileNavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="block text-base font-medium text-neutral-300 hover:text-white px-2 py-1"
  >
    {children}
  </Link>
);

export default Navbar;