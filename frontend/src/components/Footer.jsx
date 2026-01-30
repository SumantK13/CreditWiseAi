import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Twitter, Github, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-black pt-20 pb-10 overflow-hidden border-t border-white/10">
      
      {/* GIANT WATERMARK (The "Expensive" Touch) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none opacity-[0.03]">
        <h1 className="text-[15vw] font-bold text-white tracking-tighter leading-none select-none">
          CREDITWISE
        </h1>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                <Sparkles size={18} className="text-cyan-400" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                CreditWise
              </span>
            </div>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
              The AI-powered decision engine for modern lending. accurate, private, and unbiased financial intelligence.
            </p>
            <div className="flex gap-4 pt-2">
               <SocialIcon icon={Twitter} />
               <SocialIcon icon={Github} />
               <SocialIcon icon={Linkedin} />
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <FooterLink to="/check-eligibility">Check Eligibility</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/how-it-works">How it Works</FooterLink>
              <FooterLink to="/pricing">Pricing</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2026 CreditWise AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-neutral-600 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>System Operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-cyan-400 transition-colors duration-200">
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon: Icon }) => (
  <a href="#" className="text-neutral-500 hover:text-white transition-colors">
    <Icon size={20} />
  </a>
);

export default Footer;