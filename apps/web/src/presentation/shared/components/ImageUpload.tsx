import React, { useRef, useState } from 'react';
import { Box, Text, Group, Button, Loader, Stack } from '@mantine/core';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage, isUploading, error, clearError } = useCloudinaryUpload();

  const handleFileSelect = async (file: File) => {
    if (disabled) return;

    console.log('📸 ImageUpload: Starting file upload', { fileName: file.name, fileSize: file.size });

    try {
      clearError();
      const url = await uploadImage(file);
      console.log('✅ ImageUpload: Upload successful, URL:', url);
      onChange(url);
      console.log('📤 ImageUpload: Called onChange with URL');
    } catch (err) {
      console.error('❌ ImageUpload: Upload error:', err);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Stack gap="xs">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: `2px dashed ${isDragging ? '#228be6' : '#ced4da'}`,
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isDragging ? '#f1f3f5' : value ? '#f8f9fa' : 'white',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {isUploading ? (
          <Group justify="center">
            <Loader size="sm" />
            <Text size="sm">Uploading...</Text>
          </Group>
        ) : value ? (
          <Stack gap="sm">
            <Box
              style={{
                width: '100%',
                height: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '4px',
              }}
            >
              <img
                src={value}
                alt="Patient"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Group justify="center" gap="xs">
              <Button
                size="xs"
                variant="light"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled}
              >
                Replace
              </Button>
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled}
              >
                Remove
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Drag and drop an image here
            </Text>
            <Text size="sm" c="dimmed">
              or
            </Text>
            <Button size="sm" variant="light" disabled={disabled}>
              Click to Upload
            </Button>
            <Text size="xs" c="dimmed">
              Max 5MB • JPEG, PNG, WebP, GIF
            </Text>
          </Stack>
        )}
      </Box>

      {error && (
        <Text size="xs" c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
};
