interface ReceiptItemData {
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export class ReceiptItem {
  private readonly _value: ReceiptItemData;

  constructor(data: ReceiptItemData) {
    this.validate(data);
    this._value = { ...data };
  }

  get value(): ReceiptItemData {
    return { ...this._value };
  }

  private validate(data: ReceiptItemData): void {
    if (!data.serviceName || data.serviceName.trim().length === 0) {
      throw new Error('Service name cannot be empty');
    }

    if (data.quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (data.unitPrice < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }

  get serviceName(): string {
    return this._value.serviceName;
  }

  get description(): string {
    return this._value.description;
  }

  get quantity(): number {
    return this._value.quantity;
  }

  get unitPrice(): number {
    return this._value.unitPrice;
  }

  get subtotal(): number {
    return this._value.quantity * this._value.unitPrice;
  }

  equals(other: ReceiptItem): boolean {
    return (
      this._value.serviceName === other._value.serviceName &&
      this._value.description === other._value.description &&
      this._value.quantity === other._value.quantity &&
      this._value.unitPrice === other._value.unitPrice
    );
  }

  toString(): string {
    return `${this._value.serviceName} - ${this._value.description} (${this._value.quantity} x ${this._value.unitPrice})`;
  }
}