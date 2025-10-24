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
  FaExternalLinkAlt,
  FaCalendarAlt,
  FaTag,
  FaProjectDiagram,
  FaTasks,
  FaFileContract,
  FaSignature,
  FaUserPlus,
  FaChartLine,
  FaFileAlt,
  FaHandshake,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from "react-icons/fa";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "live" | "upcoming" | "in-progress" | "clone";
  technologies: string[];
  createdAt: string;
  updatedAt: string;
  url?: string;
  githubUrl?: string;
  clientId?: number;
  clientName?: string;
  progress?: number;
  estimatedCost?: number;
  actualCost?: number;
  timeline?: string;
  tasks?: Task[];
  documents?: Document[];
  teamMembers?: TeamMember[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: "client" | "admin" | string;
  dueDate: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
  projectId: number;
}

interface Document {
  id: number;
  title: string;
  type: "contract" | "agreement" | "nda" | "proposal" | "invoice";
  status: "draft" | "pending-signature" | "signed" | "expired";
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  downloadUrl: string;
  signedBy?: string;
  projectId: number;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  projectId: number;
}

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({});
  const [newDocument, setNewDocument] = useState<Partial<Document>>({});
  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({});

  useEffect(() => {
    // Load projects from API
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/graphql?type=projects');
        const result = await response.json();
        if (result.success) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "clone":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(project => project.id !== id));
    }
  };

  const handleAddTask = (projectId: number) => {
    const task: Task = {
      id: Date.now(),
      title: newTask.title || "",
      description: newTask.description || "",
      status: "pending",
      assignedTo: newTask.assignedTo || "client",
      dueDate: newTask.dueDate || "",
      createdAt: new Date().toISOString(),
      priority: newTask.priority || "medium",
      projectId
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, tasks: [...(project.tasks || []), task] }
        : project
    ));

    setNewTask({});
    setShowTaskModal(false);
  };

  const handleAddDocument = (projectId: number) => {
    const document: Document = {
      id: Date.now(),
      title: newDocument.title || "",
      type: newDocument.type || "contract",
      status: "draft",
      createdAt: new Date().toISOString(),
      downloadUrl: newDocument.downloadUrl || "",
      projectId
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, documents: [...(project.documents || []), document] }
        : project
    ));

    setNewDocument({});
    setShowDocumentModal(false);
  };

  const handleAddTeamMember = (projectId: number) => {
    const member: TeamMember = {
      id: Date.now(),
      name: newTeamMember.name || "",
      role: newTeamMember.role || "",
      email: newTeamMember.email || "",
      projectId
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, teamMembers: [...(project.teamMembers || []), member] }
        : project
    ));

    setNewTeamMember({});
    setShowTeamModal(false);
  };

  const handleUpdateTaskStatus = (projectId: number, taskId: number, status: Task["status"]) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? {
            ...project,
            tasks: project.tasks?.map(task => 
              task.id === taskId ? { ...task, status } : task
            )
          }
        : project
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Project
        </motion.button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <option value="live">Live</option>
            <option value="in-progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
            <option value="clone">Clone</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {project.status.replace("-", " ")}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab("overview");
                      }}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"
                      title="Edit Project"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete Project"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {project.clientName && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FaUserPlus className="mr-1" />
                    Client: {project.clientName}
                  </div>
                )}

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                {/* Progress Bar */}
                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-gray-800 font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {project.estimatedCost && (
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-500">Est. Cost</div>
                      <div className="font-semibold">${project.estimatedCost.toLocaleString()}</div>
                    </div>
                  )}
                  {project.timeline && (
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-500">Timeline</div>
                      <div className="font-semibold">{project.timeline}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab("tasks");
                        setShowTaskModal(true);
                      }}
                      className="p-1 text-green-500 hover:bg-green-50 rounded transition-colors"
                      title="Add Task"
                    >
                      <FaTasks />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveTab("documents");
                        setShowDocumentModal(true);
                      }}
                      className="p-1 text-purple-500 hover:bg-purple-50 rounded transition-colors"
                      title="Add Document"
                    >
                      <FaFileContract />
                    </button>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="View Live Site"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaProjectDiagram className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Add Your First Project
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsPage;
