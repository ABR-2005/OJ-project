import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust path if your Navbar is not in src/components

const AuthenticatedLayout = () => {
  const location = useLocation(); // Still useful here for Navbar's internal active link styling

  // This layout implicitly means the Navbar should be shown
  // as it's only used for protected routes.

  return (
    <>
      <Navbar />
      <main>
        <Outlet /> {/* Renders child routes from the nested <Route> */}
      </main>
    </>
  );
};

export default AuthenticatedLayout;