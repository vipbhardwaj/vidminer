'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export default function VideoUploader() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  // Real upload function using API
  const uploadFile = async (file: File): Promise<void> => {
    const fileId = Math.random().toString(36).substring(7);
    
    // Add file to uploading list
    setUploadingFiles(prev => [...prev, {
      id: fileId,
      file,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Mark as completed
        setUploadingFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
        ));
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      setUploadingFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to upload file'
        } : f
      ));
    }
  };

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.type === 'video/mp4') {
        uploadFile(file);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4']
    },
    multiple: true
  });

  // Retry failed upload
  const handleRetry = (fileId: string) => {
    const file = uploadingFiles.find(f => f.id === fileId)?.file;
    if (file) {
      setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
      uploadFile(file);
    }
  };

  // Cancel upload
  const handleCancel = (fileId: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-500 bg-purple-900/20' : 'border-purple-900/30 hover:border-purple-500/50 hover:bg-purple-900/10'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-gray-300">
          <p className="text-lg mb-2">
            {isDragActive ? 'Drop videos here' : 'Drag & drop videos here'}
          </p>
          <p className="text-sm">or click to select files</p>
          <p className="text-xs mt-2 text-gray-400">Supported format: MP4</p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          {uploadingFiles.map((file) => (
            <div key={file.id} className="bg-gray-800 rounded-lg p-4 border border-purple-900/30">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-200">
                    {file.file.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                {file.status !== 'completed' && (
                  <button
                    onClick={() => handleCancel(file.id)}
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-medium ${
                    file.status === 'error' ? 'text-red-400' :
                    file.status === 'completed' ? 'text-green-400' :
                    'text-purple-400'
                  }`}>
                    {file.status === 'uploading' ? 'Uploading...' :
                     file.status === 'processing' ? 'Processing...' :
                     file.status === 'completed' ? 'Completed' :
                     'Error'}
                  </span>
                  {file.status === 'uploading' && (
                    <span className="text-gray-400">{file.progress}%</span>
                  )}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full ${
                      file.status === 'error' ? 'bg-red-500' :
                      file.status === 'completed' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>

              {file.error && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-red-400">{file.error}</p>
                  <button
                    onClick={() => handleRetry(file.id)}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 