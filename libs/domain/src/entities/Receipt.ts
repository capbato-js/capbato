import { ReceiptId } from '../value-objects/ReceiptId';
import { ReceiptNumber } from '../value-objects/ReceiptNumber';
import { PaymentMethod } from '../value-objects/PaymentMethod';
import { ReceiptItem } from '../value-objects/ReceiptItem';

interface IReceipt {
  id?: ReceiptId;
  receiptNumber: ReceiptNumber;
  date: Date;
  patientId: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  receivedById: string;
  items: ReceiptItem[];
  labRequestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Receipt implements IReceipt {
  private readonly _id?: ReceiptId;
  private readonly _receiptNumber: ReceiptNumber;
  private readonly _date: Date;
  private readonly _patientId: string;
  private readonly _totalAmount: number;
  private readonly _paymentMethod: PaymentMethod;
  private readonly _receivedById: string;
  private readonly _items: ReceiptItem[];
  private readonly _labRequestId?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    receiptNumber: string | ReceiptNumber,
    date: Date,
    patientId: string,
    paymentMethod: string | PaymentMethod,
    receivedById: string,
    items: ReceiptItem[],
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    id?: string | ReceiptId,
    labRequestId?: string
  ) {
    this._receiptNumber = receiptNumber instanceof ReceiptNumber ? receiptNumber : new ReceiptNumber(receiptNumber);
    this._date = date;
    this._patientId = patientId;
    this._paymentMethod = paymentMethod instanceof PaymentMethod ? paymentMethod : new PaymentMethod(paymentMethod as any);
    this._receivedById = receivedById;
    this._items = [...items]; // Create defensive copy
    this._labRequestId = labRequestId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id instanceof ReceiptId ? id : id ? new ReceiptId(id) : undefined;
    this._totalAmount = this.calculateTotalAmount();

    this.validate();
  }

  private validate(): void {
    if (!this._patientId || this._patientId.trim().length === 0) {
      throw new Error('Patient ID cannot be empty');
    }

    if (!this._receivedById || this._receivedById.trim().length === 0) {
      throw new Error('Received by ID cannot be empty');
    }

    if (this._items.length === 0) {
      throw new Error('Receipt must have at least one item');
    }

    if (this._date > new Date()) {
      throw new Error('Receipt date cannot be in the future');
    }

    if (this._createdAt > this._updatedAt) {
      throw new Error('Created date cannot be after updated date');
    }
  }

  private calculateTotalAmount(): number {
    return this._items.reduce((total, item) => total + item.subtotal, 0);
  }

  // Getters
  get id(): ReceiptId | undefined {
    return this._id;
  }

  get receiptNumber(): ReceiptNumber {
    return this._receiptNumber;
  }

  get date(): Date {
    return this._date;
  }

  get patientId(): string {
    return this._patientId;
  }

  get totalAmount(): number {
    return this._totalAmount;
  }

  get paymentMethod(): PaymentMethod {
    return this._paymentMethod;
  }

  get receivedById(): string {
    return this._receivedById;
  }

  get items(): ReceiptItem[] {
    return [...this._items]; // Return defensive copy
  }

  get labRequestId(): string | undefined {
    return this._labRequestId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // For backwards compatibility with existing code that expects string ID
  get stringId(): string | undefined {
    return this._id?.value;
  }

  get receiptNumberValue(): string {
    return this._receiptNumber.value;
  }

  get paymentMethodValue(): string {
    return this._paymentMethod.value;
  }

  // Business logic methods
  addItem(item: ReceiptItem): Receipt {
    const newItems = [...this._items, item];
    return this.createCopy({ items: newItems, updatedAt: new Date() });
  }

  removeItem(index: number): Receipt {
    if (index < 0 || index >= this._items.length) {
      throw new Error('Invalid item index');
    }

    const newItems = this._items.filter((_, i) => i !== index);
    if (newItems.length === 0) {
      throw new Error('Cannot remove all items from receipt');
    }

    return this.createCopy({ items: newItems, updatedAt: new Date() });
  }

  updateItem(index: number, item: ReceiptItem): Receipt {
    if (index < 0 || index >= this._items.length) {
      throw new Error('Invalid item index');
    }

    const newItems = [...this._items];
    newItems[index] = item;
    return this.createCopy({ items: newItems, updatedAt: new Date() });
  }

  getItemsSummary(): string {
    return this._items.map(item => item.serviceName).join(', ');
  }

  /**
   * Creates a copy of this receipt with modified properties
   * Immutable entity pattern - all changes create new instances
   */
  private createCopy(updates: {
    receiptNumber?: ReceiptNumber;
    date?: Date;
    patientId?: string;
    paymentMethod?: PaymentMethod;
    receivedById?: string;
    items?: ReceiptItem[];
    updatedAt?: Date;
    labRequestId?: string;
  }): Receipt {
    return new Receipt(
      updates.receiptNumber || this._receiptNumber,
      updates.date || this._date,
      updates.patientId || this._patientId,
      updates.paymentMethod || this._paymentMethod,
      updates.receivedById || this._receivedById,
      updates.items || this._items,
      this._createdAt,
      updates.updatedAt || this._updatedAt,
      this._id,
      updates.labRequestId !== undefined ? updates.labRequestId : this._labRequestId
    );
  }

  /**
   * Domain equality comparison based on business identity
   */
  equals(other: Receipt): boolean {
    if (!this._id || !other._id) {
      return false;
    }
    return this._id.equals(other._id);
  }

  /**
   * Check if receipt is from current year
   */
  isCurrentYear(): boolean {
    return this._date.getFullYear() === new Date().getFullYear();
  }

  /**
   * Check if receipt exceeds a certain amount threshold
   */
  exceedsAmount(threshold: number): boolean {
    return this._totalAmount > threshold;
  }
}

export type { IReceipt };