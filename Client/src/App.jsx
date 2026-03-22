import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProjectFeed from "./components/ProjectFeed";
import ProfilePage from "./components/ProfilePage";
import FounderDashboard from "./pages/FounderDashboard";
import CreateFounderProfile from "./pages/CreateFounderProfile";
import Login from "./pages/login";
import Signup from "./pages/signup";
import CreateStartupModal from "./components/CreateStartupModal";
import FounderProjectSubmissions from "./pages/FounderProjectSubmissions";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledStartupId, setPrefilledStartupId] = useState('');

  const openConnectModal = (startupId = '') => {
    setPrefilledStartupId(startupId);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      <Routes>

        {/* Home / Project Feed */}
        <Route path="/" element={<ProjectFeed onActionClick={(id) => openConnectModal(id)} />} />

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

        {/* Founder views submissions for a project */}
        <Route path="/founder-projects/:projectId/submissions" element={<FounderProjectSubmissions />} />

        {/* Job Seeker Dashboard */}
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />

      </Routes>

      {/* Unified Connect Modal */}
      {isModalOpen && (
        <CreateStartupModal
          onClose={() => {
            setIsModalOpen(false);
            setPrefilledStartupId('');
          }}
          initialStartupId={prefilledStartupId}
        />
      )}
    </>
  );
}

export default App;
