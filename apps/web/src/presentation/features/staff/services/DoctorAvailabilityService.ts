import { DoctorDto } from '@nx-starter/application-shared';

export interface DoctorAvailabilitySlot {
  id: string; // Unique identifier for the slot
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  formattedTime: string;
  isAvailable: boolean; // true for availability, false for appointments
  schedulePattern?: string;
  schedulePatternDescription?: string;
}

export class DoctorAvailabilityService {
  private static readonly DEFAULT_WORK_HOURS = [
    '08:00', '09:00', '10:00', '11:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  /**
   * Generate doctor schedule-based availability slots for a date range
   * This creates availability slots based on doctor schedule patterns (MWF/TTH)
   * and marks them as unavailable if there are existing appointments
   */
  static generateAvailabilitySlots(
    doctors: DoctorDto[],
    startDate: Date,
    endDate: Date,
    existingAppointments: Array<{ doctorId: string; date: string; time: string }>
  ): DoctorAvailabilitySlot[] {
    const slots: DoctorAvailabilitySlot[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateString = this.formatDateToISO(current);
      const dayOfWeek = this.getDayOfWeek(current);

      for (const doctor of doctors) {
        // Check if doctor is scheduled to work on this day based on schedule pattern
        if (this.isDoctorScheduledOnDay(doctor, dayOfWeek)) {
          // Generate availability slots for this doctor's scheduled day
          for (const time of this.DEFAULT_WORK_HOURS) {
            // Check if there's an existing appointment at this time
            const hasAppointment = existingAppointments.some(
              apt => apt.doctorId === doctor.id && apt.date === dateString && apt.time === time
            );

            slots.push({
              id: `availability-${doctor.id}-${dateString}-${time}`,
              doctorId: doctor.id,
              doctorName: doctor.fullName,
              date: dateString,
              time: time,
              formattedTime: this.formatTimeForDisplay(time),
              isAvailable: !hasAppointment, // Available if no appointment exists
              schedulePattern: doctor.schedulePattern,
              schedulePatternDescription: doctor.schedulePatternDescription
            });
          }
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return slots;
  }

  /**
   * Generate doctor schedule blocks (for full day schedule display)
   * This creates schedule blocks that show when doctors are supposed to work
   * regardless of specific time slots - useful for calendar day view
   */
  static generateDoctorScheduleBlocks(
    doctors: DoctorDto[],
    startDate: Date,
    endDate: Date,
    existingAppointments: Array<{ doctorId: string; date: string; time: string }> = []
  ): Array<{
    id: string;
    doctorId: string;
    doctorName: string;
    date: string;
    schedulePattern: string;
    schedulePatternDescription: string;
    hasAppointments: boolean;
    appointmentCount: number;
  }> {
    const blocks: Array<{
      id: string;
      doctorId: string;
      doctorName: string;
      date: string;
      schedulePattern: string;
      schedulePatternDescription: string;
      hasAppointments: boolean;
      appointmentCount: number;
    }> = [];
    
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateString = this.formatDateToISO(current);
      const dayOfWeek = this.getDayOfWeek(current);

      for (const doctor of doctors) {
        // Check if doctor is scheduled to work on this day
        if (this.isDoctorScheduledOnDay(doctor, dayOfWeek)) {
          // Count appointments for this doctor on this date
          const appointmentsOnDate = existingAppointments.filter(
            apt => apt.doctorId === doctor.id && apt.date === dateString
          );

          blocks.push({
            id: `schedule-${doctor.id}-${dateString}`,
            doctorId: doctor.id,
            doctorName: doctor.fullName,
            date: dateString,
            schedulePattern: doctor.schedulePattern || 'Unknown',
            schedulePatternDescription: doctor.schedulePatternDescription || 'No schedule pattern',
            hasAppointments: appointmentsOnDate.length > 0,
            appointmentCount: appointmentsOnDate.length
          });
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return blocks;
  }

  /**
   * Check if a doctor is scheduled to work on a specific day based on their schedule pattern
   */
  private static isDoctorScheduledOnDay(doctor: DoctorDto, dayOfWeek: string): boolean {
    if (!doctor.schedulePattern) {
      return false; // No schedule pattern means not available
    }

    const pattern = doctor.schedulePattern.toUpperCase();
    
    // Handle supported patterns (only MWF and TTH)
    switch (pattern) {
      case 'MWF':
        return ['MONDAY', 'WEDNESDAY', 'FRIDAY'].includes(dayOfWeek);
      case 'TTH':
        return ['TUESDAY', 'THURSDAY'].includes(dayOfWeek);
      default:
        console.warn(`Unsupported schedule pattern: ${pattern}. Only MWF and TTH are supported.`);
        return false;
    }
  }

  /**
   * Get day of week from date
   */
  private static getDayOfWeek(date: Date): string {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()];
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   */
  private static formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Format time for display
   */
  private static formatTimeForDisplay(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}${minutes !== '00' ? `:${minutes}` : ''} ${ampm}`;
  }

  /**
   * Get all available slots for a specific date
   */
  static getAvailableSlotsForDate(
    slots: DoctorAvailabilitySlot[], 
    date: Date
  ): DoctorAvailabilitySlot[] {
    const dateString = this.formatDateToISO(date);
    return slots.filter(slot => slot.date === dateString && slot.isAvailable);
  }

  /**
   * Get doctor availability summary for a date
   */
  static getDoctorAvailabilitySummary(
    slots: DoctorAvailabilitySlot[],
    date: Date
  ): { doctorId: string; doctorName: string; availableSlots: number; totalSlots: number; schedulePattern?: string }[] {
    const dateString = this.formatDateToISO(date);
    const dateSlotsMap = new Map<string, DoctorAvailabilitySlot[]>();

    // Group slots by doctor
    slots
      .filter(slot => slot.date === dateString)
      .forEach(slot => {
        if (!dateSlotsMap.has(slot.doctorId)) {
          dateSlotsMap.set(slot.doctorId, []);
        }
        dateSlotsMap.get(slot.doctorId)!.push(slot);
      });

    // Calculate summary for each doctor
    return Array.from(dateSlotsMap.entries()).map(([doctorId, doctorSlots]) => {
      const availableSlots = doctorSlots.filter(slot => slot.isAvailable).length;
      const totalSlots = doctorSlots.length;
      const firstSlot = doctorSlots[0];

      return {
        doctorId,
        doctorName: firstSlot.doctorName,
        availableSlots,
        totalSlots,
        schedulePattern: firstSlot.schedulePattern
      };
    });
  }
}