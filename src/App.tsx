import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { ResultPageV1 } from './pages/ResultPageV1';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Helper component to handle URL parameter redirection
function DocumentRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const documentId = params.get('document');

  if (documentId) {
    return <Navigate to={`/document/${documentId}`} replace />;
  }

  return null;
}

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'upload'>('landing');

  return (
    <Router>
      <DocumentRedirect />
      <Routes>
        <Route path="/" element={
          currentStep === 'upload' 
            ? <UploadPage onComplete={() => {}} setCurrentStep={setCurrentStep} />
            : <LandingPage onGetStarted={() => setCurrentStep('upload')} />
        } />
        <Route path="/document/:sessionId" element={<ResultPageV1 />} />
      </Routes>
    </Router>
  );
}

export default App;