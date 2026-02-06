"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUpload, 
  FaImage, 
  FaVideo, 
  FaFilePdf, 
  FaTrash, 
  FaDownload, 
  FaEye, 
  FaEdit,
  FaSearch,
  FaFilter,
  FaFolder,
  FaFolderOpen,
  FaSort,
  FaThLarge,
  FaList
} from "react-icons/fa";

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: string;
  category: string;
}

const MediaPage = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<MediaFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    // Simulate loading media files
    const mockFiles: MediaFile[] = [
      {
        id: "1",
        name: "portfolio-hero.jpg",
        type: "image",
        size: 2048576,
        url: "/media/portfolio-hero.jpg",
        thumbnail: "/media/thumbnails/portfolio-hero.jpg",
        uploadedAt: "2024-01-15T10:30:00Z",
        category: "portfolio"
      },
      {
        id: "2",
        name: "project-demo.mp4",
        type: "video",
        size: 15728640,
        url: "/media/project-demo.mp4",
        thumbnail: "/media/thumbnails/project-demo.jpg",
        uploadedAt: "2024-01-20T14:45:00Z",
        category: "projects"
      },
      {
        id: "3",
        name: "resume.pdf",
        type: "document",
        size: 1024000,
        url: "/media/resume.pdf",
        uploadedAt: "2024-01-10T09:15:00Z",
        category: "documents"
      },
      {
        id: "4",
        name: "avatar.jpg",
        type: "image",
        size: 512000,
        url: "/media/avatar.jpg",
        thumbnail: "/media/thumbnails/avatar.jpg",
        uploadedAt: "2024-01-05T16:20:00Z",
        category: "profile"
      }
    ];
    setFiles(mockFiles);
    setFilteredFiles(mockFiles);
  }, []);

  useEffect(() => {
    let filtered = files;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(file => file.type === typeFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(file => file.category === categoryFilter);
    }

    setFilteredFiles(filtered);
  }, [files, searchTerm, typeFilter, categoryFilter]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return FaImage;
      case 'video':
        return FaVideo;
      case 'document':
        return FaFilePdf;
      default:
        return FaFilePdf;
    }
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteSelected = () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      setFiles(files.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file upload logic here
    console.log('Files dropped:', e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your files and assets</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center">
            <FaUpload className="mr-2" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Drop files here or click to upload
        </h3>
        <p className="text-gray-500 mb-4">
          Supports images, videos, and documents up to 10MB
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          Choose Files
        </button>
      </motion.div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
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
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="portfolio">Portfolio</option>
            <option value="projects">Projects</option>
            <option value="profile">Profile</option>
            <option value="documents">Documents</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Files Actions */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between"
        >
          <span className="text-blue-700 font-medium">
            {selectedFiles.length} file(s) selected
          </span>
          <div className="flex items-center space-x-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center">
              <FaDownload className="mr-2" />
              Download
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredFiles.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all ${
                    selectedFiles.includes(file.id) 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center relative">
                    {file.thumbnail ? (
                      <Image
                        src={file.thumbnail}
                        alt={file.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                        unoptimized
                      />
                    ) : (
                      <Icon className="text-4xl text-gray-400" />
                    )}
                    <div className="absolute top-2 right-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedFiles.includes(file.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-300'
                      }`}>
                        {selectedFiles.includes(file.id) && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{file.name}</h3>
                    <p className="text-gray-500 text-sm">{formatFileSize(file.size)}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => {
                  const Icon = getFileIcon(file.type);
                  return (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleFileSelect(file.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Icon className="text-gray-400 mr-3" />
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {file.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {file.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <FaEye />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <FaDownload />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FaImage className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
            Upload Your First File
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MediaPage;
