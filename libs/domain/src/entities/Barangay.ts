import { BarangayCode } from '../value-objects/BarangayCode';

export class Barangay {
  private readonly _code: BarangayCode;
  private readonly _name: string;

  constructor(code: string | BarangayCode, name: string) {
    this._code = code instanceof BarangayCode ? code : new BarangayCode(code);
    this._name = this.validateName(name);
  }

  get code(): BarangayCode {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  private validateName(name: string): string {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Barangay name cannot be empty');
    }
    return name.trim();
  }

  public equals(other: Barangay): boolean {
    return this._code.equals(other._code) && this._name === other._name;
  }

  public static create(code: string, name: string): Barangay {
    return new Barangay(code, name);
  }
}