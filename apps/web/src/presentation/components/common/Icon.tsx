import React from 'react';

interface IconProps {
  /** FontAwesome icon class (e.g., "fas fa-cog") */
  icon: string;
  /** Additional CSS classes */
  className?: string;
  /** Icon size */
  size?: number | string;
  /** Icon color */
  color?: string;
  /** Click handler */
  onClick?: () => void;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Reusable Icon component using FontAwesome
 * Usage: <Icon icon="fas fa-cog" />
 */
export const Icon: React.FC<IconProps> = ({
  icon,
  className = '',
  size,
  color,
  onClick,
  style = {}
}) => {
  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(size && { fontSize: typeof size === 'number' ? `${size}px` : size }),
    ...(color && { color }),
    ...(onClick && { cursor: 'pointer' })
  };

  return (
    <i 
      className={`${icon} ${className}`}
      style={combinedStyle}
      onClick={onClick}
      aria-hidden="true"
    />
  );
};
