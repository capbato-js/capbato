import React from 'react';
import { Avatar } from '@mantine/core';

interface PatientAvatarProps {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  size?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({
  photoUrl,
  firstName,
  lastName,
  size = 'lg',
  radius = 'xl',
}) => {
  console.log('🖼️ PatientAvatar: Rendering with props:', { photoUrl, firstName, lastName, size, radius });

  // Generate initials from first and last name
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  if (photoUrl) {
    console.log('✅ PatientAvatar: Using photo URL:', photoUrl);
    return (
      <Avatar
        src={photoUrl}
        alt={`${firstName} ${lastName}`}
        size={size}
        radius={radius}
      />
    );
  }

  console.log('⭕ PatientAvatar: No photoUrl, using initials:', getInitials());
  return (
    <Avatar
      size={size}
      radius={radius}
      color="blue"
    >
      {getInitials()}
    </Avatar>
  );
};
