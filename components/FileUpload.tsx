"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaFile, FaImage, FaVideo, FaTrash, FaCheck } from "react-icons/fa";

interface FileUploadProps {
  onFileChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
}

interface UploadedFile {
  file: File;
  preview?: string;
}

const FileUpload = ({ 
  onFileChange, 
  accept = "*/*", 
  multiple = false,
  maxSize = 10,
  maxFiles = 5 
}: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return FaImage;
    if (file.type.startsWith('video/')) return FaVideo;
    return FaFile;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newErrors: string[] = [];
    const validFiles: UploadedFile[] = [];

    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else if (uploadedFiles.length + validFiles.length < maxFiles) {
        const uploadedFile: UploadedFile = { file };
        
        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            uploadedFile.preview = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
        
        validFiles.push(uploadedFile);
      } else {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
      }
    });

    setErrors(newErrors);
    
    if (validFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...validFiles];
      setUploadedFiles(updatedFiles);
      onFileChange(updatedFiles.map(f => f.file));
    }
  }, [uploadedFiles, maxFiles, onFileChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    onFileChange(updatedFiles.map(f => f.file));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={{
          borderColor: isDragging ? "#3b82f6" : "#e5e7eb",
          backgroundColor: isDragging ? "#eff6ff" : "#ffffff"
        }}
        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-lg font-semibold text-gray-700 mb-2">
            {isDragging ? "Drop files here" : "Click to upload or drag and drop"}
          </p>
          <p className="text-sm text-gray-500">
            {multiple ? `Up to ${maxFiles} files` : "Single file"} • Max size: {maxSize}MB
          </p>
        </label>
      </motion.div>

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">{error}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile, index) => {
              const Icon = getFileIcon(uploadedFile.file);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {uploadedFile.preview ? (
                      <Image
                        src={uploadedFile.preview}
                        alt="Preview"
                        width={48}
                        height={48}
                        className="object-cover rounded flex-shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Icon className="text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                    <FaCheck className="text-green-500" />
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <FaTrash />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

