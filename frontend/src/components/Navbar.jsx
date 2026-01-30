import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 1. POSITION CHANGE: 'absolute' instead of 'fixed'
    //    This keeps it at the top of the page (initially), but it scrolls away when you go down.
    // 2. DELAY ADDED: Added 'delay: 0.2' so it fades in smoothly with the rest of the site.
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="absolute top-6 inset-x-0 mx-auto z-50 w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      
      {/* THE GRADIENT BORDER CONTAINER */}
      <div className="relative p-[1px] rounded-full overflow-hidden group">
        
        {/* The Spinning Gradient */}
        <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#1e293b_50%,#06b6d4_75%,#8b5cf6_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* THE NAVBAR CONTENT (Inner Black Pill) */}
        <div className="relative flex items-center justify-between h-14 px-6 rounded-full bg-black/80 backdrop-blur-xl">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group/logo">
            <div className="p-1.5 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-white/5 group-hover/logo:border-cyan-500/50 transition-colors">
              <Sparkles size={16} className="text-cyan-400" />
            </div>
            <span className="text-lg font-bold text-white tracking-wide">
              CreditWise
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link 
              to="/check-eligibility" 
              className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
              Check Eligibility
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Dropdown (Animated) */}
      <motion.div 
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="overflow-hidden md:hidden"
      >
        <div className="mt-2 bg-black/90 border border-white/10 rounded-2xl backdrop-blur-xl p-4 flex flex-col gap-4 shadow-2xl">
          <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
          <MobileNavLink to="/about">About</MobileNavLink>
          <Link 
            to="/check-eligibility" 
            className="text-center px-5 py-3 rounded-xl bg-cyan-600 text-white font-semibold"
            onClick={() => setIsOpen(false)}
          >
            Check Eligibility
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
};

// Helper Components
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-sm font-medium text-neutral-400 hover:text-white transition-colors relative group"
  >
    {children}
    {/* Subtle underline hover effect */}
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