"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useCurrency } from "@/hooks/useCurrency";
import dynamic from "next/dynamic";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter,
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
  FaComments,
  FaPaperPlane,
  FaTimes,
  FaTasks,
  FaFileInvoice,
  FaFileContract,
  FaUpload,
  FaFileWord
} from "react-icons/fa";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface ProjectInquiry {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectTitle: string;
  projectDescription: string;
  projectType?: string;
  budget: string;
  timeline: string;
  additionalRequirements?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedCost?: number;
  actualCost?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: number;
    sender: "client" | "admin";
    message: string;
    timestamp: string;
  }>;
  tasks?: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
  }>;
  invoices?: Array<{
    id: number;
    invoiceNumber: string;
    amount: number;
    status: string;
    dueDate: string;
    description?: string;
    createdAt?: string;
  }>;
  documents?: Array<{
    id: number;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    downloadUrl?: string;
    adminSignedAt?: string | null;
    adminSignedBy?: string | null;
    clientSignedAt?: string | null;
    clientSignedBy?: string | null;
  }>;
}

const InquiriesPage = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const { format: formatAmount } = useCurrency();
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<ProjectInquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ProjectInquiry | null>(null);
  const [editingInquiry, setEditingInquiry] = useState<ProjectInquiry | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningDocument, setIsSigningDocument] = useState(false);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [isUpdatingInvoiceStatus, setIsUpdatingInvoiceStatus] = useState(false);
  const [showDocumentEditor, setShowDocumentEditor] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [docForm, setDocForm] = useState({
    title: "",
    type: "nda",
    downloadUrl: "",
    content: "",
    file: null as File | null,
  });
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: "",
    amount: "",
    dueDate: "",
    description: "",
    items: [{ description: "", quantity: 1, price: "" }],
  });
  const [inquiryForm, setInquiryForm] = useState<{
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    projectTitle: string;
    projectDescription: string;
    projectType: string;
    budget: string;
    timeline: string;
    additionalRequirements: string;
    status: ProjectInquiry["status"];
    priority: ProjectInquiry["priority"];
    estimatedCost: string;
    actualCost: string;
    progress: number;
  }>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectTitle: "",
    projectDescription: "",
    projectType: "web-development",
    budget: "",
    timeline: "",
    additionalRequirements: "",
    status: "pending",
    priority: "medium",
    estimatedCost: "",
    actualCost: "",
    progress: 0
  });

  useEffect(() => {
    loadInquiries();
  }, []);

  useEffect(() => {
    let filtered = inquiries;

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(inquiry => inquiry.priority === priorityFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchTerm, statusFilter, priorityFilter]);

  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/graphql?type=inquiries');
      const result = await response.json();
      if (result.success) {
        const data = result.data || [];
        setInquiries(data);
        return data as ProjectInquiry[];
      }
      return [] as ProjectInquiry[];
    } catch (error) {
      console.error('Error loading inquiries:', error);
      return [] as ProjectInquiry[];
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = async (inquiryId: number) => {
    if (!docForm.title.trim()) {
      alert("Document title is required");
      return;
    }
    if (!docForm.file && !docForm.content.trim() && !docForm.downloadUrl.trim()) {
      alert("Please provide either file upload, content, or download URL");
      return;
    }

    setIsAddingDocument(true);
    try {
      // If file is uploaded, use FormData; otherwise use JSON
      if (docForm.file) {
        const formData = new FormData();
        formData.append("type", "add-document");
        formData.append("inquiryId", inquiryId.toString());
        formData.append("title", docForm.title);
        formData.append("type", docForm.type);
        formData.append("content", docForm.content || "");
        formData.append("status", "pending-admin-signature");
        if (docForm.downloadUrl) {
          formData.append("downloadUrl", docForm.downloadUrl);
        }
        formData.append("file", docForm.file);

        const res = await fetch("/api/graphql", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to add document");

        const data = await loadInquiries();
        setSelectedInquiry(data.find((i) => i.id === inquiryId) || null);
        setDocForm({ title: "", type: "nda", downloadUrl: "", content: "", file: null });
        setShowDocumentEditor(false);
        alert("Document created. Admin must sign before client can sign.");
      } else {
        // Use JSON for text-only documents
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "add-document",
            data: {
              inquiryId,
              title: docForm.title,
              type: docForm.type,
              downloadUrl: docForm.downloadUrl,
              content: docForm.content || "",
              status: "pending-admin-signature",
            },
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to add document");

        const data = await loadInquiries();
        setSelectedInquiry(data.find((i) => i.id === inquiryId) || null);
        setDocForm({ title: "", type: "nda", downloadUrl: "", content: "", file: null });
        setShowDocumentEditor(false);
        alert("Document created. Admin must sign before client can sign.");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to add document");
    } finally {
      setIsAddingDocument(false);
    }
  };

  const handleAdminSignDocument = async (inquiryId: number, documentId: number) => {
    setIsSigningDocument(true);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "sign-document",
          data: {
            documentId,
            signerRole: "admin",
            signedBy: user?.email || user?.username || "admin",
          },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to sign document");

      const data = await loadInquiries();
      setSelectedInquiry(data.find((i) => i.id === inquiryId) || null);
      alert("Signed as admin. Client has been notified to sign.");
    } catch (e: any) {
      alert(e?.message || "Failed to sign document");
    } finally {
      setIsSigningDocument(false);
    }
  };

  const handleCreateInvoice = async (inquiryId: number) => {
    if (!invoiceForm.invoiceNumber.trim() || !invoiceForm.amount.trim()) {
      alert("Invoice number and amount are required");
      return;
    }

    setIsCreatingInvoice(true);
    try {
      const items = invoiceForm.items
        .filter((item) => item.description.trim() && item.price.trim())
        .map((item) => ({
          description: item.description,
          quantity: parseInt(String(item.quantity)) || 1,
          price: parseFloat(String(item.price)) || 0,
        }));

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "create-invoice",
          data: {
            inquiryId,
            invoiceNumber: invoiceForm.invoiceNumber,
            amount: parseFloat(invoiceForm.amount),
            dueDate: invoiceForm.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            description: invoiceForm.description,
            items: items,
            status: "sent",
          },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to create invoice");

      const data = await loadInquiries();
      setSelectedInquiry(data.find((i) => i.id === inquiryId) || null);
      setInvoiceForm({
        invoiceNumber: "",
        amount: "",
        dueDate: "",
        description: "",
        items: [{ description: "", quantity: 1, price: "" }],
      });
      alert("Invoice created and sent to client. Client has been notified via email.");
    } catch (e: any) {
      alert(e?.message || "Failed to create invoice");
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleUpdateInvoiceStatus = async (inquiryId: number, invoiceId: number, newStatus: string) => {
    setIsUpdatingInvoiceStatus(true);
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "update-invoice-status",
          data: {
            id: invoiceId,
            status: newStatus,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to update invoice status");

      const data = await loadInquiries();
      setSelectedInquiry(data.find((i) => i.id === inquiryId) || null);
      alert(`Invoice status updated to ${newStatus}`);
    } catch (e: any) {
      alert(e?.message || "Failed to update invoice status");
    } finally {
      setIsUpdatingInvoiceStatus(false);
    }
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'delete-inquiry', data: { id } }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Delete failed');
      setInquiries(prev => prev.filter(i => i.id !== id));
    } catch (error: any) {
      alert(`Failed to delete inquiry: ${error?.message || error}`);
    }
  };

  const openEditModal = (inquiry: ProjectInquiry) => {
    setFormError(null);
    setEditingInquiry(inquiry);
    setInquiryForm({
      clientName: inquiry.clientName || "",
      clientEmail: inquiry.clientEmail || "",
      clientPhone: inquiry.clientPhone || "",
      projectTitle: inquiry.projectTitle || "",
      projectDescription: inquiry.projectDescription || "",
      projectType: inquiry.projectType || "web-development",
      budget: inquiry.budget || "",
      timeline: inquiry.timeline || "",
      additionalRequirements: inquiry.additionalRequirements || "",
      status: inquiry.status,
      priority: inquiry.priority,
      estimatedCost: inquiry.estimatedCost?.toString() || "",
      actualCost: inquiry.actualCost?.toString() || "",
      progress: inquiry.progress || 0
    });
    setShowModal(true);
  };

  const handleSaveInquiry = async () => {
    setFormError(null);
    if (!inquiryForm.projectTitle.trim()) return setFormError("Project title is required");
    if (!inquiryForm.clientEmail.trim()) return setFormError("Client email is required");

    setIsSaving(true);
    try {
      const data: any = {
        id: editingInquiry?.id,
        clientName: inquiryForm.clientName,
        clientEmail: inquiryForm.clientEmail,
        clientPhone: inquiryForm.clientPhone,
        projectTitle: inquiryForm.projectTitle,
        projectDescription: inquiryForm.projectDescription,
        projectType: inquiryForm.projectType,
        budget: inquiryForm.budget,
        timeline: inquiryForm.timeline,
        additionalRequirements: inquiryForm.additionalRequirements,
        status: inquiryForm.status,
        priority: inquiryForm.priority,
      };
      if (inquiryForm.estimatedCost) data.estimatedCost = parseFloat(inquiryForm.estimatedCost);
      if (inquiryForm.actualCost) data.actualCost = parseFloat(inquiryForm.actualCost);
      if (inquiryForm.progress !== undefined) data.progress = inquiryForm.progress;

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'update-inquiry', data }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Save failed');

      await loadInquiries();
      setShowModal(false);
      setEditingInquiry(null);
    } catch (error: any) {
      setFormError(error?.message || String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async (inquiryId: number) => {
    if (!newMessage.trim()) return;
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'add-message',
          data: {
            inquiryId,
            message: newMessage,
            sender: 'admin'
          }
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to send message');
      await loadInquiries();
      if (selectedInquiry) {
        const updated = inquiries.find(i => i.id === inquiryId);
        if (updated) setSelectedInquiry(updated);
      }
      setNewMessage("");
    } catch (error: any) {
      alert(`Failed to send message: ${error?.message || error}`);
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">{t('inquiries.title')}</h1>
          <p className="text-gray-600 mt-1">{t('inquiries.subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search') + '...'}
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
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredInquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                    {inquiry.clientPhone && (
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2" />
                        <span>{inquiry.clientPhone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <FaDollarSign className="mr-2" />
                      <span>{inquiry.budget}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>{inquiry.timeline}</span>
                    </div>
                    {inquiry.progress !== undefined && (
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        <span>{inquiry.progress}% Complete</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{inquiry.projectDescription}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FaComments className="mr-1" />
                      <span>{inquiry.messages?.length || 0} messages</span>
                      <span className="mx-2">•</span>
                      <FaTasks className="mr-1" />
                      <span>{inquiry.tasks?.length || 0} tasks</span>
                      <span className="mx-2">•</span>
                      <FaFileInvoice className="mr-1" />
                      <span>{inquiry.invoices?.length || 0} invoices</span>
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
                      <button
                        onClick={() => openEditModal(inquiry)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Edit Inquiry"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Inquiry"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredInquiries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg"
        >
          <FaFileAlt className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
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
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    {selectedInquiry.clientPhone && (
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <span className="ml-2 text-gray-600">{selectedInquiry.clientPhone}</span>
                      </div>
                    )}
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
                    <div>
                      <span className="font-medium text-gray-700">Priority:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedInquiry.priority)}`}>
                        {selectedInquiry.priority}
                      </span>
                    </div>
                    {selectedInquiry.estimatedCost && (
                      <div>
                        <span className="font-medium text-gray-700">Estimated Cost:</span>
                        <span className="ml-2 text-gray-600">${selectedInquiry.estimatedCost.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedInquiry.actualCost && (
                      <div>
                        <span className="font-medium text-gray-700">Actual Cost:</span>
                        <span className="ml-2 text-gray-600">${selectedInquiry.actualCost.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedInquiry.progress !== undefined && (
                      <div>
                        <span className="font-medium text-gray-700">Progress:</span>
                        <span className="ml-2 text-gray-600">{selectedInquiry.progress}%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Description:</h4>
                    <p className="text-gray-600">{selectedInquiry.projectDescription}</p>
                  </div>
                  {selectedInquiry.additionalRequirements && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Additional Requirements:</h4>
                      <p className="text-gray-600">{selectedInquiry.additionalRequirements}</p>
                    </div>
                  )}

                  {/* Documents (NDA / Contracts) */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">Documents (NDA / Contracts)</h4>

                    <div className="space-y-3">
                      {(selectedInquiry.documents || []).length === 0 && (
                        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          No documents yet.
                        </div>
                      )}

                      {(selectedInquiry.documents || []).map((doc) => (
                        <div key={doc.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{doc.title}</div>
                              <div className="text-xs text-gray-600 capitalize">{doc.type}</div>
                              <div className="mt-1">
                                <span className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-700">
                                  {String(doc.status || "").replace(/-/g, " ")}
                                </span>
                              </div>
                              {doc.adminSignedAt && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Admin signed: {new Date(doc.adminSignedAt).toLocaleString()} ({doc.adminSignedBy || "admin"})
                                </div>
                              )}
                              {doc.clientSignedAt && (
                                <div className="text-xs text-gray-600 mt-1">
                                  Client signed: {new Date(doc.clientSignedAt).toLocaleString()} ({doc.clientSignedBy || "client"})
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {doc.downloadUrl && (
                                <a
                                  href={doc.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                  View
                                </a>
                              )}
                              <button
                                onClick={() => handleAdminSignDocument(selectedInquiry.id, doc.id)}
                                disabled={
                                  isSigningDocument ||
                                  doc.status === "signed" ||
                                  doc.status === "pending-client-signature"
                                }
                                className="px-3 py-1.5 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                title="Admin signs first, then client signs"
                              >
                                {isSigningDocument ? "Signing..." : "Sign as Admin"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-3">Create document (then sign as admin)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          value={docForm.title}
                          onChange={(e) => setDocForm((p) => ({ ...p, title: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Document title (e.g., NDA)"
                        />
                        <select
                          value={docForm.type}
                          onChange={(e) => setDocForm((p) => ({ ...p, type: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="nda">NDA</option>
                          <option value="contract">Contract</option>
                          <option value="agreement">Agreement</option>
                          <option value="proposal">Proposal</option>
                          <option value="other">Other</option>
                        </select>
                        <input
                          value={docForm.downloadUrl}
                          onChange={(e) => setDocForm((p) => ({ ...p, downloadUrl: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          placeholder="Document URL (Drive/Dropbox/etc)"
                        />
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleAddDocument(selectedInquiry.id)}
                          disabled={isAddingDocument}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isAddingDocument ? "Creating..." : "Create Document"}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        After you click “Sign as Admin”, the backend will email the client to sign.
                      </div>
                    </div>
                  </div>

                  {/* Invoices */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">Invoices</h4>

                    <div className="space-y-3">
                      {(selectedInquiry.invoices || []).length === 0 && (
                        <div className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          No invoices yet.
                        </div>
                      )}

                      {(selectedInquiry.invoices || []).map((inv) => (
                        <div key={inv.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-gray-900">{inv.invoiceNumber}</div>
                              <div className="text-xs text-gray-600 mt-1">
                                Amount: {formatAmount(inv.amount || 0)}
                              </div>
                              <div className="text-xs text-gray-600">
                                Due: {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A"}
                              </div>
                              <div className="mt-1">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    inv.status === "paid"
                                      ? "bg-green-100 text-green-800"
                                      : inv.status === "overdue"
                                        ? "bg-red-100 text-red-800"
                                        : inv.status === "sent"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {inv.status}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={inv.status}
                                onChange={(e) =>
                                  handleUpdateInvoiceStatus(selectedInquiry.id, inv.id, e.target.value)
                                }
                                disabled={isUpdatingInvoiceStatus}
                                className="text-xs px-2 py-1 border border-gray-300 rounded-lg"
                              >
                                <option value="sent">Sent</option>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Create invoice form */}
                    <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900 mb-3">Create and send invoice to client</div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            value={invoiceForm.invoiceNumber}
                            onChange={(e) => setInvoiceForm((p) => ({ ...p, invoiceNumber: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Invoice Number (e.g., INV-001)"
                          />
                          <input
                            type="number"
                            step="0.01"
                            value={invoiceForm.amount}
                            onChange={(e) => setInvoiceForm((p) => ({ ...p, amount: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Amount ($)"
                          />
                        </div>
                        <input
                          type="date"
                          value={invoiceForm.dueDate}
                          onChange={(e) => setInvoiceForm((p) => ({ ...p, dueDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Due Date"
                        />
                        <textarea
                          value={invoiceForm.description}
                          onChange={(e) => setInvoiceForm((p) => ({ ...p, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          rows={2}
                          placeholder="Invoice description"
                        />
                      </div>
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleCreateInvoice(selectedInquiry.id)}
                          disabled={isCreatingInvoice}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {isCreatingInvoice ? "Creating..." : "Create & Send Invoice"}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Client will receive an email notification when invoice is created.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages</h3>
                  <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                    {selectedInquiry.messages?.map((message) => (
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
                            {message.sender === "admin" ? "Admin" : "Client"}
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

      {/* Edit Inquiry Modal */}
      <AnimatePresence>
        {showModal && editingInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowModal(false);
              setEditingInquiry(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit Inquiry</h2>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInquiry(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 mb-4">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title *</label>
                  <input
                    value={inquiryForm.projectTitle}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, projectTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    value={inquiryForm.clientName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Client name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Email *</label>
                  <input
                    type="email"
                    value={inquiryForm.clientEmail}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
                  <input
                    type="tel"
                    value={inquiryForm.clientPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={inquiryForm.status}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={inquiryForm.priority}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                  <textarea
                    value={inquiryForm.projectDescription}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, projectDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                    placeholder="Project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input
                    value={inquiryForm.budget}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., $5,000 - $10,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input
                    value={inquiryForm.timeline}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, timeline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 3-6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    value={inquiryForm.estimatedCost}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost</label>
                  <input
                    type="number"
                    value={inquiryForm.actualCost}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, actualCost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inquiryForm.progress}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requirements</label>
                  <textarea
                    value={inquiryForm.additionalRequirements}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, additionalRequirements: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Additional requirements or notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setShowModal(false);
                    setEditingInquiry(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSaveInquiry}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Document Editor Modal */}
        <AnimatePresence>
          {showDocumentEditor && selectedInquiry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDocumentEditor(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Create Document</h2>
                  <button
                    onClick={() => {
                      setShowDocumentEditor(false);
                      setDocForm({ title: "", type: "nda", downloadUrl: "", content: "", file: null });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Document Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Title *
                      </label>
                      <input
                        type="text"
                        value={docForm.title}
                        onChange={(e) => setDocForm((p) => ({ ...p, title: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Non-Disclosure Agreement"
                      />
                    </div>

                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type *
                      </label>
                      <select
                        value={docForm.type}
                        onChange={(e) => setDocForm((p) => ({ ...p, type: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="nda">NDA</option>
                        <option value="contract">Contract</option>
                        <option value="agreement">Agreement</option>
                        <option value="proposal">Proposal</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* File Upload Option */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document File (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setDocForm((p) => ({ ...p, file }));
                          }}
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaUpload className="text-4xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            {docForm.file ? docForm.file.name : "Click to upload or drag and drop"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX, TXT (Max 10MB)
                          </span>
                        </label>
                        {docForm.file && (
                          <button
                            onClick={() => setDocForm((p) => ({ ...p, file: null }))}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Remove file
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Content {docForm.file ? "(Optional - will use uploaded file)" : "*"}
                      </label>
                      {typeof window !== "undefined" && (
                        <ReactQuill
                          theme="snow"
                          value={docForm.content}
                          onChange={(value) => setDocForm((p) => ({ ...p, content: value }))}
                          className="bg-white"
                          style={{ height: "300px", marginBottom: "50px" }}
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, 3, false] }],
                              ["bold", "italic", "underline", "strike"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              [{ indent: "-1" }, { indent: "+1" }],
                              [{ align: [] }],
                              ["link", "image"],
                              [{ color: [] }, { background: [] }],
                              ["clean"],
                            ],
                          }}
                        />
                      )}
                    </div>

                    {/* External URL (Alternative) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        External Document URL (Optional)
                      </label>
                      <input
                        type="url"
                        value={docForm.downloadUrl}
                        onChange={(e) => setDocForm((p) => ({ ...p, downloadUrl: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://drive.google.com/..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use this if the document is hosted elsewhere (Google Drive, Dropbox, etc.)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      setShowDocumentEditor(false);
                      setDocForm({ title: "", type: "nda", downloadUrl: "", content: "", file: null });
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddDocument(selectedInquiry.id)}
                    disabled={isAddingDocument || !docForm.title.trim()}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAddingDocument ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaFileAlt />
                        Create Document
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
};

export default InquiriesPage;
