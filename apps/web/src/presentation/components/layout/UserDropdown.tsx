import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@mantine/core';
import { Icon } from '../common';
import { useAuthStore } from '../../../infrastructure/state/AuthStore';
import { useLogoutViewModel } from '../../features/auth';

interface UserDropdownProps {
  className?: string;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const logoutViewModel = useLogoutViewModel();

  // Generate user avatar with consistent color (same as legacy)
  const getUserInitials = (username: string): string => {
    if (!username) return 'U';
    return username.charAt(0).toUpperCase();
  };

  const getUserAvatarColor = (username: string): string => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
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

  // Handle settings click
  const handleSettingsClick = () => {
    setIsOpen(false);
    alert('Settings functionality coming soon!');
  };

  // Handle logout click
  const handleLogoutClick = () => {
    setIsOpen(false);
    logoutViewModel.handleLogout();
  };

  // Toggle dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Prevent dropdown from closing when clicking inside it
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Box className={`profile-dropdown-container ${className || ''}`} style={{ position: 'relative' }}>
      {/* Profile Avatar */}
      <div
        ref={avatarRef}
        className="profile-avatar"
        onClick={toggleDropdown}
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          fontSize: '24px',
          color: 'white',
          textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          backgroundColor: user?.username ? getUserAvatarColor(user.username) : '#4db6ac'
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
      </div>

      {/* Profile Dropdown */}
      <div
        ref={dropdownRef}
        className={`profile-dropdown ${isOpen ? '' : 'hidden'}`}
        onClick={handleDropdownClick}
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          padding: '8px 0',
          minWidth: '180px',
          zIndex: 1001,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: isOpen ? 'block' : 'none'
        }}
      >
        {/* Dropdown arrow */}
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '20px',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid white'
          }}
        />

        {/* Settings Option */}
        <div
          className="dropdown-item"
          onClick={handleSettingsClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: '#333',
            fontSize: '14px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Icon
            icon="fas fa-cog"
            style={{
              marginRight: '12px',
              width: '16px',
              fontSize: '14px',
              color: '#666'
            }}
          />
          <span>Settings</span>
        </div>

        {/* Logout Option */}
        <div
          className="dropdown-item"
          onClick={handleLogoutClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            color: '#333',
            fontSize: '14px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#fee';
            e.currentTarget.style.color = '#dc3545';
            const icon = e.currentTarget.querySelector('.fa-sign-out-alt') as HTMLElement;
            if (icon) icon.style.color = '#dc3545';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#333';
            const icon = e.currentTarget.querySelector('.fa-sign-out-alt') as HTMLElement;
            if (icon) icon.style.color = '#666';
          }}
        >
          <Icon
            icon="fas fa-sign-out-alt"
            style={{
              marginRight: '12px',
              width: '16px',
              fontSize: '14px',
              color: '#666'
            }}
          />
          <span>Logout</span>
        </div>
      </div>
    </Box>
  );
};
