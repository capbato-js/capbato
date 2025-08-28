import { ValueObject } from './ValueObject';
import { NameFormattingService } from '../services/NameFormattingService';

export class Name extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value) {
      throw new Error('Name cannot be empty');
    }

    if (value.length < 1) {
      throw new Error('Name must have at least 1 character');
    }

    if (value.length > 50) {
      throw new Error('Name cannot exceed 50 characters');
    }

    // Allow letters (including accented characters), spaces, and hyphens
    const nameRegex = /^[\p{L}\s-]+$/u;
    if (!nameRegex.test(value)) {
      throw new Error('Names can only contain letters, spaces, and hyphens');
    }
  }

  public static create(value: string): Name {
    const trimmedValue = value.trim();
    // Format the name to proper case using the domain service
    const formattedValue = NameFormattingService.formatToProperCase(trimmedValue);
    return new Name(formattedValue);
  }
}