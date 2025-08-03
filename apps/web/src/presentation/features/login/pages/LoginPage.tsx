import React from 'react';
import { Box, Image, Group, Title } from '@mantine/core';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Roboto, Arial, sans-serif'
      }}
      data-testid="login-page"
    >
      {/* Logo in upper left - matching header styling */}
      <Box
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 10
        }}
      >
        <Group gap="md" align="center" style={{ textDecoration: 'none' }}>
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
      </Box>

      {/* Centered Login Form */}
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        <Box
          style={{
            width: '100%',
            maxWidth: '400px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e5e5',
            padding: '40px 32px'
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};