/**
 * Utility functions for validating lab test values against normal ranges
 * and determining appropriate background colors for visual feedback.
 */

export type RangeValidationResult = 'below' | 'normal' | 'above' | 'invalid';

interface ParsedRange {
  min?: number;
  max?: number;
  isValid: boolean;
}

/**
 * Parses a range string and extracts min/max values.
 * Supports formats like:
 * - "3.3-6.10 mmol/L" -> {min: 3.3, max: 6.10}
 * - "0-38 U/L" -> {min: 0, max: 38}
 * - "up to 20.40 µmol/L" -> {max: 20.40}
 * - "135-145 mmol/L" -> {min: 135, max: 145}
 * - "53 - 90 U/L" -> {min: 53, max: 90} (handles spaces)
 */
export function parseRange(rangeString: string | undefined): ParsedRange {
  if (!rangeString) {
    return { isValid: false };
  }

  const trimmed = rangeString.trim();

  // Handle "up to X" format
  const upToMatch = trimmed.match(/up\s+to\s+([\d.]+)/i);
  if (upToMatch) {
    return {
      max: parseFloat(upToMatch[1]),
      isValid: true
    };
  }

  // Handle "X-Y" format (with optional spaces around dash)
  const rangeMatch = trimmed.match(/([\d.]+)\s*-\s*([\d.]+)/);
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
      isValid: true
    };
  }

  return { isValid: false };
}

/**
 * Compares a value against a parsed range and returns the validation result.
 */
export function compareValueToRange(
  value: string | undefined,
  parsedRange: ParsedRange
): RangeValidationResult {
  if (!parsedRange.isValid || !value || value.trim() === '') {
    return 'invalid';
  }

  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return 'invalid';
  }

  // Check if below minimum
  if (parsedRange.min !== undefined && numericValue < parsedRange.min) {
    return 'below';
  }

  // Check if above maximum
  if (parsedRange.max !== undefined && numericValue > parsedRange.max) {
    return 'above';
  }

  return 'normal';
}

/**
 * Main function that takes a value and range string,
 * and returns the validation result.
 */
export function validateValueAgainstRange(
  value: string | undefined,
  rangeString: string | undefined
): RangeValidationResult {
  const parsedRange = parseRange(rangeString);
  return compareValueToRange(value, parsedRange);
}

/**
 * Returns the appropriate background color based on validation result.
 * - 'below': yellow (#FFEB3B with transparency)
 * - 'above': red (#FFCDD2 - light red)
 * - 'normal' or 'invalid': transparent/white
 */
export function getBackgroundColorForRange(
  validationResult: RangeValidationResult
): string {
  switch (validationResult) {
    case 'below':
      return '#FFF9C4'; // Light yellow
    case 'above':
      return '#FFCDD2'; // Light red
    case 'normal':
    case 'invalid':
    default:
      return 'transparent';
  }
}

/**
 * Convenience function that combines validation and color determination.
 * Returns the background color for a given value and range.
 */
export function getInputBackgroundColor(
  value: string | undefined,
  rangeString: string | undefined
): string {
  const validationResult = validateValueAgainstRange(value, rangeString);
  return getBackgroundColorForRange(validationResult);
}
