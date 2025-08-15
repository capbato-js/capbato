import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a dashless UUID (32 character hex string)
 * Example: d2e66463bb2349209ea2cddf47f7822f
 */
export function generateDashlessUuid(): string {
  return uuidv4().replace(/-/g, '');
}

/**
 * Validates if a string is a valid dashless UUID format
 */
export function isValidDashlessUuid(value: string): boolean {
  return /^[0-9a-fA-F]{32}$/.test(value);
}

/**
 * Converts a regular UUID to dashless format
 */
export function toDashlessUuid(uuid: string): string {
  return uuid.replace(/-/g, '');
}

/**
 * Converts a dashless UUID to regular UUID format
 */
export function fromDashlessUuid(dashlessUuid: string): string {
  if (!isValidDashlessUuid(dashlessUuid)) {
    throw new Error('Invalid dashless UUID format');
  }
  
  return [
    dashlessUuid.slice(0, 8),
    dashlessUuid.slice(8, 12),
    dashlessUuid.slice(12, 16),
    dashlessUuid.slice(16, 20),
    dashlessUuid.slice(20, 32)
  ].join('-');
}