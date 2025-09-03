import { useRef, useEffect } from 'react';

/**
 * Custom hook to manage stable appointment ID reference for modals
 * This ensures the appointment ID doesn't change during modal lifecycle
 */
export const useAppointmentModalState = (
  isOpen: boolean,
  editMode: boolean,
  appointmentId?: string
) => {
  const appointmentIdRef = useRef<string | undefined>(undefined);
  
  // When modal opens with a valid appointment, store the ID
  useEffect(() => {
    if (isOpen && editMode && appointmentId) {
      appointmentIdRef.current = appointmentId;
    } else if (!isOpen) {
      // Clear when modal closes
      appointmentIdRef.current = undefined;
    }
  }, [isOpen, editMode, appointmentId]);
  
  // Use the stable ID from ref, fallback to current prop
  const stableAppointmentId = appointmentIdRef.current || (editMode && appointmentId ? appointmentId : undefined);
  
  return {
    stableAppointmentId
  };
};