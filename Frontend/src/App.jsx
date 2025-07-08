import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext'; // No longer needed here

import AppContent from './AppContent'; // New wrapper

function App() {
  return (
    // <AuthProvider> // REMOVE THIS OUTER AuthProvider
      <Router>
        <AppContent />
      </Router>
    // </AuthProvider>
  );
}

export default App;