import { ValueObject } from './ValueObject';

export type BloodChemistryStatusValue = 'pending' | 'complete' | 'cancelled';

/**
 * Blood Chemistry Status Value Object
 * Represents the status of a blood chemistry test
 */
export class BloodChemistryStatus extends ValueObject<BloodChemistryStatusValue> {
  private static readonly VALID_STATUSES: BloodChemistryStatusValue[] = [
    'pending',
    'complete', 
    'cancelled'
  ];

  private constructor(value: BloodChemistryStatusValue) {
    super(value);
  }

  public static create(value: BloodChemistryStatusValue): BloodChemistryStatus {
    if (!BloodChemistryStatus.VALID_STATUSES.includes(value)) {
      throw new Error(`Invalid blood chemistry status: ${value}. Must be one of: ${BloodChemistryStatus.VALID_STATUSES.join(', ')}`);
    }
    
    return new BloodChemistryStatus(value);
  }

  public static pending(): BloodChemistryStatus {
    return new BloodChemistryStatus('pending');
  }

  public static complete(): BloodChemistryStatus {
    return new BloodChemistryStatus('complete');
  }

  public static cancelled(): BloodChemistryStatus {
    return new BloodChemistryStatus('cancelled');
  }

  public isPending(): boolean {
    return this.value === 'pending';
  }

  public isComplete(): boolean {
    return this.value === 'complete';
  }

  public isCancelled(): boolean {
    return this.value === 'cancelled';
  }

  public canTransitionTo(newStatus: BloodChemistryStatus): boolean {
    // Define valid status transitions
    const transitions: Record<BloodChemistryStatusValue, BloodChemistryStatusValue[]> = {
      'pending': ['complete', 'cancelled'],
      'complete': [], // Complete is final
      'cancelled': [] // Cancelled is final
    };

    return transitions[this.value].includes(newStatus.value);
  }

  public toString(): string {
    return this.value;
  }
}
