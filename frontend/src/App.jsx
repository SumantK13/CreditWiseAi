import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import LoanForm from './pages/LoanForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 
import EMIPage from "@/pages/EMIPage";
import LoanComparison from './pages/LoanComparison';
import FirstTimeBorrowerRoadmap from './pages/FirstTimeBorrowerRoadmap';
import PreFlightChecklist from './pages/PreFlightChecklist';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/first-time-borrower/roadmap"
            element={<FirstTimeBorrowerRoadmap />}
          />
          <Route
            path="/first-time-borrower/checklist"
            element={<PreFlightChecklist />}
          />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/emi/:loanId" element={<EMIPage />} />
          <Route
            path="/loan-comparison"
            element={
              <ProtectedRoute>
                <LoanComparison />
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/check-eligibility" 
            element={
              <ProtectedRoute>
                <LoanForm />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/about"
            element={<About/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;