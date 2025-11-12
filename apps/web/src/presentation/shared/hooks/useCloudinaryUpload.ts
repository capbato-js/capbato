import { useState } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseCloudinaryUploadReturn {
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  error: string | null;
  clearError: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const validateFile = (file: File): void => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setError(null);
    setUploadProgress(null);

    console.log('☁️ Cloudinary: Config check', { cloudName, uploadPreset });

    if (!cloudName || !uploadPreset) {
      const errorMsg = 'Cloudinary configuration is missing. Please check your environment variables.';
      console.error('❌ Cloudinary: Missing config');
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Validate file
      validateFile(file);
      console.log('✅ Cloudinary: File validation passed');

      setIsUploading(true);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'patients');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      console.log('📤 Cloudinary: Uploading to', uploadUrl);

      // Upload to Cloudinary
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Cloudinary: Response status', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Cloudinary: Upload failed', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      console.log('✅ Cloudinary: Upload successful', { secure_url: data.secure_url });

      // Return the secure URL
      return data.secure_url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('❌ Cloudinary: Exception', err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    uploadImage,
    isUploading,
    uploadProgress,
    error,
    clearError,
  };
};
