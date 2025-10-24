"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaFileAlt, 
  FaDollarSign, 
  FaCalendarAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaStar,
  FaCode,
  FaMobile,
  FaDesktop,
  FaShoppingCart,
  FaChartLine,
  FaGamepad,
  FaGraduationCap,
  FaBriefcase
} from "react-icons/fa";

interface ProjectInquiryForm {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  budget: string;
  timeline: string;
  additionalRequirements: string;
}

const ProjectInquiryPage = () => {
  const [formData, setFormData] = useState<ProjectInquiryForm>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectTitle: "",
    projectDescription: "",
    projectType: "",
    budget: "",
    timeline: "",
    additionalRequirements: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<ProjectInquiryForm>>({});

  const projectTypes = [
    { value: "web-development", label: "Web Development", icon: FaDesktop },
    { value: "mobile-app", label: "Mobile App Development", icon: FaMobile },
    { value: "e-commerce", label: "E-commerce Solution", icon: FaShoppingCart },
    { value: "dashboard", label: "Dashboard/Analytics", icon: FaChartLine },
    { value: "game-development", label: "Game Development", icon: FaGamepad },
    { value: "education-platform", label: "Education Platform", icon: FaGraduationCap },
    { value: "business-automation", label: "Business Automation", icon: FaBriefcase },
    { value: "other", label: "Other", icon: FaCode }
  ];

  const budgetRanges = [
    "$1,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000 - $10,000",
    "$10,000 - $20,000",
    "$20,000 - $50,000",
    "$50,000+",
    "Let's discuss"
  ];

  const timelineOptions = [
    "1-2 weeks",
    "1 month",
    "2-3 months",
    "3-6 months",
    "6+ months",
    "Flexible"
  ];

  const validateForm = () => {
    const newErrors: Partial<ProjectInquiryForm> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Name is required";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Email is invalid";
    }

    if (!formData.projectTitle.trim()) {
      newErrors.projectTitle = "Project title is required";
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = "Project description is required";
    }

    if (!formData.projectType) {
      newErrors.projectType = "Project type is required";
    }

    if (!formData.budget) {
      newErrors.budget = "Budget range is required";
    }

    if (!formData.timeline) {
      newErrors.timeline = "Timeline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send data to the backend API
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'create-inquiry',
          data: {
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            clientPhone: formData.clientPhone,
            projectTitle: formData.projectTitle,
            projectDescription: formData.projectDescription,
            projectType: formData.projectType,
            budget: formData.budget,
            timeline: formData.timeline,
            additionalRequirements: formData.additionalRequirements,
            status: 'pending',
            priority: 'medium'
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Project inquiry submitted successfully:", result.data);
        setIsSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProjectInquiryForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FaCheckCircle className="text-white text-2xl" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your project inquiry has been submitted successfully. I&apos;ll get back to you within 24 hours.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  clientName: "",
                  clientEmail: "",
                  clientPhone: "",
                  projectTitle: "",
                  projectDescription: "",
                  projectType: "",
                  budget: "",
                  timeline: "",
                  additionalRequirements: ""
                });
              }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Submit Another Inquiry
            </button>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Back to Portfolio
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h1>
          <p className="text-blue-100 text-lg">
            Tell me about your project and I&apos;ll get back to you with a detailed proposal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaUser className="mr-3 text-blue-500" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange("clientName", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.clientName ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.clientName && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.clientEmail ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.clientEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FaFileAlt className="mr-3 text-blue-500" />
                Project Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.projectTitle ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="e.g., E-commerce Website Development"
                  />
                  {errors.projectTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Project Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {projectTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <label
                          key={type.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                            formData.projectType === type.value
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-300 hover:border-blue-300 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="projectType"
                            value={type.value}
                            checked={formData.projectType === type.value}
                            onChange={(e) => handleInputChange("projectType", e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <Icon className={`text-2xl mx-auto mb-2 ${
                              formData.projectType === type.value ? "text-blue-600" : "text-gray-600"
                            }`} />
                            <span className={`text-sm font-medium ${
                              formData.projectType === type.value ? "text-blue-700" : "text-gray-700"
                            }`}>
                              {type.label}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.projectType && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.projectType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                    rows={5}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.projectDescription ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="Describe your project in detail. What features do you need? What&apos;s your vision?"
                  />
                  {errors.projectDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Budget Range *
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => handleInputChange("budget", e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.budget ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <option value="" className="text-gray-500">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range} className="text-gray-900">
                          {range}
                        </option>
                      ))}
                    </select>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.budget}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Timeline *
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => handleInputChange("timeline", e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.timeline ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <option value="" className="text-gray-500">Select timeline</option>
                      {timelineOptions.map((timeline) => (
                        <option key={timeline} value={timeline} className="text-gray-900">
                          {timeline}
                        </option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.timeline}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange("additionalRequirements", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:border-gray-400"
                    placeholder="Any specific technologies, integrations, or special requirements?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting Inquiry...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaPaperPlane className="mr-2" />
                  Submit Project Inquiry
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectInquiryPage;
