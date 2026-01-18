import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LoanForm from './pages/LoanForm';
import Dashboard from './pages/Dashboard';

function App() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Premium Navbar */}
        <nav className={`sticky top-0 z-50 px-8 py-4 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50' 
            : 'bg-white border-b border-slate-100'
        }`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CW</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
                CreditWise AI
              </h1>
            </div>
            <div className="flex gap-3 items-center">
              <button className="px-5 py-2 text-[#4F46E5] font-semibold rounded-lg hover:bg-purple-50 transition-all duration-200 hover:text-[#3730A3]">
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-300/40 transition-all duration-200 hover:scale-105">
                Sign Up
              </button>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/check-eligibility" element={<LoanForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;