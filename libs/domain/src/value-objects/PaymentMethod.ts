export type PaymentMethodType = 'Cash' | 'GCash' | 'Card' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Check';

export class PaymentMethod {
  private readonly _value: PaymentMethodType;

  constructor(value: PaymentMethodType) {
    this.validate(value);
    this._value = value;
  }

  get value(): PaymentMethodType {
    return this._value;
  }

  private validate(value: PaymentMethodType): void {
    const validMethods: PaymentMethodType[] = ['Cash', 'GCash', 'Card', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Check'];
    
    if (!validMethods.includes(value)) {
      throw new Error(`Invalid payment method. Must be one of: ${validMethods.join(', ')}`);
    }
  }

  equals(other: PaymentMethod): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  isCash(): boolean {
    return this._value === 'Cash';
  }

  isElectronic(): boolean {
    return ['GCash', 'Card', 'Credit Card', 'Debit Card', 'Bank Transfer'].includes(this._value);
  }
}