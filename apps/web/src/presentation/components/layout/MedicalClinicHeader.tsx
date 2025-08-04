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
      className={`navbar fixed top-0 left-0 w-full bg-white ${className || ''}`}
      style={{ 
        borderBottom: '1px solid #e5e5e5', // Subtle border instead of shadow
        padding: '0 24px',
        height: '64px', // Fixed height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Left side - Brand */}
      <Group gap="md" align="center" className="navbar-brand" style={{ textDecoration: 'none' }}>
        <Image
          src="/logo.png"
          alt="Logo"
          w={40}
          h={40}
          fit="cover"
          radius="md"
          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzI1NjNlYiIvPgo8c3ZnIHg9IjEwIiB5PSIxMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IndoaXRlIj4KPHN0cm9rZSBjdXJyZW50Q29sb3I9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiPgo8cGF0aCBkPSJNOSAxMmwyIDIgNC00Ii8+CjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiLz4KPC9zdHJva2U+Cjwvc3ZnPgo8L3N2Zz4="
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
        <Box>
          <Title 
            order={1} 
            className="navbar-brand h1"
            style={{ 
              color: '#0F0F0F',
              fontSize: '18px',
              fontWeight: 600,
              margin: 0,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
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
            fw={600} 
            size="sm"
            className="fw-bold text-primary"
            style={{ color: '#0F0F0F', fontSize: '14px' }}
          >
            {user?.role?.toUpperCase() || 'USER'}
          </Text>
          <Text 
            id="usernameDisplay"
            size="xs" 
            className="text-muted small"
            style={{ color: '#0F0F0F', fontSize: '12px' }}
          >
            {user?.username || 'Username'}
          </Text>
        </Box>
        <UserDropdown />
      </Group>
    </Box>
  );
};
