import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProjectFeed from "./components/ProjectFeed";
import ProfilePage from "./components/ProfilePage";
import FounderDashboard from "./components/FounderDashboard";
import CreateFounderProfile from "./pages/CreateFounderProfile";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    <>
      <Header />
      <Routes>

        {/* Home / Project Feed */}
        <Route path="/" element={<ProjectFeed />} />

        {/* Profile Page */}
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Founder Dashboard */}
        <Route path="/founder-dashboard" element={<FounderDashboard />} />

        {/* Create Founder Profile */}
        <Route
          path="/create-founder-profile"
          element={<CreateFounderProfile />}
        />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </>
  );
}

export default App;
