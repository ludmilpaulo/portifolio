"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  FaEye, 
  FaUsers, 
  FaProjectDiagram, 
  FaThumbsUp,
  FaArrowUp,
  FaArrowDown,
  FaCalendarAlt,
  FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface RecentActivityItem {
  type: string;
  title: string;
  time: string;
  message?: string;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  projects: number;
  testimonials: number;
  viewsChange: number;
  visitorsChange: number;
  projectsChange: number;
  testimonialsChange: number;
  inquiries?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  tasks?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  recentActivities?: RecentActivityItem[];
}

const DashboardPage = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    projects: 0,
    testimonials: 0,
    viewsChange: 0,
    visitorsChange: 0,
    projectsChange: 0,
    testimonialsChange: 0,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    // Load analytics data
    const loadAnalytics = async () => {
      try {
        setIsLoadingAnalytics(true);
        setAnalyticsError(null);
        const response = await fetch('/api/graphql?type=analytics');
        const result = await response.json();
        if (result.success) {
          const d = result.data || {};
          setAnalytics({
            totalViews: Number(d.totalViews ?? 0),
            uniqueVisitors: Number(d.uniqueVisitors ?? 0),
            projects: Number(d.projects ?? 0),
            testimonials: Number(d.testimonials ?? 0),
            viewsChange: Number(d.viewsChange ?? 0),
            visitorsChange: Number(d.visitorsChange ?? 0),
            projectsChange: Number(d.projectsChange ?? 0),
            testimonialsChange: Number(d.testimonialsChange ?? 0),
            inquiries: d.inquiries,
            tasks: d.tasks,
            recentActivities: d.recentActivities,
          });
          setRecentActivity(Array.isArray(d.recentActivities) ? d.recentActivities : []);
        } else {
          setAnalyticsError(result.error || "Failed to load analytics");
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        setAnalyticsError("Failed to load analytics from backend");
        // Keep real values only (zeros) rather than showing fake/demo numbers
        setAnalytics((prev) => ({
          ...prev,
          totalViews: 0,
          uniqueVisitors: 0,
          projects: 0,
          testimonials: 0,
          viewsChange: 0,
          visitorsChange: 0,
          projectsChange: 0,
          testimonialsChange: 0,
          inquiries: undefined,
          tasks: undefined,
        }));
        setRecentActivity([]);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };
    loadAnalytics();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: {
    title: string;
    value?: number | null;
    change?: number | null;
    icon: any;
    color: string;
  }) => {
    const safeValue = Number(value ?? 0);
    const safeChange = Number(change ?? 0);
    return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Number.isFinite(safeValue) ? safeValue.toLocaleString() : '0'}
          </p>
          <div className="flex items-center mt-2">
            {safeChange > 0 ? (
              <FaArrowUp className="text-green-500 text-sm mr-1" />
            ) : (
              <FaArrowDown className="text-red-500 text-sm mr-1" />
            )}
            <span className={`text-sm font-medium ${safeChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(safeChange) || 0}%
            </span>
            <span className="text-gray-500 text-sm ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </motion.div>
  );
  }

  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.first_name || 'Admin'}!</h1>
              <p className="text-blue-100">Here&apos;s what&apos;s happening with your portfolio today.</p>
            </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={analytics.totalViews}
          change={analytics.viewsChange}
          icon={FaEye}
          color="bg-blue-500"
        />
        <StatCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors}
          change={analytics.visitorsChange}
          icon={FaUsers}
          color="bg-green-500"
        />
        <StatCard
          title="Projects"
          value={analytics.projects}
          change={analytics.projectsChange}
          icon={FaProjectDiagram}
          color="bg-purple-500"
        />
        <StatCard
          title="Testimonials"
          value={analytics.testimonials}
          change={analytics.testimonialsChange}
          icon={FaThumbsUp}
          color="bg-orange-500"
        />
      </div>

      {/* Backend-only info: loading/error */}
      {(isLoadingAnalytics || analyticsError) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 border ${
            analyticsError ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
          }`}
        >
          {isLoadingAnalytics && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-800 font-medium">Loading analytics from backend...</p>
            </div>
          )}
          {!isLoadingAnalytics && analyticsError && (
            <p className="text-red-800 font-medium">
              {analyticsError}. Please make sure the Django backend is running and reachable.
            </p>
          )}
        </motion.div>
      )}

      {/* Backend breakdown cards (real data) */}
      {(analytics.inquiries || analytics.tasks) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.inquiries && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiries (Backend)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.inquiries.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-yellow-700 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{analytics.inquiries.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-blue-800">{analytics.inquiries.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-700 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-800">{analytics.inquiries.completed}</p>
                </div>
              </div>
            </motion.div>
          )}

          {analytics.tasks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks (Backend)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.tasks.total}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-yellow-700 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-800">{analytics.tasks.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-700 text-sm">In Progress</p>
                  <p className="text-2xl font-bold text-blue-800">{analytics.tasks.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-700 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-800">{analytics.tasks.completed}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <FaCalendarAlt className="text-gray-400" />
        </div>
        <div className="space-y-3">
          {recentActivity.length === 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
              No recent activity from backend yet.
            </div>
          )}
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-col">
                <span className="text-gray-800 font-medium">{activity.title}</span>
                {activity.message && (
                  <span className="text-gray-600 text-sm">{activity.message}</span>
                )}
              </div>
              <span className="text-gray-500 text-sm">
                {activity.time ? new Date(activity.time).toLocaleString() : ""}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
