"use client"
import React, { useState } from 'react';
import { Upload, Paperclip, Send, Clock, Image as ImageIcon, File } from 'lucide-react';
import Image from 'next/image';

interface FileItem {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface PreviousSubmission {
  description: string;
  files: FileItem[];
  timestamp: string;
}

function App() {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previousSubmission, setPreviousSubmission] = useState<PreviousSubmission | null>(null);

  const processFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const fileItem: FileItem = {
        name: file.name,
        size: file.size,
        type: file.type
      };

      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        fileItem.preview = URL.createObjectURL(file);
      }

      return fileItem;
    });

    setFiles(prevFiles => {
      // Revoke old preview URLs to prevent memory leaks
      prevFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      return [...prevFiles, ...newFiles];
    });

    // Simulate previous submission after first file
    if (files.length === 0 && !previousSubmission) {
      setPreviousSubmission({
        description: "Implemented user authentication system with email verification. Added password reset functionality and updated the security measures as requested.",
        files: [
          { name: "auth-system.zip", size: 2500000, type: "application/zip" },
          { name: "documentation.pdf", size: 1200000, type: "application/pdf" }
        ],
        timestamp: new Date(Date.now() - 86400000).toLocaleString()
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ description, files });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FilePreview = ({ file }: { file: FileItem }) => {
    if (file.type.startsWith('image/') && file.preview) {
      return (
        <div className="relative group">
          <Image
            src={file.preview}
            alt={file.name}
            className="h-20 w-20 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 rounded-lg" />
        </div>
      );
    }
    return (
      <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        {file.type.includes('pdf') ? (
          <File className="h-8 w-8 text-red-500" />
        ) : (
          <File className="h-8 w-8 text-blue-500" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#1e3a8a] dark:bg-[#1e40af] px-6 py-8 sm:p-10">
            <h1 className="text-2xl font-bold text-white">Submit Milestone</h1>
            <p className="mt-2 text-blue-200">Document your progress and share your work</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10 space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                         transition duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                placeholder="Describe the work completed in this milestone..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors duration-150 ease-in-out
                          ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-700'}
                          ${files.length > 0 ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Any file type up to 10MB</p>
                </div>

                {files.length > 0 && (
                  <div className="mt-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          <FilePreview file={file} />
                          <div className="mt-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#1e3a8a] hover:bg-[#1e40af] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit Milestone
              </button>
            </div>
          </form>

          {previousSubmission && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8 sm:p-10 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-300">Previous Submission</h2>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{previousSubmission.timestamp}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{previousSubmission.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previousSubmission.files.map((file, index) => (
                  <div key={index} className="relative group">
                    <FilePreview file={file} />
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;