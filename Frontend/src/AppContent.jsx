import React from "react";
// Remove useLocation as it's no longer needed in AppContent for Navbar logic
// import { useLocation } from "react-router-dom"; // REMOVED

import AppRoutes from "./routes";
// Remove Navbar import as it's no longer rendered directly by AppContent
// import Navbar from "./components/Navbar"; // REMOVED

const AppContent = () => {
  // All Navbar-related state and logic are removed from here
  // const location = useLocation(); // REMOVED
  // const hideNavbarRoutes = ["/login", "/register"]; // REMOVED
  // const showNavbar = !hideNavbarRoutes.includes(location.pathname); // REMOVED

  // DEBUG LOGS START - You can remove these debug logs after confirming it works
  console.log("AppContent: Rendering AppRoutes");
  // console.log("AppContent: Current Path =", location.pathname); // REMOVED as useLocation is gone
  // console.log("AppContent: hideNavbarRoutes =", hideNavbarRoutes); // REMOVED
  // console.log("AppContent: Should Show Navbar =", showNavbar); // REMOVED
  // DEBUG LOGS END

  return (
    <>
      {/* The Navbar conditional rendering is removed from here */}
      {/* {showNavbar && <Navbar />} // REMOVED */}

      {/* AppContent now solely renders your routing logic */}
      <AppRoutes />
    </>
  );
};

export default AppContent;