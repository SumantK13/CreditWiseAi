import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Chrome, Github, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import axios from 'axios'; 

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);

  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

   
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const endpoint = `${API_URL}/auth/${isLogin ? 'login' : 'signup'}`; 
    
    const bodyData = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await axios.post(endpoint, bodyData);

      // SUCCESS:
      // Axios stores the actual server response in 'res.data'
      localStorage.setItem('token', res.data.authToken);
      
      // Redirect
      navigate('/dashboard');
      
    } catch (err) {
      // ERROR HANDLING:
      // Axios wraps the backend error response in 'err.response'
      const errorMessage = 
        err.response?.data?.msg || 
        err.response?.data?.errors?.[0]?.msg || 
        err.message || 
        'Authentication failed';
        
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 flex items-center justify-center p-4 overflow-hidden antialiased">
      <BackgroundBeams className="z-0" />

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* LEFT SIDE (Visuals) */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-black/40 relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-8">
                <Sparkles className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {isLogin ? "Welcome Back." : "Join the Future."}
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                {isLogin 
                  ? "Access your dashboard, track your loan eligibility, and manage your financial profile with AI precision."
                  : "Create an account to start analyzing your approval odds against 50+ lenders instantly."
                }
              </p>
            </div>
            <div className="relative z-10 pt-12">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-neutral-700 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">U{i}</div>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">Trusted by 10k+ users</span>
                </div>
                <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE (Form) */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-transparent">
            
            <div className="mb-8 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Sign in to account" : "Create an account"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {isLogin ? "Enter your details below" : "Start your financial journey today"}
              </p>
            </div>

            {/* Error Message Alert */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTUAL FORM */}
            <form className="space-y-4" onSubmit={onSubmit}>
              
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <InputGroup 
                      icon={User} 
                      type="text" 
                      placeholder="Full Name" 
                      name="name" 
                      value={name} 
                      onChange={onChange} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <InputGroup 
                icon={Mail} 
                type="email" 
                placeholder="Email Address" 
                name="email" 
                value={email} 
                onChange={onChange} 
              />
              <InputGroup 
                icon={Lock} 
                type="password" 
                placeholder="Password" 
                name="password" 
                value={password} 
                onChange={onChange} 
              />

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-400 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(''); // Clear errors when toggling
                  }}
                  className="ml-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

          </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputGroup = ({ icon: Icon, type, placeholder, name, value, onChange }) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors">
      <Icon size={18} />
    </div>
    <input 
      type={type} 
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
    />
  </div>
);

export default Auth;