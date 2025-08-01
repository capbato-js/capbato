export class ProvinceCode {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new Error('Province code cannot be empty');
    }
  }

  public equals(other: ProvinceCode): boolean {
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }

  public static create(value: string): ProvinceCode {
    return new ProvinceCode(value);
  }
}