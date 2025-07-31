import { ValueObject } from './ValueObject';

export class Mobile extends ValueObject<string> {
  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Mobile number cannot be empty');
    }

    const trimmedMobile = value.trim();
    
    // Philippine mobile number validation
    // Supports formats: 09xxxxxxxxx or +639xxxxxxxxx
    const cleanMobile = trimmedMobile.replace(/[\s\-()]/g, '');
    const phMobileRegex = /^(\+639|09)\d{9}$/;
    
    if (!phMobileRegex.test(cleanMobile)) {
      throw new Error('Invalid Philippine mobile number format. Use 09xxxxxxxxx or +639xxxxxxxxx');
    }
  }

  public static create(mobile: string): Mobile {
    return new Mobile(mobile.trim());
  }

  public static createOptional(mobile?: string): Mobile | undefined {
    if (!mobile || mobile.trim().length === 0) {
      return undefined;
    }
    return Mobile.create(mobile);
  }
}
