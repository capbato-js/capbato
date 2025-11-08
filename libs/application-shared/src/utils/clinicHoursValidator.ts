/**
 * Clinic Hours Validator
 *
 * Provides utility functions to validate whether operations are being performed
 * within the clinic's operating hours (8:00 AM to 6:00 PM).
 */

export interface ClinicHoursConfig {
  openingHour: number; // 24-hour format (0-23)
  closingHour: number; // 24-hour format (0-23)
}

export const DEFAULT_CLINIC_HOURS: ClinicHoursConfig = {
  openingHour: 8,  // 8:00 AM
  closingHour: 18, // 6:00 PM (18:00)
};

export class ClinicHoursError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClinicHoursError';
  }
}

/**
 * Checks if the current time is within clinic operating hours
 * @param config - Optional clinic hours configuration (defaults to 8am-6pm)
 * @returns true if current time is within operating hours, false otherwise
 */
export function isWithinClinicHours(config: ClinicHoursConfig = DEFAULT_CLINIC_HOURS): boolean {
  const now = new Date();
  const currentHour = now.getHours();

  return currentHour >= config.openingHour && currentHour < config.closingHour;
}

/**
 * Validates that the current time is within clinic operating hours
 * @param config - Optional clinic hours configuration (defaults to 8am-6pm)
 * @throws ClinicHoursError if current time is outside operating hours
 */
export function validateClinicHours(config: ClinicHoursConfig = DEFAULT_CLINIC_HOURS): void {
  if (!isWithinClinicHours(config)) {
    const openingTime = formatHour(config.openingHour);
    const closingTime = formatHour(config.closingHour);
    throw new ClinicHoursError(
      `This operation can only be performed during clinic hours (${openingTime} to ${closingTime}). The clinic is currently closed.`
    );
  }
}

/**
 * Gets a user-friendly message about clinic hours
 * @param config - Optional clinic hours configuration (defaults to 8am-6pm)
 * @returns Message string describing clinic hours status
 */
export function getClinicHoursMessage(config: ClinicHoursConfig = DEFAULT_CLINIC_HOURS): string {
  const openingTime = formatHour(config.openingHour);
  const closingTime = formatHour(config.closingHour);

  if (isWithinClinicHours(config)) {
    return `Clinic is currently open (${openingTime} - ${closingTime})`;
  }

  return `Clinic is closed. Operating hours: ${openingTime} - ${closingTime}`;
}

/**
 * Formats hour in 24-hour format to 12-hour AM/PM format
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Formatted time string (e.g., "8:00 AM", "6:00 PM")
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

/**
 * Validates clinic hours and returns validation result
 * @param config - Optional clinic hours configuration (defaults to 8am-6pm)
 * @returns Object with isValid flag and message
 */
export function validateClinicHoursWithResult(
  config: ClinicHoursConfig = DEFAULT_CLINIC_HOURS
): { isValid: boolean; message: string } {
  const isValid = isWithinClinicHours(config);
  const openingTime = formatHour(config.openingHour);
  const closingTime = formatHour(config.closingHour);

  if (isValid) {
    return {
      isValid: true,
      message: `Clinic is open (${openingTime} - ${closingTime})`,
    };
  }

  return {
    isValid: false,
    message: `Cannot add laboratory tests or prescriptions outside clinic hours (${openingTime} to ${closingTime})`,
  };
}
