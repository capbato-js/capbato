export class ContactNumber {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Contact number cannot be empty');
    }
    
    const cleanedValue = this.cleanPhoneNumber(value);
    
    if (!this.isValidPhoneNumber(cleanedValue)) {
      throw new Error('Invalid contact number format');
    }
    
    this._value = cleanedValue;
  }

  get value(): string {
    return this._value;
  }

  get formattedValue(): string {
    // Format Philippine mobile numbers as 0912 345 6789
    if (this._value.length === 11 && this._value.startsWith('09')) {
      return `${this._value.slice(0, 4)} ${this._value.slice(4, 7)} ${this._value.slice(7)}`;
    }
    
    // Format as (XXX) XXX-XXXX for 10-digit US numbers
    if (this._value.length === 10) {
      return `(${this._value.slice(0, 3)}) ${this._value.slice(3, 6)}-${this._value.slice(6)}`;
    }
    
    // For other formats, return as-is
    return this._value;
  }

  private cleanPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Accept Philippine mobile numbers (11 digits starting with 09)
    if (/^09\d{9}$/.test(phone)) {
      return true;
    }
    
    // Accept 10-digit US numbers or 11-digit numbers starting with 1
    return /^(\d{10}|\d{11})$/.test(phone) && 
           (phone.length === 10 || (phone.length === 11 && phone.startsWith('1')));
  }

  equals(other: ContactNumber): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
