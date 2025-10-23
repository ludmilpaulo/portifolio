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
  FaUser,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaCrown,
  FaShieldAlt
} from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "client" | "moderator";
  status: "active" | "inactive" | "pending";
  avatar: string;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
  permissions: string[];
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate loading users
    const mockUsers: User[] = [
      {
        id: 1,
        name: "Ludmil Paulo",
        email: "ludmil@example.com",
        role: "admin",
        status: "active",
        avatar: "/avatar/lud.jpeg",
        phone: "+1234567890",
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-02-15T10:30:00Z",
        permissions: ["all"]
      },
      {
        id: 2,
        name: "John Client",
        email: "john@client.com",
        role: "client",
        status: "active",
        avatar: "/avatar/john.jpg",
        phone: "+1234567891",
        createdAt: "2024-01-15T00:00:00Z",
        lastLogin: "2024-02-14T15:20:00Z",
        permissions: ["view_projects", "create_inquiry"]
      },
      {
        id: 3,
        name: "Jane Moderator",
        email: "jane@moderator.com",
        role: "moderator",
        status: "active",
        avatar: "/avatar/jane.jpg",
        phone: "+1234567892",
        createdAt: "2024-01-20T00:00:00Z",
        lastLogin: "2024-02-13T09:15:00Z",
        permissions: ["view_projects", "manage_testimonials", "view_analytics"]
      },
      {
        id: 4,
        name: "Bob Pending",
        email: "bob@pending.com",
        role: "client",
        status: "pending",
        avatar: "/avatar/bob.jpg",
        createdAt: "2024-02-10T00:00:00Z",
        permissions: []
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "client":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return FaCrown;
      case "moderator":
        return FaUserShield;
      case "client":
        return FaUser;
      default:
        return FaUser;
    }
  };

  const handleStatusToggle = (id: number) => {
    setUsers(users.map(user =>
      user.id === id
        ? { 
            ...user, 
            status: user.status === "active" ? "inactive" : "active",
            lastLogin: new Date().toISOString()
          }
        : user
    ));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleRoleChange = (id: number, newRole: string) => {
    setUsers(users.map(user =>
      user.id === id
        ? { ...user, role: newRole as "admin" | "client" | "moderator" }
        : user
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage users, roles, and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add User
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
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
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
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {users.filter(u => u.status === "active").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <FaUserCheck className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Clients</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {users.filter(u => u.role === "client").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <FaUser className="text-white text-2xl" />
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
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {users.filter(u => u.status === "pending").length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <FaUserTimes className="text-white text-2xl" />
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="client">Client</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredUsers.map((user, index) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <RoleIcon className="text-gray-400 mr-2" />
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <button
                            onClick={() => handleStatusToggle(user.id)}
                            className="ml-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {user.status === "active" ? (
                              <FaToggleOn className="text-green-500" />
                            ) : (
                              <FaToggleOff className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((permission, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {permission.replace("_", " ")}
                            </span>
                          ))}
                          {user.permissions.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{user.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaUser className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Add Your First User
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UsersPage;
