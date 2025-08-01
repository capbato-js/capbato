import { Province, City, Barangay } from '@nx-starter/domain';
import type { ProvinceDto, CityDto, BarangayDto } from '../dto/AddressDto';

/**
 * Mapper for converting between Address entities and DTOs
 */
export class AddressMapper {
  /**
   * Maps a Province entity to a ProvinceDto
   */
  static provinceToDto(province: Province): ProvinceDto {
    return {
      code: province.code.value,
      name: province.name,
    };
  }

  /**
   * Maps an array of Province entities to ProvinceDtos
   */
  static provincesToDtoArray(provinces: Province[]): ProvinceDto[] {
    return provinces.map((province) => this.provinceToDto(province));
  }

  /**
   * Maps a City entity to a CityDto
   */
  static cityToDto(city: City): CityDto {
    return {
      code: city.code.value,
      name: city.name,
    };
  }

  /**
   * Maps an array of City entities to CityDtos
   */
  static citiesToDtoArray(cities: City[]): CityDto[] {
    return cities.map((city) => this.cityToDto(city));
  }

  /**
   * Maps a Barangay entity to a BarangayDto
   */
  static barangayToDto(barangay: Barangay): BarangayDto {
    return {
      code: barangay.code.value,
      name: barangay.name,
    };
  }

  /**
   * Maps an array of Barangay entities to BarangayDtos
   */
  static barangaysToDtoArray(barangays: Barangay[]): BarangayDto[] {
    return barangays.map((barangay) => this.barangayToDto(barangay));
  }
}