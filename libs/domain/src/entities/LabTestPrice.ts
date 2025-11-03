interface ILabTestPrice {
  id?: string;
  testId: string;
  testName: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export class LabTestPrice implements ILabTestPrice {
  private readonly _id?: string;
  private readonly _testId: string;
  private readonly _testName: string;
  private readonly _price: number;
  private readonly _category: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(
    testId: string,
    testName: string,
    price: number,
    category: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    id?: string
  ) {
    this._testId = testId;
    this._testName = testName;
    this._price = price;
    this._category = category;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;

    this.validate();
  }

  private validate(): void {
    if (!this._testId || this._testId.trim().length === 0) {
      throw new Error('Test ID cannot be empty');
    }

    if (!this._testName || this._testName.trim().length === 0) {
      throw new Error('Test name cannot be empty');
    }

    if (this._price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (!this._category || this._category.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }

    if (this._createdAt > this._updatedAt) {
      throw new Error('Created date cannot be after updated date');
    }
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get testId(): string {
    return this._testId;
  }

  get testName(): string {
    return this._testName;
  }

  get price(): number {
    return this._price;
  }

  get category(): string {
    return this._category;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business logic methods
  updatePrice(newPrice: number): LabTestPrice {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    return new LabTestPrice(
      this._testId,
      this._testName,
      newPrice,
      this._category,
      this._createdAt,
      new Date(),
      this._id
    );
  }

  formatPrice(): string {
    return `₱${this._price.toFixed(2)}`;
  }

  equals(other: LabTestPrice): boolean {
    if (!this._id || !other._id) {
      return this._testId === other._testId;
    }
    return this._id === other._id;
  }
}

export type { ILabTestPrice };
