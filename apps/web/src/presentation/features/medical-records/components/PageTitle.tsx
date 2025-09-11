import React from 'react';
import { Title } from '@mantine/core';

interface PageTitleProps {
  title: string;
}

const titleStyles = {
  fontSize: '32px',
  fontWeight: 700,
  color: '#0F0F0F',
  margin: 0
};

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <Title order={2} style={titleStyles}>
      {title}
    </Title>
  );
};