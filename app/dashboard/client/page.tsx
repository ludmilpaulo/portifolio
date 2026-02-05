"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
  FaStar,
  FaFileInvoice,
  FaUserEdit,
  FaSignature,
  FaTasks,
  FaChartLine,
  FaCog,
  FaFileContract,
  FaHandshake,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

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
  progress?: number;
  tasks?: Task[];
  invoices?: Invoice[];
  documents?: Document[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: "client" | "admin";
  dueDate: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  createdAt: string;
  description: string;
  items: Array<{
    description: string;
    quantity: number;
    price: number;
  }>;
}

interface Document {
  id: number;
  title: string;
  type: "contract" | "agreement" | "nda" | "proposal";
  status: "draft" | "pending-signature" | "signed" | "expired";
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  downloadUrl: string;
  signedBy?: string;
}

const ClientDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ProjectInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);

  useEffect(() => {
    // Load inquiries from API - filtered by logged-in client
    const loadInquiries = async () => {
      setIsLoadingInquiries(true);
      try {
        const token = localStorage.getItem('authToken');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/graphql?type=inquiries', {
          headers,
        });
        const result = await response.json();
        if (result.success) {
          // Filter inquiries by logged-in client's email
          const clientInquiries = result.data.filter((inquiry: ProjectInquiry) => 
            inquiry.clientEmail.toLowerCase() === user?.email?.toLowerCase()
          );
          setInquiries(clientInquiries);
        } else {
          setInquiries([]);
        }
      } catch (error) {
        console.error('Error loading inquiries:', error);
        // Set empty array on error to prevent UI issues
        setInquiries([]);
      } finally {
        setIsLoadingInquiries(false);
      }
    };

    if (user) {
      loadInquiries();
    } else {
      setIsLoadingInquiries(false);
    }
  }, [user]);

  useEffect(() => {
    let filtered = inquiries;

    // First, ensure we only show inquiries for the logged-in client
    filtered = filtered.filter(inquiry => 
      inquiry.clientEmail.toLowerCase() === user?.email?.toLowerCase()
    );

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [inquiries, searchTerm, statusFilter, priorityFilter, user]);

  const handleLogout = () => {
    logout();
  };

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

  const handleSendMessage = async (inquiryId: number) => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: "client" as const,
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    // Optimistically update UI
    setInquiries(inquiries.map(inquiry =>
      inquiry.id === inquiryId
        ? { ...inquiry, messages: [...inquiry.messages, message], updatedAt: new Date().toISOString() }
        : inquiry
    ));

    // Send message to API
    try {
      const token = localStorage.getItem('authToken');
      await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          type: 'add-message',
          data: {
            inquiryId,
            message: newMessage,
            sender: 'client'
          }
        })
      });
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update on error
      setInquiries(inquiries);
    }

    setNewMessage("");
  };


  return (
    <ProtectedRoute requiredUserType="client">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your projects, invoices, and documents</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileModal(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center"
          >
            <FaUserEdit className="mr-2" />
            Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            New Inquiry
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
        <div className="flex space-x-1">
          {[
            { id: "projects", label: "Projects", icon: FaFileAlt },
            { id: "tasks", label: "Tasks", icon: FaTasks },
            { id: "invoices", label: "Invoices", icon: FaFileInvoice },
            { id: "documents", label: "Documents", icon: FaFileContract },
            { id: "progress", label: "Progress", icon: FaChartLine }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="mr-2" />
              {tab.label}
            </button>
          ))}
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

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {activeTab === "projects" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Inquiries</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>
            </div>

      {/* Loading State */}
      {isLoadingInquiries && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your projects...</p>
        </div>
      )}

      {/* Inquiries List */}
      {!isLoadingInquiries && (
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
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      )}

      {!isLoadingInquiries && filteredInquiries.length === 0 && (
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
                          message.sender === "client"
                            ? "bg-blue-50 ml-8"
                            : "bg-gray-50 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {message.sender === "client" ? "You" : "Admin"}
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
        )}

        {activeTab === "tasks" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Tasks</h2>
            <div className="space-y-4">
              {inquiries.flatMap(inquiry => inquiry.tasks || []).map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Invoices</h2>
            <div className="space-y-4">
              {inquiries.flatMap(inquiry => inquiry.invoices || []).map((invoice) => (
                <div key={invoice.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                      <p className="text-gray-600 text-sm mt-1">{invoice.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Amount: ${invoice.amount.toLocaleString()}</span>
                        <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents</h2>
            <div className="space-y-4">
              {inquiries.flatMap(inquiry => inquiry.documents || []).map((document) => (
                <div key={document.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{document.title}</h3>
                      <p className="text-gray-600 text-sm mt-1 capitalize">{document.type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Created: {new Date(document.createdAt).toLocaleDateString()}</span>
                        {document.expiresAt && (
                          <span>Expires: {new Date(document.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        document.status === 'signed' ? 'bg-green-100 text-green-800' :
                        document.status === 'pending-signature' ? 'bg-yellow-100 text-yellow-800' :
                        document.status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {document.status}
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowDocumentModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaSignature />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaDownload />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Progress</h2>
            <div className="space-y-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{inquiry.projectTitle}</h3>
                    <span className="text-sm text-gray-500">{inquiry.progress || 0}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${inquiry.progress || 0}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <p className="font-semibold">${inquiry.estimatedCost?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Actual Cost:</span>
                      <p className="font-semibold">${inquiry.actualCost?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeline:</span>
                      <p className="font-semibold">{inquiry.timeline}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="font-semibold capitalize">{inquiry.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile Update Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Signing Modal */}
      <AnimatePresence>
        {showDocumentModal && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign Document</h2>
              <div className="mb-4">
                <h3 className="font-medium text-gray-900">{selectedDocument.title}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedDocument.type}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Document Preview:</p>
                <div className="bg-white border rounded p-4 h-64 overflow-y-auto">
                  <p className="text-sm text-gray-800">
                    This is a preview of the {selectedDocument.type}. Please review the document carefully before signing.
                    <br /><br />
                    By signing this document, you agree to the terms and conditions outlined within.
                    <br /><br />
                    Document ID: {selectedDocument.id}
                    <br />
                    Created: {new Date(selectedDocument.createdAt).toLocaleDateString()}
                    {selectedDocument.expiresAt && (
                      <>
                        <br />
                        Expires: {new Date(selectedDocument.expiresAt).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="checkbox"
                  id="agree"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  I have read and agree to the terms of this document
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center">
                  <FaSignature className="mr-2" />
                  Sign Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ProtectedRoute>
  );
};

export default ClientDashboard;
