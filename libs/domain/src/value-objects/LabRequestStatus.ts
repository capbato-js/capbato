export type LabRequestStatusType = 'pending' | 'complete' | 'cancelled';

export class LabRequestStatus {
  private readonly _value: LabRequestStatusType;

  private constructor(value: LabRequestStatusType) {
    this._value = value;
  }

  static create(value: string): LabRequestStatus {
    const normalizedValue = value.toLowerCase().trim();
    
    switch (normalizedValue) {
      case 'pending':
        return new LabRequestStatus('pending');
      case 'complete':
      case 'completed':
        return new LabRequestStatus('complete');
      case 'cancelled':
      case 'canceled':
        return new LabRequestStatus('cancelled');
      default:
        throw new Error(`Invalid lab request status: ${value}. Must be pending, complete, or cancelled`);
    }
  }

  get value(): LabRequestStatusType {
    return this._value;
  }

  validate(): void {
    const validStatuses: LabRequestStatusType[] = ['pending', 'complete', 'cancelled'];
    if (!validStatuses.includes(this._value)) {
      throw new Error(`Invalid status: ${this._value}`);
    }
  }

  equals(other: LabRequestStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  isPending(): boolean {
    return this._value === 'pending';
  }

  isComplete(): boolean {
    return this._value === 'complete';
  }

  isCancelled(): boolean {
    return this._value === 'cancelled';
  }
}
