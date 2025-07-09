import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Add useLocation here
import ProtectedRoute from "../components/ProtectedRoute";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout"; // This line should now resolve
import { useAuth } from "../contexts/AuthContext"; // Ensure useAuth is imported for AuthRedirect
import AuthForm from "../components/AuthForm"; // Add this import
import AddProblem from "../pages/AddProblem"; // Add this import

// Public Pages (no Navbar)
// import Login from "../components/Login";
// import Register from "../components/Register"; // Assuming Register is here, adjust if wrong

// Protected Pages (will have Navbar via AuthenticatedLayout)
import Dashboard from "../pages/Dashboard";
import ProblemList from "../pages/ProblemList";
import ProblemPage from "../pages/ProblemPage";
import Submissions from "../pages/Submissions";
import Leaderboard from "../pages/Leaderboard";
import AIReview from "../pages/AIReview";

function AdminRoute({ children }) {
  const { user } = useAuth();
  // Adjust this check based on your user object structure
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* -------------------- Public Routes (No Navbar) -------------------- */}
      <Route path="/login" element={<AuthForm />} />
      <Route path="/register" element={<AuthForm />} />

      {/* -------------------- Protected Routes (WITH Navbar) -------------------- */}
      {/* All routes inside this <Route element={<AuthenticatedLayout />}> will render the Navbar */}
      <Route element={<AuthenticatedLayout />}>
        {/* Each of these routes is still wrapped by ProtectedRoute internally */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
        <Route path="/problem/:id" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
        <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/ai-review" element={<ProtectedRoute><AIReview /></ProtectedRoute>} />
        <Route path="/add-problem" element={
          <ProtectedRoute>
            <AdminRoute>
              <AddProblem />
            </AdminRoute>
          </ProtectedRoute>
        } />
      </Route>

      {/* -------------------- Catch-all and Initial Redirect -------------------- */}
      <Route
        path="*"
        element={<AuthRedirect />} // This component decides where to send the user
      />
    </Routes>
  );
}

// Ensure this component is correctly defined and handles your authentication logic
const AuthRedirect = () => {
  const { user } = useAuth(); // Or whatever provides authentication status (e.g., isAuthenticated)
  const location = useLocation(); // Make sure to import useLocation if not already

  // If the user is authenticated, send them to dashboard
  if (user /* && user.isAuthenticated */) {
    // If they landed on /login or /register while already logged in, redirect them away
    if (location.pathname === '/login' || location.pathname === '/register') {
      return <Navigate to="/dashboard" replace />;
    }
    // For any other path (including '/') if authenticated, go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If the user is NOT authenticated, always send them to the login page
  return <Navigate to="/login" replace />;
};