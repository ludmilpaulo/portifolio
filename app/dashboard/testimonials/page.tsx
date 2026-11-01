"use client";
import { useState, useEffect } from "react";
import { baseUrl } from "@/hooks/fetchData";
import { TestimonialAvatar } from "@/components/TestimonialAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaStar, 
  FaSearch,
  FaFilter,
  FaSort,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaBuilding
} from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await fetch(`${baseUrl}testimonials/`);
        if (!response.ok) throw new Error("Could not load testimonials");
        const payload: unknown = await response.json();
        const rows = Array.isArray(payload)
          ? payload
          : payload && typeof payload === "object" && Array.isArray((payload as { results?: unknown }).results)
            ? (payload as { results: unknown[] }).results
            : [];
        const mapped: Testimonial[] = rows.map((row) => {
          const item = row as {
            id?: number;
            name?: string;
            role?: string;
            text?: string;
            avatar?: string | null;
            created_at?: string;
          };
          return {
            id: Number(item.id ?? 0),
            name: item.name || "Client",
            position: item.role || "",
            company: "",
            content: item.text || "",
            rating: 5,
            avatar: item.avatar || "",
            status: "approved",
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: item.created_at || new Date().toISOString(),
          };
        });
        if (!cancelled) {
          setTestimonials(mapped);
          setFilteredTestimonials(mapped);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load testimonials");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let filtered = testimonials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(testimonial => testimonial.status === statusFilter);
    }

    // Filter by rating
    if (ratingFilter !== "all") {
      filtered = filtered.filter(testimonial => testimonial.rating === parseInt(ratingFilter));
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm, statusFilter, ratingFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (id: number, newStatus: "approved" | "rejected") => {
    setTestimonials(testimonials.map(testimonial =>
      testimonial.id === id
        ? { ...testimonial, status: newStatus, updatedAt: new Date().toISOString() }
        : testimonial
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`text-sm ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-1">Manage client testimonials and reviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Testimonial
        </motion.button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading testimonials...</p>}
      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Testimonials</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{testimonials.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <FaUser className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {testimonials.filter(t => t.status === "approved").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FaCheck className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {testimonials.filter(t => t.status === "pending").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <FaCalendarAlt className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <FaStar className="text-white text-2xl" />
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
              placeholder="Search testimonials..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <TestimonialAvatar
                    name={testimonial.name}
                    src={testimonial.avatar}
                    size={48}
                    imageClassName="h-12 w-12 rounded-full object-cover"
                    fallbackClassName="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-lg font-semibold text-white"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testimonial.status)}`}>
                        {testimonial.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <FaBuilding className="text-gray-400 text-sm" />
                      <span className="text-gray-600 text-sm">{testimonial.position} at {testimonial.company}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(testimonial.rating)}
                      </div>
                      <span className="text-gray-500 text-sm">{testimonial.rating}/5</span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
                    
                    <div className="flex items-center text-gray-500 text-sm mt-3">
                      <FaCalendarAlt className="mr-1" />
                      <span>Added {new Date(testimonial.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {testimonial.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(testimonial.id, "approved")}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleStatusChange(testimonial.id, "rejected")}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setEditingTestimonial(testimonial)}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isLoading && !loadError && filteredTestimonials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaUser className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No testimonials yet</h3>
          <p className="text-gray-600 mb-6">Published testimonials from the site will show up here.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Add Your First Testimonial
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TestimonialsPage;
