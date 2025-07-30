"use client";
import Sidebar from "../ui/sidebar/Sidebar";
import Navbar from "../ui/navbar/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
