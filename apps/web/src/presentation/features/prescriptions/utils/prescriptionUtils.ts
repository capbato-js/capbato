import { Prescription } from '@nx-starter/domain';

/**
 * Utility functions for prescription operations
 * These functions provide helper methods for working with prescription objects
 * whether they come from domain entities or plain DTOs
 */

/**
 * Checks if a prescription is expired
 * @param prescription - The prescription to check
 * @returns true if the prescription is expired, false otherwise
 */
export const isExpired = (prescription: Prescription): boolean => {
  if (!prescription.expiryDate) {
    return false; // No expiry date means it doesn't expire
  }
  return new Date() > new Date(prescription.expiryDate);
};

/**
 * Checks if a prescription is currently valid (active and not expired)
 * @param prescription - The prescription to check
 * @returns true if the prescription is valid, false otherwise
 */
export const isValid = (prescription: Prescription): boolean => {
  return prescription.status === 'active' && !isExpired(prescription);
};

/**
 * Checks if a prescription is active (status is 'active' regardless of expiry)
 * @param prescription - The prescription to check
 * @returns true if the prescription status is 'active', false otherwise
 */
export const isActive = (prescription: Prescription): boolean => {
  return prescription.status === 'active';
};

/**
 * Formats a date to a localized date string
 * @param date - The date to format (Date object or ISO string)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Gets the display color for a prescription status
 * @param prescription - The prescription to get color for
 * @returns CSS color class or color value
 */
export const getStatusColor = (prescription: Prescription): string => {
  if (isExpired(prescription)) return 'text-red-600';
  
  switch (prescription.status) {
    case 'active':
      return 'text-green-600';
    case 'completed':
      return 'text-blue-600';
    case 'discontinued':
      return 'text-gray-600';
    case 'on-hold':
      return 'text-yellow-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Gets the display status text for a prescription
 * @param prescription - The prescription to get status for
 * @returns Human-readable status string
 */
export const getStatusText = (prescription: Prescription): string => {
  if (isExpired(prescription)) return 'Expired';
  
  switch (prescription.status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'discontinued':
      return 'Discontinued';
    case 'on-hold':
      return 'On Hold';
    default:
      return 'Unknown';
  }
};
