import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import ProblemList from "../pages/ProblemList";
import ProblemPage from "../pages/ProblemPage";
import Submissions from "../pages/Submissions";
import Leaderboard from "../pages/Leaderboard";
import AIReview from "../pages/AIReview";
import Login from "../components/Login";
import Register from "../components/Register";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
      <Route path="/problem/:id" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute><Submissions /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/ai-review" element={<ProtectedRoute><AIReview /></ProtectedRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
