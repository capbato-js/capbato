import { PatientDetails } from '../types';

export const formatAddress = (address: PatientDetails['address']) => {
  if (!address) return null;
  if (typeof address === 'string') return address;
  const parts = [address.street, address.city, address.province, address.zipCode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
};

export const formatDateOfBirth = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch {
    return null;
  }
};