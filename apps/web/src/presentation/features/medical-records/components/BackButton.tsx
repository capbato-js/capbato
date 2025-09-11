import React from 'react';
import { Button } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

interface BackButtonProps {
  onClick: () => void;
  text: string;
}

const buttonStyles = {
  fontSize: '14px'
};

export const BackButton: React.FC<BackButtonProps> = ({ onClick, text }) => {
  return (
    <Button
      variant="filled"
      color="gray"
      leftSection={<IconArrowLeft size={16} />}
      onClick={onClick}
      size="sm"
      style={buttonStyles}
    >
      {text}
    </Button>
  );
};