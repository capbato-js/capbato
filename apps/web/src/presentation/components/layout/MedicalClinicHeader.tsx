import React from 'react';
import { Box, Group, Image, Title, Text, Avatar } from '@mantine/core';
import { useAuthStore } from '../../../infrastructure/state/AuthStore';

interface MedicalClinicHeaderProps {
  className?: string;
}

export const MedicalClinicHeader: React.FC<MedicalClinicHeaderProps> = ({ className }) => {
  const { user } = useAuthStore();

  // Generate user avatar with consistent color
  const getUserInitials = (username: string): string => {
    if (!username) return 'U';
    const parts = username.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 1).toUpperCase();
  };

  const getUserAvatarColor = (username: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#A3E4D7', '#FAD7A0', '#AED6F1', '#A9DFBF', '#F9E79F',
      '#10AC84', '#EE5A6F', '#0ABDE3', '#006BA6', '#F79F1F',
      '#A3CB38', '#FDA7DF', '#12CBC4', '#ED4C67', '#F79F1F'
    ];
    
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    return colors[colorIndex];
  };

  return (
    <Box
      component="header"
      className={`fixed top-0 left-0 w-full bg-white z-[1000] ${className || ''}`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '10px 20px' 
      }}
    >
      <Group justify="space-between" align="center">
        {/* Left side - Brand */}
        <Group gap="md" align="center">
          <Image
            src="/logo.png"
            alt="Logo"
            w={70}
            h={70}
            fit="cover"
            radius="md"
            fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iMTAiIGZpbGw9IiM0ZGI2YWMiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xOS40MyA4LjU2TDEyIDEuMTNMMy41NyA4LjU2QzMuMjEgOC45IDMgOS4zNyAzIDkuODZWMjFIMjFWOS44NkMyMSA5LjM3IDIwLjc5IDguOSAyMC40MyA4LjU2Wk0xMiAzLjEzTDE4LjE0IDkuMjhIMTJWMy4xM1oiLz4KPC9zdmc+Cjwvc3ZnPg=="
          />
          <Box>
            <Title 
              order={1} 
              size="h3"
              style={{ 
                color: '#0b4f6c',
                fontSize: '22px',
                margin: 0,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              }}
            >
              M.G. Amores Medical Clinic
            </Title>
          </Box>
        </Group>

        {/* Right side - User info and avatar */}
        <Group gap="md" align="center">
          <Box style={{ textAlign: 'right' }}>
            <Text 
              fw={700} 
              size="sm"
              style={{ color: '#0b4f6c' }}
            >
              {user?.role || 'User'}
            </Text>
            <Text 
              size="xs" 
              c="dimmed"
            >
              {user?.username || 'Username'}
            </Text>
          </Box>
          <Avatar
            size={45}
            radius="xl"
            style={{ 
              backgroundColor: user?.username ? getUserAvatarColor(user.username) : '#4db6ac',
              color: 'white',
              fontWeight: 500,
              fontSize: '18px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
            }}
          >
            {user?.username ? getUserInitials(user.username) : 'U'}
          </Avatar>
        </Group>
      </Group>
    </Box>
  );
};
