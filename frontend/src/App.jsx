import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import LoanForm from './pages/LoanForm';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      {/* 1. CHANGED: Global background is now Black (was bg-slate-50) */}
      <div className="min-h-screen bg-black text-white font-sans">

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/check-eligibility" element={<LoanForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path='/auth' element={<Auth/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;