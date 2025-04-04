import Sidebar from "../ui/sidebar/Sidebar";
import styles from "./layout.module.css";
import Navbar from "../ui/navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
