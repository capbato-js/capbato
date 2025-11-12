/**
 * Calculates the appointment number based on the appointment time
 * Starting from 8:00 AM as slot 1, with 15-minute intervals
 *
 * @param time - Time in "HH:MM" format (e.g., "08:00", "10:15")
 * @returns The appointment number (1-based index)
 *
 * @example
 * calculateAppointmentNumber("08:00") // Returns 1
 * calculateAppointmentNumber("08:15") // Returns 2
 * calculateAppointmentNumber("10:00") // Returns 9
 */
export function calculateAppointmentNumber(time: string): number {
  // Time format is "HH:MM" (e.g., "08:00", "10:15")
  const [hours, minutes] = time.split(':').map(Number);

  // Starting time is 8:00 AM
  const startHour = 8;

  // Calculate total minutes from start time
  const totalMinutes = (hours - startHour) * 60 + minutes;

  // Each slot is 15 minutes, so divide by 15 and add 1 (to start from 1, not 0)
  const slotNumber = Math.floor(totalMinutes / 15) + 1;

  return slotNumber;
}
