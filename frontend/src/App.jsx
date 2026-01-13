import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LoanForm from './pages/LoanForm';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Simple Navbar */}
        <nav className="p-4 bg-white shadow-sm flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">CreditWise AI</h1>
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