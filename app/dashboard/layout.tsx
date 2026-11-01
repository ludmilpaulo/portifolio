"use client";
import { Suspense, useMemo, useState } from "react";
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
  FaUpload,
  FaUsers,
  FaFileAlt,
  FaShieldAlt,
  FaInbox,
  FaAward,
  FaTasks,
  FaFileInvoice,
  FaFileContract,
  FaChartLine,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  key: string;
  href: string;
  icon: typeof FaHome;
  label: string;
  color: string;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  const isClientRoute = pathname.startsWith("/dashboard/client");
  const requiredUserType = isClientRoute ? "client" : "admin";
  const redirectTo = isClientRoute ? "/client-login" : "/admin-login";

  const adminMenuItems = useMemo<MenuItem[]>(() => ([
    { key: "dashboard", href: "/dashboard", icon: FaHome, label: "Dashboard", color: "text-blue-500" },
    { key: "profile", href: "/dashboard/profile", icon: FaUser, label: "Profile", color: "text-green-500" },
    { key: "projects", href: "/dashboard/projects", icon: FaProjectDiagram, label: "Projects", color: "text-purple-500" },
    { key: "inquiries", href: "/dashboard/inquiries", icon: FaInbox, label: "Inquiries", color: "text-cyan-500" },
    { key: "certificates", href: "/dashboard/certificates", icon: FaAward, label: "Certificates", color: "text-amber-500" },
    { key: "analytics", href: "/dashboard/analytics", icon: FaChartBar, label: "Analytics", color: "text-orange-500" },
    { key: "media", href: "/dashboard/media", icon: FaUpload, label: "Media", color: "text-pink-500" },
    { key: "testimonials", href: "/dashboard/testimonials", icon: FaUsers, label: "Testimonials", color: "text-indigo-500" },
    { key: "users", href: "/dashboard/users", icon: FaUsers, label: "Users", color: "text-red-500" },
    { key: "notifications", href: "/dashboard/notifications", icon: FaBell, label: "Notifications", color: "text-yellow-500" },
    { key: "security", href: "/dashboard/security", icon: FaShieldAlt, label: "Security", color: "text-yellow-500" },
    { key: "settings", href: "/dashboard/settings", icon: FaCog, label: "Settings", color: "text-gray-500" },
  ]), []);

  const clientMenuItems = useMemo<MenuItem[]>(() => ([
    { key: "projects", href: "/dashboard/client?tab=projects", icon: FaFileAlt, label: "Projects", color: "text-blue-500" },
    { key: "tasks", href: "/dashboard/client?tab=tasks", icon: FaTasks, label: "Tasks", color: "text-purple-500" },
    { key: "invoices", href: "/dashboard/client?tab=invoices", icon: FaFileInvoice, label: "Invoices", color: "text-emerald-500" },
    { key: "documents", href: "/dashboard/client?tab=documents", icon: FaFileContract, label: "Documents", color: "text-teal-500" },
    { key: "progress", href: "/dashboard/client?tab=progress", icon: FaChartLine, label: "Progress", color: "text-orange-500" },
  ]), []);

  const menuItems = user?.user_type === "client" ? clientMenuItems : adminMenuItems;
  const currentTab = searchParams.get("tab") || "projects";

  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return true;
    const tab = new URLSearchParams(query).get("tab");
    return tab === currentTab;
  };

  const displayName = user
    ? `${[user.first_name, user.last_name].filter(Boolean).join(" ") || user.username}`
    : "Guest";

  const initials = user
    ? `${(user.first_name?.[0] || user.username?.[0] || "U")}${user.last_name?.[0] || ""}`.toUpperCase()
    : "U";

  const roleLabel = user?.user_type === "client" ? "Client" : "Admin";

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {user?.user_type === "client" ? "Client Portal" : "Portfolio Admin"}
          </h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[#0093E9]">{roleLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          aria-label="Close navigation"
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center px-4 py-3 text-gray-700 transition-colors hover:bg-gray-100 ${
              isActive(item.href) ? "border-r-4 border-blue-500 bg-blue-50" : ""
            }`}
          >
            <item.icon className={`mr-3 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-100"
        >
          <FaSignOutAlt className="mr-3 text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );

  return (
    <ProtectedRoute requiredUserType={requiredUserType} redirectTo={redirectTo}>
      <div className="min-h-screen bg-gray-50 lg:flex">
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white shadow-sm lg:block">
          {sidebar}
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-slate-950/60 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="h-full w-72 max-w-[85vw] bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                {sidebar}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <header className="border-b bg-white shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="mr-3 rounded-lg p-2 hover:bg-gray-100 lg:hidden"
                  aria-label="Open navigation"
                >
                  <FaBars className="text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                    {user?.user_type === "client" ? "Client Dashboard" : "Dashboard"}
                  </h1>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{roleLabel}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <span className="text-sm font-semibold text-white">{initials}</span>
                </div>
                <span className="hidden font-medium text-gray-700 sm:inline">{displayName}</span>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default function DashboardLayoutBoundary({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  );
}
