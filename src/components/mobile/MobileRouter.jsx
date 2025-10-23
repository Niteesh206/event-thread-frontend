import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import ExplorePage from '../../pages/ExplorePage';
import CreatePage from '../../pages/CreatePage';
import AlertsPage from '../../pages/AlertsPage';
import ProfilePage from '../../pages/ProfilePage';
import GossipsPage from '../GossipsPage';

/**
 * MobileRouter - React Router setup for mobile pages
 * Handles all mobile navigation and routing
 */
const MobileRouter = ({
  currentUser,
  threads,
  categories,
  filterCategory,
  onCategoryChange,
  getTimeRemaining,
  onThreadClick,
  onActionClick,
  onCreateThread,
  onLogout,
  socketRef
}) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Main Pages */}
        <Route
          path="/home"
          element={
            <HomePage
              currentUser={currentUser}
              threads={threads}
              categories={categories}
              filterCategory={filterCategory}
              onCategoryChange={onCategoryChange}
              getTimeRemaining={getTimeRemaining}
              onThreadClick={onThreadClick}
              onActionClick={onActionClick}
            />
          }
        />
        
        <Route
          path="/explore"
          element={
            <ExplorePage
              currentUser={currentUser}
              threads={threads}
              categories={categories}
              getTimeRemaining={getTimeRemaining}
              onThreadClick={onThreadClick}
              onActionClick={onActionClick}
            />
          }
        />
        
        <Route
          path="/gossips"
          element={
            <GossipsPage
              currentUser={currentUser}
              socketRef={socketRef}
              onBack={() => window.history.back()}
            />
          }
        />
        
        <Route
          path="/create"
          element={
            <CreatePage
              currentUser={currentUser}
              categories={categories}
              onCreateThread={onCreateThread}
            />
          }
        />
        
        <Route
          path="/alerts"
          element={
            <AlertsPage
              currentUser={currentUser}
              threads={threads}
            />
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProfilePage
              currentUser={currentUser}
              threads={threads}
              onLogout={onLogout}
              getTimeRemaining={getTimeRemaining}
              onThreadClick={onThreadClick}
              onActionClick={onActionClick}
            />
          }
        />
        
        {/* Fallback - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MobileRouter;
