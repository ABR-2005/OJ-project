import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";
import Navbar from "./components/Navbar";

const AppContent = () => {
  const location = useLocation();

  // Hide navbar on login/register pages
  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
};

export default AppContent;
