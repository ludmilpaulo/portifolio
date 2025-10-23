"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBell, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaEyeSlash,
  FaTrash,
  FaFilter,
  FaSearch,
  FaCalendarAlt,
  FaUser,
  FaProjectDiagram,
  FaEnvelope,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  category: "project" | "user" | "system" | "inquiry";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate loading notifications
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Project Inquiry",
        message: "John Smith submitted a new project inquiry for E-commerce Website Development",
        type: "info",
        category: "inquiry",
        isRead: false,
        createdAt: "2024-02-15T10:30:00Z",
        actionUrl: "/dashboard/client",
        actionText: "View Inquiry"
      },
      {
        id: 2,
        title: "Project Completed",
        message: "Portfolio Website project has been completed successfully",
        type: "success",
        category: "project",
        isRead: false,
        createdAt: "2024-02-14T16:45:00Z",
        actionUrl: "/dashboard/projects",
        actionText: "View Project"
      },
      {
        id: 3,
        title: "New User Registration",
        message: "Jane Doe registered as a new client",
        type: "info",
        category: "user",
        isRead: true,
        createdAt: "2024-02-14T09:15:00Z",
        actionUrl: "/dashboard/users",
        actionText: "View User"
      },
      {
        id: 4,
        title: "System Maintenance",
        message: "Scheduled maintenance will occur tonight from 2-4 AM",
        type: "warning",
        category: "system",
        isRead: true,
        createdAt: "2024-02-13T14:20:00Z"
      },
      {
        id: 5,
        title: "Payment Received",
        message: "Payment of $2,500 received for Task Management App project",
        type: "success",
        category: "project",
        isRead: false,
        createdAt: "2024-02-13T11:30:00Z",
        actionUrl: "/dashboard/projects",
        actionText: "View Project"
      },
      {
        id: 6,
        title: "Testimonial Received",
        message: "New testimonial received from Mike Wilson",
        type: "info",
        category: "project",
        isRead: true,
        createdAt: "2024-02-12T15:45:00Z",
        actionUrl: "/dashboard/testimonials",
        actionText: "View Testimonial"
      },
      {
        id: 7,
        title: "High Priority Inquiry",
        message: "Urgent project inquiry requires immediate attention",
        type: "error",
        category: "inquiry",
        isRead: false,
        createdAt: "2024-02-12T08:20:00Z",
        actionUrl: "/dashboard/client",
        actionText: "View Inquiry"
      },
      {
        id: 8,
        title: "Backup Completed",
        message: "Daily backup completed successfully",
        type: "success",
        category: "system",
        isRead: true,
        createdAt: "2024-02-11T23:59:00Z"
      }
    ];
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(notification => notification.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(notification => 
        statusFilter === "read" ? notification.isRead : !notification.isRead
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter, categoryFilter, statusFilter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      case "info":
      default:
        return "text-blue-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return FaCheckCircle;
      case "warning":
        return FaExclamationTriangle;
      case "error":
        return FaTimes;
      case "info":
      default:
        return FaInfoCircle;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "project":
        return FaProjectDiagram;
      case "user":
        return FaUser;
      case "system":
        return FaBell;
      case "inquiry":
        return FaEnvelope;
      default:
        return FaBell;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(notification => !notification.isRead));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your portfolio activity</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
            >
              <FaCheck className="mr-2" />
              Mark All Read
            </button>
          )}
          <button
            onClick={deleteAllRead}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
          >
            <FaTrash className="mr-2" />
            Delete Read
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Notifications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{notifications.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FaBell className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Unread</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{unreadCount}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500">
              <FaEyeSlash className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {notifications.filter(n => 
                  new Date(n.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FaClock className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">This Week</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {notifications.filter(n => {
                  const notificationDate = new Date(n.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return notificationDate >= weekAgo;
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <FaCalendarAlt className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="project">Project</option>
            <option value="user">User</option>
            <option value="system">System</option>
            <option value="inquiry">Inquiry</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.map((notification, index) => {
            const TypeIcon = getTypeIcon(notification.type);
            const CategoryIcon = getCategoryIcon(notification.category);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 transition-all ${
                  !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${getTypeColor(notification.type)} bg-opacity-10`}>
                      <TypeIcon className="text-xl" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CategoryIcon className="mr-1" />
                          <span className="capitalize">{notification.category}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>{new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <a
                            href={notification.actionUrl}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {notification.actionText}
                            <span className="ml-1">→</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <FaEye />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredNotifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaBell className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationsPage;
