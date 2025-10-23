"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaUser, 
  FaProjectDiagram, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaUpload,
  FaDatabase,
  FaUsers,
  FaFileAlt,
  FaShieldAlt
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: FaHome, label: "Dashboard", color: "text-blue-500" },
    { href: "/dashboard/profile", icon: FaUser, label: "Profile", color: "text-green-500" },
    { href: "/dashboard/projects", icon: FaProjectDiagram, label: "Projects", color: "text-purple-500" },
    { href: "/dashboard/analytics", icon: FaChartBar, label: "Analytics", color: "text-orange-500" },
    { href: "/dashboard/media", icon: FaUpload, label: "Media", color: "text-pink-500" },
    { href: "/dashboard/testimonials", icon: FaUsers, label: "Testimonials", color: "text-indigo-500" },
    { href: "/dashboard/content", icon: FaFileAlt, label: "Content", color: "text-teal-500" },
    { href: "/dashboard/users", icon: FaUsers, label: "Users", color: "text-red-500" },
    { href: "/dashboard/security", icon: FaShieldAlt, label: "Security", color: "text-yellow-500" },
    { href: "/dashboard/settings", icon: FaCog, label: "Settings", color: "text-gray-500" },
  ];

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("admin_token");
    if (!token) {
      window.location.href = "/dashboard/login";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Portfolio Admin</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            
            <nav className="mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                    pathname === item.href ? "bg-blue-50 border-r-4 border-blue-500" : ""
                  }`}
                >
                  <item.icon className={`mr-3 ${item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 mr-3"
              >
                <FaBars className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <FaBell className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">LP</span>
                </div>
                <span className="text-gray-700 font-medium">Ludmil Paulo</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
