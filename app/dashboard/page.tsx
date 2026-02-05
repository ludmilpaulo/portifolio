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
  FaChartLine,
  FaCalendarAlt,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  projects: number;
  testimonials: number;
  viewsChange: number;
  visitorsChange: number;
  projectsChange: number;
  testimonialsChange: number;
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

  const [recentActivity, setRecentActivity] = useState([]);
  const [deviceStats, setDeviceStats] = useState({
    mobile: 45,
    desktop: 50,
    tablet: 5
  });

  useEffect(() => {
    // Load analytics data
    const loadAnalytics = async () => {
      try {
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
          });
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
        // Fallback data
        setAnalytics({
          totalViews: 15420,
          uniqueVisitors: 8930,
          projects: 28,
          testimonials: 15,
          viewsChange: 12.5,
          visitorsChange: 8.3,
          projectsChange: 25.0,
          testimonialsChange: 15.7,
        });
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
            <div className="flex items-center space-x-2">
              <FaChartLine className="text-blue-500" />
              <span className="text-sm text-gray-600">Last 30 days</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 78, 45, 89, 67, 92, 85, 78, 95, 88, 76, 82].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg flex-1"
              />
            ))}
          </div>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaDesktop className="text-blue-500 mr-3" />
                <span className="text-gray-700">Desktop</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.desktop}%` }}
                  />
                </div>
                <span className="text-gray-900 font-semibold">{deviceStats.desktop}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaMobile className="text-green-500 mr-3" />
                <span className="text-gray-700">Mobile</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.mobile}%` }}
                  />
                </div>
                <span className="text-gray-900 font-semibold">{deviceStats.mobile}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaGlobe className="text-purple-500 mr-3" />
                <span className="text-gray-700">Tablet</span>
              </div>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${deviceStats.tablet}%` }}
                  />
                </div>
                <span className="text-gray-900 font-semibold">{deviceStats.tablet}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
          {[
            { action: "New project added", time: "2 hours ago", type: "project" },
            { action: "Testimonial received", time: "4 hours ago", type: "testimonial" },
            { action: "Profile updated", time: "1 day ago", type: "profile" },
            { action: "Media uploaded", time: "2 days ago", type: "media" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  activity.type === 'project' ? 'bg-purple-500' :
                  activity.type === 'testimonial' ? 'bg-orange-500' :
                  activity.type === 'profile' ? 'bg-green-500' : 'bg-pink-500'
                }`} />
                <span className="text-gray-700">{activity.action}</span>
              </div>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
