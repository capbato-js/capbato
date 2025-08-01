// Address DTOs
export interface ProvinceDto {
  code: string;
  name: string;
}

export interface CityDto {
  code: string;
  name: string;
}

export interface BarangayDto {
  code: string;
  name: string;
}

// Request DTOs
export interface GetCitiesRequestDto {
  provinceCode: string;
}

export interface GetBarangaysRequestDto {
  cityCode: string;
}

// Response DTOs
export type ProvinceResponse = {
  success: true;
  data: ProvinceDto;
  message?: string;
};

export type ProvinceListResponse = {
  success: true;
  data: ProvinceDto[];
  message?: string;
};

export type CityResponse = {
  success: true;
  data: CityDto;
  message?: string;
};

export type CityListResponse = {
  success: true;
  data: CityDto[];
  message?: string;
};

export type BarangayResponse = {
  success: true;
  data: BarangayDto;
  message?: string;
};

export type BarangayListResponse = {
  success: true;
  data: BarangayDto[];
  message?: string;
};