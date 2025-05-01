import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import MainPage from "./pages/MainPage"; // Import the new MainPage component
import { useAuth } from "./context/AuthContext";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";

// Layout component that includes the NavBar
const LayoutWithNavbar = () => {
  return (
    <>
      <NavBar />
      <Outlet /> {/* This will render the child routes */}
    </>
  );
};

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      <Routes>
        {/* Routes without NavBar */}
        <Route path="/login" element={<Login />} />

        {/* Routes with NavBar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/" element={<MainPage />} /> {/* Main page route */}
        </Route>

        {/* Redirect to login page if not authenticated */}
        <Route
          path="*"
          element={<Navigate to={user ? "/profile" : "/login"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
