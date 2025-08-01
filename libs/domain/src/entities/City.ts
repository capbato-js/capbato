import { CityCode } from '../value-objects/CityCode';

export class City {
  private readonly _code: CityCode;
  private readonly _name: string;

  constructor(code: string | CityCode, name: string) {
    this._code = code instanceof CityCode ? code : new CityCode(code);
    this._name = this.validateName(name);
  }

  get code(): CityCode {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  private validateName(name: string): string {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('City name cannot be empty');
    }
    return name.trim();
  }

  public equals(other: City): boolean {
    return this._code.equals(other._code) && this._name === other._name;
  }

  public static create(code: string, name: string): City {
    return new City(code, name);
  }
}