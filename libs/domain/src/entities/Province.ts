import { ProvinceCode } from '../value-objects/ProvinceCode';

export class Province {
  private readonly _code: ProvinceCode;
  private readonly _name: string;

  constructor(code: string | ProvinceCode, name: string) {
    this._code = code instanceof ProvinceCode ? code : new ProvinceCode(code);
    this._name = this.validateName(name);
  }

  get code(): ProvinceCode {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  private validateName(name: string): string {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('Province name cannot be empty');
    }
    return name.trim();
  }

  public equals(other: Province): boolean {
    return this._code.equals(other._code) && this._name === other._name;
  }

  public static create(code: string, name: string): Province {
    return new Province(code, name);
  }
}