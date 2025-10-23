"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaFileAlt,
  FaDownload,
  FaPaperPlane,
  FaComments,
  FaStar
} from "react-icons/fa";

interface ProjectInquiry {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectTitle: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: number;
    sender: "client" | "admin";
    message: string;
    timestamp: string;
  }>;
  attachments?: string[];
  estimatedCost?: number;
  actualCost?: number;
}

const ClientDashboard = () => {
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ProjectInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Simulate loading inquiries
    const mockInquiries: ProjectInquiry[] = [
      {
        id: 1,
        clientName: "John Smith",
        clientEmail: "john@example.com",
        clientPhone: "+1234567890",
        projectTitle: "E-commerce Website Development",
        projectDescription: "Need a full-stack e-commerce website with payment integration, inventory management, and admin dashboard.",
        budget: "$10,000 - $15,000",
        timeline: "3-4 months",
        status: "in-progress",
        priority: "high",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-02-15T14:20:00Z",
        estimatedCost: 12500,
        actualCost: 0,
        messages: [
          {
            id: 1,
            sender: "client",
            message: "Hi, I'm interested in developing an e-commerce website for my business.",
            timestamp: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            sender: "admin",
            message: "Thank you for your inquiry! I'd be happy to help you with your e-commerce project. Let me gather some more details.",
            timestamp: "2024-01-15T11:00:00Z"
          }
        ]
      },
      {
        id: 2,
        clientName: "Sarah Johnson",
        clientEmail: "sarah@example.com",
        projectTitle: "Mobile App Development",
        projectDescription: "Looking for a React Native mobile app for iOS and Android with user authentication and real-time features.",
        budget: "$8,000 - $12,000",
        timeline: "2-3 months",
        status: "pending",
        priority: "medium",
        createdAt: "2024-02-01T09:15:00Z",
        updatedAt: "2024-02-01T09:15:00Z",
        estimatedCost: 10000,
        messages: [
          {
            id: 1,
            sender: "client",
            message: "I need a mobile app for my startup. Can you help?",
            timestamp: "2024-02-01T09:15:00Z"
          }
        ]
      },
      {
        id: 3,
        clientName: "Mike Wilson",
        clientEmail: "mike@example.com",
        clientPhone: "+1234567892",
        projectTitle: "Portfolio Website",
        projectDescription: "Simple portfolio website with contact form and project showcase.",
        budget: "$2,000 - $3,000",
        timeline: "1 month",
        status: "completed",
        priority: "low",
        createdAt: "2024-01-01T14:20:00Z",
        updatedAt: "2024-01-30T16:45:00Z",
        estimatedCost: 2500,
        actualCost: 2500,
        messages: [
          {
            id: 1,
            sender: "client",
            message: "I need a simple portfolio website.",
            timestamp: "2024-01-01T14:20:00Z"
          },
          {
            id: 2,
            sender: "admin",
            message: "Perfect! I can create a beautiful portfolio website for you.",
            timestamp: "2024-01-01T15:00:00Z"
          }
        ]
      }
    ];
    setInquiries(mockInquiries);
    setFilteredInquiries(mockInquiries);
  }, []);

  useEffect(() => {
    let filtered = inquiries;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.priority === priorityFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter, priorityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return FaClock;
      case "in-progress":
        return FaExclamationCircle;
      case "completed":
        return FaCheckCircle;
      case "cancelled":
        return FaTimesCircle;
      default:
        return FaClock;
    }
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setInquiries(inquiries.map(inquiry =>
      inquiry.id === id
        ? { ...inquiry, status: newStatus as any, updatedAt: new Date().toISOString() }
        : inquiry
    ));
  };

  const handleSendMessage = (inquiryId: number) => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "admin" as const,
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setInquiries(inquiries.map(inquiry =>
      inquiry.id === inquiryId
        ? { ...inquiry, messages: [...inquiry.messages, message], updatedAt: new Date().toISOString() }
        : inquiry
    ));

    setNewMessage("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this inquiry?")) {
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage project inquiries and client communications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          New Inquiry
        </motion.button>
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
              <p className="text-gray-600 text-sm font-medium">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{inquiries.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FaFileAlt className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {inquiries.filter(i => i.status === "pending").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <FaClock className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {inquiries.filter(i => i.status === "in-progress").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FaExclamationCircle className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {inquiries.filter(i => i.status === "completed").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredInquiries.map((inquiry, index) => {
            const StatusIcon = getStatusIcon(inquiry.status);
            return (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{inquiry.projectTitle}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.replace("-", " ")}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(inquiry.priority)}`}>
                        {inquiry.priority}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-2" />
                        <span>{inquiry.clientName}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2" />
                        <span>{inquiry.clientEmail}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaDollarSign className="mr-2" />
                        <span>{inquiry.budget}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-2" />
                        <span>{inquiry.timeline}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{inquiry.projectDescription}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FaComments className="mr-1" />
                        <span>{inquiry.messages.length} messages</span>
                        <span className="mx-2">•</span>
                        <span>Created {new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <select
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredInquiries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaFileAlt className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Create Your First Inquiry
          </button>
        </motion.div>
      )}

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {selectedInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedInquiry(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedInquiry.projectTitle}</h2>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimesCircle />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inquiry Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Client:</span>
                      <span className="ml-2 text-gray-600">{selectedInquiry.clientName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-600">{selectedInquiry.clientEmail}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <span className="ml-2 text-gray-600">{selectedInquiry.budget}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Timeline:</span>
                      <span className="ml-2 text-gray-600">{selectedInquiry.timeline}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInquiry.status)}`}>
                        {selectedInquiry.status.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600">{selectedInquiry.projectDescription}</p>
                  </div>
                </div>

                {/* Messages */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedInquiry.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.sender === "admin"
                            ? "bg-blue-50 ml-8"
                            : "bg-gray-50 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {message.sender === "admin" ? "You" : selectedInquiry.clientName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{message.message}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage(selectedInquiry.id)}
                      />
                      <button
                        onClick={() => handleSendMessage(selectedInquiry.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDashboard;
