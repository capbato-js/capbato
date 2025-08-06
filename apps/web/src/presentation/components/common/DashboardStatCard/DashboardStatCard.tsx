import React from 'react';
import { Paper, Group, Avatar, Text, Box } from '@mantine/core';

interface DashboardStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  iconColor?: string;
  backgroundColor?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  iconColor = '#fff',
  backgroundColor = '#4DABF7'
}) => {
  return (
    <Paper
      p="md"
      radius="md"
      style={{
        backgroundColor: 'white',
        border: '1px solid #e9ecef',
        height: '100px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Group align="center" style={{ width: '100%' }}>
        <Avatar
          size="lg"
          style={{
            backgroundColor,
            color: iconColor,
            fontSize: '24px'
          }}
        >
          {icon}
        </Avatar>
        <Box style={{ flex: 1 }}>
          <Text
            size="sm"
            style={{
              color: '#6b7280',
              fontWeight: 500,
              marginBottom: '4px'
            }}
          >
            {title}
          </Text>
          <Text
            size="xl"
            style={{
              color: '#111827',
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {value}
          </Text>
          {subtitle && (
            <Text
              size="xs"
              style={{
                color: '#9ca3af',
                marginTop: '2px'
              }}
            >
              {subtitle}
            </Text>
          )}
        </Box>
      </Group>
    </Paper>
  );
};
