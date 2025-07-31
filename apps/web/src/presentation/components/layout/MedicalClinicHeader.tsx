import React from 'react';
import { Box, Group, Image, Title, Text } from '@mantine/core';
import { useAuthStore } from '../../../infrastructure/state/AuthStore';
import { UserDropdown } from './UserDropdown';

interface MedicalClinicHeaderProps {
  className?: string;
}

export const MedicalClinicHeader: React.FC<MedicalClinicHeaderProps> = ({ className }) => {
  const { user } = useAuthStore();

  return (
    <Box
      component="nav"
      className={`navbar fixed top-0 left-0 w-full bg-white z-[1000] ${className || ''}`}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '15px'
      }}
    >
      {/* Left side - Brand */}
      <Group gap="md" align="center" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <Image
          src="/logo.png"
          alt="Logo"
          w={70}
          h={70}
          fit="cover"
          radius="md"
          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iMTAiIGZpbGw9IiM0ZGI2YWMiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xOS40MyA4LjU2TDEyIDEuMTNMMy41NyA4LjU2QzMuMjEgOC45IDMgOS4zNyAzIDkuODZWMjFIMjFWOS44NkMyMSA5LjM3IDIwLjc5IDguOSAyMC40MyA4LjU2Wk0xMiAzLjEzTDE4LjE0IDkuMjhIMTJWMy4xM1oiLz4KPC9zdmc+Cjwvc3ZnPg=="
          style={{
            width: '70px',
            height: '70px',
            objectFit: 'cover',
            borderRadius: '10px'
          }}
        />
        <Box>
          <Title 
            order={1} 
            className="navbar-brand h1"
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

      {/* Right side - User info and dropdown */}
      <Group gap="md" align="center" className="ms-auto text-end d-flex align-items-center gap-3" style={{ marginLeft: 'auto' }}>
        <Box style={{ textAlign: 'right' }}>
          <Text 
            id="roleDisplay"
            fw={700} 
            size="sm"
            className="fw-bold text-primary"
            style={{ color: '#0b4f6c' }}
          >
            {user?.role?.toUpperCase() || 'USER'}
          </Text>
          <Text 
            id="usernameDisplay"
            size="xs" 
            className="text-muted small"
            c="dimmed"
          >
            {user?.username || 'Username'}
          </Text>
        </Box>
        <UserDropdown />
      </Group>
    </Box>
  );
};
