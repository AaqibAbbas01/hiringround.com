import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import TechnicalInterviews from './pages/TechnicalInterviews';
import AssessmentTests from './pages/AssessmentTests';
import Screening from './pages/Screening';
import PricingPage from './pages/PricingPage';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Blog from './pages/Blog';
import CaseStudies from './pages/CaseStudies';
import HelpCenter from './pages/HelpCenter';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import JobEditor from './pages/JobEditor';

const ScrollHandler = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollHandler />
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Portal Routes */}
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/:mode" element={<AuthPage />} />
              <Route path="/candidate/dashboard" element={<ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>} />
              <Route path="/recruiter/dashboard" element={<ProtectedRoute role="recruiter"><RecruiterDashboard /></ProtectedRoute>} />
              <Route path="/recruiter/jobs/new" element={<ProtectedRoute role="recruiter"><JobEditor /></ProtectedRoute>} />
              <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute role="recruiter"><JobEditor /></ProtectedRoute>} />

              {/* Product Routes */}
              <Route path="/product/technical-interviews" element={<TechnicalInterviews />} />
              <Route path="/product/assessment-tests" element={<AssessmentTests />} />
              <Route path="/product/screening" element={<Screening />} />
              <Route path="/product/pricing" element={<PricingPage />} />

              {/* Company Routes */}
              <Route path="/company/about" element={<AboutUs />} />
              <Route path="/company/careers" element={<Careers />} />
              <Route path="/company/contact" element={<Contact />} />
              <Route path="/company/privacy" element={<PrivacyPolicy />} />

              {/* Resources Routes */}
              <Route path="/resources/blog" element={<Blog />} />
              <Route path="/resources/case-studies" element={<CaseStudies />} />
              <Route path="/resources/help-center" element={<HelpCenter />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
