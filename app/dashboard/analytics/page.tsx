"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaEye, 
  FaUsers, 
  FaMousePointer,
  FaClock,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaTablet,
  FaDownload,
  FaCalendarAlt
} from "react-icons/fa";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  trafficSources: Array<{ source: string; percentage: number }>;
  deviceStats: Array<{ device: string; percentage: number }>;
  monthlyData: Array<{ month: string; views: number; visitors: number }>;
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    trafficSources: [],
    deviceStats: [],
    monthlyData: []
  });

  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        totalViews: 15420,
        uniqueVisitors: 8930,
        pageViews: 23150,
        bounceRate: 35.2,
        avgSessionDuration: 245,
        topPages: [
          { page: "/", views: 5420 },
          { page: "/Projects", views: 3200 },
          { page: "/About", views: 2100 },
          { page: "/Experience", views: 1800 },
          { page: "/Skills", views: 1500 }
        ],
        trafficSources: [
          { source: "Direct", percentage: 45 },
          { source: "Google", percentage: 30 },
          { source: "Social Media", percentage: 15 },
          { source: "Referrals", percentage: 10 }
        ],
        deviceStats: [
          { device: "Desktop", percentage: 50 },
          { device: "Mobile", percentage: 40 },
          { device: "Tablet", percentage: 10 }
        ],
        monthlyData: [
          { month: "Jan", views: 1200, visitors: 800 },
          { month: "Feb", views: 1500, visitors: 950 },
          { month: "Mar", views: 1800, visitors: 1100 },
          { month: "Apr", views: 2200, visitors: 1300 },
          { month: "May", views: 2800, visitors: 1600 },
          { month: "Jun", views: 3200, visitors: 1900 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle 
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your portfolio performance</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          icon={FaEye}
          color="bg-blue-500"
          subtitle="All time"
        />
        <StatCard
          title="Unique Visitors"
          value={analytics.uniqueVisitors.toLocaleString()}
          icon={FaUsers}
          color="bg-green-500"
          subtitle="All time"
        />
        <StatCard
          title="Page Views"
          value={analytics.pageViews.toLocaleString()}
          icon={FaMousePointer}
          color="bg-purple-500"
          subtitle="All time"
        />
        <StatCard
          title="Avg. Session"
          value={formatDuration(analytics.avgSessionDuration)}
          icon={FaClock}
          color="bg-orange-500"
          subtitle="Duration"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Overview</h3>
            <FaChartLine className="text-blue-500" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.monthlyData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center w-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.views / 4000) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg w-full mb-2"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.visitors / 4000) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className="bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg w-full"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Visitors</span>
            </div>
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <FaChartPie className="text-purple-500" />
          </div>
          <div className="space-y-4">
            {analytics.trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <span className="text-gray-700">{source.source}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                      }`}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
            <FaChartBar className="text-green-500" />
          </div>
          <div className="space-y-4">
            {analytics.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-500 text-sm mr-3">#{index + 1}</span>
                  <span className="text-gray-700">{page.page}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(page.views / 6000) * 100}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-green-500 h-2 rounded-full"
                    />
                  </div>
                  <span className="text-gray-900 font-semibold">{page.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Device Breakdown</h3>
            <div className="flex space-x-2">
              <FaDesktop className="text-blue-500" />
              <FaMobile className="text-green-500" />
              <FaTablet className="text-purple-500" />
            </div>
          </div>
          <div className="space-y-4">
            {analytics.deviceStats.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <div className="flex items-center">
                  {device.device === 'Desktop' && <FaDesktop className="text-blue-500 mr-3" />}
                  {device.device === 'Mobile' && <FaMobile className="text-green-500 mr-3" />}
                  {device.device === 'Tablet' && <FaTablet className="text-purple-500 mr-3" />}
                  <span className="text-gray-700">{device.device}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className={`h-2 rounded-full ${
                        device.device === 'Desktop' ? 'bg-blue-500' :
                        device.device === 'Mobile' ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
