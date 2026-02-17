import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import ViewMap from "./ViewMap";
import type { JSX } from "react";
import UserPage from "./UserPage";

function isAuthed() {
  return localStorage.getItem("authed") === "true";
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthed() ? "/map" : "/login"} replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <ViewMap />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

      <Route
        path="/u/:username"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
