"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEye, FaUsers, FaDownload, FaCalendarAlt, FaClipboardList, FaTasks } from "react-icons/fa";

interface RecentActivityItem {
  type: string;
  title: string;
  time: string;
  message?: string;
}

interface BackendAnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  projects: number;
  testimonials: number;
  viewsChange: number;
  visitorsChange: number;
  projectsChange: number;
  testimonialsChange: number;
  inquiries?: { total: number; pending: number; inProgress: number; completed: number };
  tasks?: { total: number; pending: number; inProgress: number; completed: number };
  recentActivities?: RecentActivityItem[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<BackendAnalyticsData>({
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
    recentActivities: [],
  });

  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/graphql?type=analytics");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load analytics");
        const d = json.data || {};
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
          recentActivities: Array.isArray(d.recentActivities) ? d.recentActivities : [],
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load analytics");
        setAnalytics({
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
          recentActivities: [],
        });
      } finally {
        setLoading(false);
      }
    };
    // Backend currently ignores timeRange; we still re-fetch on change.
    load();
  }, [timeRange]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    subtitle,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Real data from Django backend</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center">
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Views" value={analytics.totalViews.toLocaleString()} icon={FaEye} color="bg-blue-500" subtitle="Backend" />
        <StatCard title="Unique Visitors" value={analytics.uniqueVisitors.toLocaleString()} icon={FaUsers} color="bg-green-500" subtitle="Backend" />
        <StatCard title="Projects" value={analytics.projects.toLocaleString()} icon={FaClipboardList} color="bg-purple-500" subtitle="Backend" />
        <StatCard title="Tasks" value={(analytics.tasks?.total ?? 0).toLocaleString()} icon={FaTasks} color="bg-orange-500" subtitle="Backend" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Inquiries (Backend)</h3>
            <FaCalendarAlt className="text-gray-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.inquiries?.total ?? 0}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-yellow-700">Pending</div>
              <div className="text-2xl font-bold text-yellow-800">{analytics.inquiries?.pending ?? 0}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-700">In Progress</div>
              <div className="text-2xl font-bold text-blue-800">{analytics.inquiries?.inProgress ?? 0}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-700">Completed</div>
              <div className="text-2xl font-bold text-green-800">{analytics.inquiries?.completed ?? 0}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity (Backend)</h3>
            <FaCalendarAlt className="text-gray-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(analytics.recentActivities || []).length === 0 && (
              <div className="text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">
                No recent activity from backend yet.
              </div>
            )}
            {(analytics.recentActivities || []).map((a, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <div className="text-gray-900 font-medium">{a.title}</div>
                {a.message && <div className="text-gray-600 text-sm">{a.message}</div>}
                <div className="text-gray-500 text-xs mt-1">
                  {a.time ? new Date(a.time).toLocaleString() : ""}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
