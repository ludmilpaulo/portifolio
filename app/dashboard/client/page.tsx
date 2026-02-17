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
  FaTimes,
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
import { useI18n } from "@/contexts/I18nContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCurrency } from "@/hooks/useCurrency";

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
  status:
    | "draft"
    | "pending-signature"
    | "pending-admin-signature"
    | "pending-client-signature"
    | "signed"
    | "expired";
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  downloadUrl: string;
  signedBy?: string;
}

const ClientDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const { format: formatAmount, symbol: currencySymbol } = useCurrency();
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
  const [newInquiryForm, setNewInquiryForm] = useState({
    projectTitle: "",
    projectDescription: "",
    projectType: "web-development",
    budget: "",
    timeline: "",
    additionalRequirements: ""
  });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    company: user?.company || ""
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isSigningDocument, setIsSigningDocument] = useState(false);

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
      // Update profile form when user loads
      setProfileForm({
        firstName: user?.first_name || "",
        lastName: user?.last_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        company: user?.company || ""
      });
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
      const response = await fetch('/api/graphql', {
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
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
      // Reload inquiries to get updated data
      const loadResponse = await fetch('/api/graphql?type=inquiries', {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      const loadResult = await loadResponse.json();
      if (loadResult.success) {
        const clientInquiries = loadResult.data.filter((inquiry: ProjectInquiry) => 
          inquiry.clientEmail.toLowerCase() === user?.email?.toLowerCase()
        );
        setInquiries(clientInquiries);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update on error
      setInquiries(inquiries);
      alert('Failed to send message. Please try again.');
    }

    setNewMessage("");
  };

  const handleCreateInquiry = async () => {
    if (!newInquiryForm.projectTitle.trim() || !newInquiryForm.projectDescription.trim()) {
      alert('Please fill in project title and description');
      return;
    }

    setIsSubmittingInquiry(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          type: 'create-inquiry',
          data: {
            clientName: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || '',
            clientEmail: user?.email || '',
            clientPhone: user?.phone || '',
            projectTitle: newInquiryForm.projectTitle,
            projectDescription: newInquiryForm.projectDescription,
            projectType: newInquiryForm.projectType,
            budget: newInquiryForm.budget,
            timeline: newInquiryForm.timeline,
            additionalRequirements: newInquiryForm.additionalRequirements
          }
        })
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to create inquiry');
      }
      // Reload inquiries
      const loadResponse = await fetch('/api/graphql?type=inquiries', {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      const loadResult = await loadResponse.json();
      if (loadResult.success) {
        const clientInquiries = loadResult.data.filter((inquiry: ProjectInquiry) => 
          inquiry.clientEmail.toLowerCase() === user?.email?.toLowerCase()
        );
        setInquiries(clientInquiries);
      }
      setShowModal(false);
      setNewInquiryForm({
        projectTitle: "",
        projectDescription: "",
        projectType: "web-development",
        budget: "",
        timeline: "",
        additionalRequirements: ""
      });
      alert('Inquiry created successfully!');
    } catch (error: any) {
      console.error('Error creating inquiry:', error);
      alert(`Failed to create inquiry: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleSignDocument = async () => {
    if (!selectedDocument) return;
    const agreeCheckbox = document.getElementById('agree') as HTMLInputElement;
    if (!agreeCheckbox?.checked) {
      alert('Please confirm that you have read and agree to the terms');
      return;
    }

    setIsSigningDocument(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          type: 'sign-document',
          data: {
            documentId: selectedDocument.id,
            signerRole: 'client',
            signedBy: user?.email || user?.username || 'Client'
          }
        })
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to sign document');
      }
      // Reload inquiries to get updated document status
      const loadResponse = await fetch('/api/graphql?type=inquiries', {
        headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
      });
      const loadResult = await loadResponse.json();
      if (loadResult.success) {
        const clientInquiries = loadResult.data.filter((inquiry: ProjectInquiry) => 
          inquiry.clientEmail.toLowerCase() === user?.email?.toLowerCase()
        );
        setInquiries(clientInquiries);
      }
      setShowDocumentModal(false);
      setSelectedDocument(null);
      alert('Document signed successfully!');
    } catch (error: any) {
      console.error('Error signing document:', error);
      alert(`Failed to sign document: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSigningDocument(false);
    }
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.downloadUrl) {
      window.open(document.downloadUrl, '_blank');
    } else {
      alert('Download URL not available');
    }
  };

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // Generate and download invoice as PDF
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const inquiry = inquiries.find(i => i.invoices?.some(inv => inv.id === invoice.id));
    // Get translations for invoice PDF
    const invoiceTitle = t('invoices.title');
    const invoiceNumberLabel = t('invoices.invoiceNumber');
    const billTo = t('invoices.billTo');
    const invoiceDetails = t('invoices.invoiceDetails');
    const dateLabel = t('invoices.date');
    const dueDateLabel = t('invoices.dueDate');
    const statusLabel = t('invoices.status');
    const descriptionLabel = t('invoices.description');
    const quantityLabel = t('invoices.quantity');
    const priceLabel = t('invoices.price');
    const totalLabel = t('invoices.total');
    const subtotalLabel = t('invoices.subtotal');
    const totalAmountLabel = t('invoices.totalAmount');
    const thankYou = t('invoices.thankYou');
    const automatedInvoice = t('invoices.automatedInvoice');
    const invoiceStatus = t(`invoices.${invoice.status}`);
    
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              color: #333;
            }
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: 32px;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-section {
              flex: 1;
            }
            .info-section h3 {
              margin-top: 0;
              color: #666;
              font-size: 14px;
              text-transform: uppercase;
            }
            .info-section p {
              margin: 5px 0;
              font-size: 16px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            .items-table th {
              background-color: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-weight: bold;
              border-bottom: 2px solid #e5e7eb;
            }
            .items-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .total-section {
              margin-top: 30px;
              text-align: right;
            }
            .total-row {
              display: flex;
              justify-content: flex-end;
              margin: 10px 0;
            }
            .total-label {
              width: 150px;
              font-weight: bold;
              text-align: right;
              padding-right: 20px;
            }
            .total-amount {
              width: 150px;
              text-align: right;
              font-size: 18px;
            }
            .grand-total {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-sent { background-color: #dbeafe; color: #1e40af; }
            .status-paid { background-color: #d1fae5; color: #065f46; }
            .status-overdue { background-color: #fee2e2; color: #991b1b; }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <p style="color: #666; margin-top: 5px;">Invoice #${invoice.invoiceNumber}</p>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>${billTo}</h3>
              <p><strong>${inquiry?.clientName || 'Client'}</strong></p>
              <p>${inquiry?.clientEmail || ''}</p>
              ${inquiry?.clientPhone ? `<p>${inquiry.clientPhone}</p>` : ''}
            </div>
            <div class="info-section" style="text-align: right;">
              <h3>${invoiceDetails}</h3>
              <p><strong>${dateLabel}:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
              <p><strong>${dueDateLabel}:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>${statusLabel}:</strong> <span class="status-badge status-${invoice.status}">${invoiceStatus}</span></p>
            </div>
          </div>

          ${invoice.description ? `<div style="margin-bottom: 20px;"><strong>${descriptionLabel}:</strong> ${invoice.description}</div>` : ''}

          ${invoice.items && invoice.items.length > 0 ? `
            <table class="items-table">
              <thead>
                <tr>
                  <th>${descriptionLabel}</th>
                  <th style="text-align: center;">${quantityLabel}</th>
                  <th style="text-align: right;">${priceLabel}</th>
                  <th style="text-align: right;">${totalLabel}</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map((item: any) => `
                  <tr>
                    <td>${item.description}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">${formatAmount(item.price)}</td>
                    <td style="text-align: right;">${formatAmount(item.quantity * item.price)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          <div class="total-section">
            <div class="total-row">
              <div class="total-label">${subtotalLabel}:</div>
              <div class="total-amount">${formatAmount(invoice.amount)}</div>
            </div>
            <div class="total-row grand-total">
              <div class="total-label">${totalAmountLabel}:</div>
              <div class="total-amount">${formatAmount(invoice.amount)}</div>
            </div>
          </div>

          <div class="footer">
            <p>${thankYou}</p>
            <p>${automatedInvoice}</p>
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHtml);
    invoiceWindow.document.close();
    
    // Wait for content to load, then print/download
    setTimeout(() => {
      invoiceWindow.print();
    }, 250);
  };


  return (
    <ProtectedRoute requiredUserType="client">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.clientDashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('dashboard.manageProjects')}</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProfileModal(true)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center"
          >
            <FaUserEdit className="mr-2" />
            {t('dashboard.profile')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            {t('dashboard.logout')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            {t('dashboard.newInquiry')}
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
        <div className="flex space-x-1">
          {[
            { id: "projects", label: t('dashboard.projects'), icon: FaFileAlt },
            { id: "tasks", label: t('dashboard.tasks'), icon: FaTasks },
            { id: "invoices", label: t('dashboard.invoices'), icon: FaFileInvoice },
            { id: "documents", label: t('dashboard.documents'), icon: FaFileContract },
            { id: "progress", label: t('dashboard.progress'), icon: FaChartLine }
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('invoices.title')}</h2>
            {inquiries.flatMap(inquiry => inquiry.invoices || []).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <FaFileInvoice className="text-gray-400 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('invoices.noInvoices')}</h3>
                <p className="text-gray-600">{t('invoices.noInvoicesDesc')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.flatMap(inquiry => inquiry.invoices || []).map((invoice) => (
                  <div key={invoice.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {t(`invoices.${invoice.status}`)}
                          </span>
                        </div>
                        {invoice.description && (
                          <p className="text-gray-600 text-sm mb-3">{invoice.description}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <span className="text-xs text-gray-500">{t('invoices.amount')}</span>
                            <p className="text-lg font-bold text-gray-900">{formatAmount(invoice.amount)}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">{t('invoices.dueDate')}</span>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {invoice.createdAt && (
                            <div>
                              <span className="text-xs text-gray-500">{t('invoices.created')}</span>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(invoice.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                          title={t('invoices.viewInvoice')}
                        >
                          <FaEye />
                          {t('common.view')}
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                          title={t('invoices.downloadPDF')}
                        >
                          <FaDownload />
                          {t('common.download')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                        title="Sign Document"
                      >
                        <FaSignature />
                      </button>
                      <button
                        onClick={() => handleDownloadDocument(document)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Download Document"
                      >
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isUpdatingProfile}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    setIsUpdatingProfile(true);
                    try {
                      // Note: Profile update endpoint may not exist yet
                      alert('Profile update functionality will be implemented when backend endpoint is available');
                      setShowProfileModal(false);
                    } catch (error) {
                      alert('Failed to update profile');
                    } finally {
                      setIsUpdatingProfile(false);
                    }
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Inquiry Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Project Inquiry</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    value={newInquiryForm.projectTitle}
                    onChange={(e) => setNewInquiryForm({ ...newInquiryForm, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                  <select
                    value={newInquiryForm.projectType}
                    onChange={(e) => setNewInquiryForm({ ...newInquiryForm, projectType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="dashboard">Dashboard/Analytics</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description *</label>
                  <textarea
                    value={newInquiryForm.projectDescription}
                    onChange={(e) => setNewInquiryForm({ ...newInquiryForm, projectDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your project requirements..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                    <input
                      type="text"
                      value={newInquiryForm.budget}
                      onChange={(e) => setNewInquiryForm({ ...newInquiryForm, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., $5,000 - $10,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <input
                      type="text"
                      value={newInquiryForm.timeline}
                      onChange={(e) => setNewInquiryForm({ ...newInquiryForm, timeline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 3-6 months"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                  <textarea
                    value={newInquiryForm.additionalRequirements}
                    onChange={(e) => setNewInquiryForm({ ...newInquiryForm, additionalRequirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any additional requirements or notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNewInquiryForm({
                      projectTitle: "",
                      projectDescription: "",
                      projectType: "web-development",
                      budget: "",
                      timeline: "",
                      additionalRequirements: ""
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSubmittingInquiry}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateInquiry}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  disabled={isSubmittingInquiry}
                >
                  {isSubmittingInquiry ? 'Creating...' : 'Create Inquiry'}
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
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedDocument(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isSigningDocument}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignDocument}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center disabled:opacity-50"
                  disabled={
                    isSigningDocument ||
                    selectedDocument?.status === 'signed' ||
                    selectedDocument?.status === 'pending-admin-signature' ||
                    selectedDocument?.status === 'draft'
                  }
                >
                  <FaSignature className="mr-2" />
                  {isSigningDocument
                    ? 'Signing...'
                    : selectedDocument?.status === 'signed'
                      ? 'Already Signed'
                      : selectedDocument?.status === 'pending-admin-signature' || selectedDocument?.status === 'draft'
                        ? 'Waiting for admin'
                        : 'Sign Document'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice View Modal */}
      <AnimatePresence>
        {showInvoiceModal && selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInvoiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                <div>
                  <h2 className="text-2xl font-bold text-white">{t('invoices.invoiceDetails')}</h2>
                  <p className="text-blue-100 mt-1">{t('invoices.invoiceNumber')} #{selectedInvoice.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {(() => {
                  const inquiry = inquiries.find(i => i.invoices?.some(inv => inv.id === selectedInvoice.id));
                  return (
                    <div className="space-y-6">
                      {/* Invoice Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t('invoices.billTo')}</h3>
                          <p className="font-semibold text-gray-900">{inquiry?.clientName || 'Client'}</p>
                          <p className="text-gray-600 text-sm mt-1">{inquiry?.clientEmail || ''}</p>
                          {inquiry?.clientPhone && (
                            <p className="text-gray-600 text-sm">{inquiry.clientPhone}</p>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t('invoices.invoiceDetails')}</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('invoices.date')}:</span>
                              <span className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t('invoices.dueDate')}:</span>
                              <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">{t('invoices.status')}:</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                selectedInvoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                selectedInvoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                selectedInvoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {t(`invoices.${selectedInvoice.status}`)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {selectedInvoice.description && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">{t('invoices.description')}</h3>
                          <p className="text-gray-700">{selectedInvoice.description}</p>
                        </div>
                      )}

                      {/* Invoice Items */}
                      {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">{t('invoices.items')}</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-b">{t('invoices.description')}</th>
                                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase border-b">{t('invoices.quantity')}</th>
                                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase border-b">{t('invoices.price')}</th>
                                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase border-b">{t('invoices.total')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedInvoice.items.map((item: any, index: number) => (
                                  <tr key={index} className="border-b">
                                    <td className="px-4 py-3 text-gray-900">{item.description}</td>
                                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{formatAmount(item.price)}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900">{formatAmount(item.quantity * item.price)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-end">
                          <div className="w-64">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">{t('invoices.subtotal')}:</span>
                              <span className="font-medium text-gray-900">{formatAmount(selectedInvoice.amount)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                              <span className="text-lg font-semibold text-gray-900">{t('invoices.totalAmount')}:</span>
                              <span className="text-2xl font-bold text-blue-600">{formatAmount(selectedInvoice.amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('common.close')}
                </button>
                <button
                  onClick={() => {
                    handleDownloadInvoice(selectedInvoice);
                  }}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaDownload />
                  {t('invoices.downloadPDF')}
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
