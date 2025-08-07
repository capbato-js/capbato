import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IPatientApiService, PatientListResponse, PatientResponse, PatientStatsResponse } from './IPatientApiService';
import { getApiConfig } from './config/ApiConfig';
import { TOKENS, CreatePatientCommand, UpdatePatientCommand, CreatePatientRequestDto, UpdatePatientRequestDto } from '@nx-starter/application-shared';

@injectable()
export class PatientApiService implements IPatientApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  async createPatient(command: CreatePatientCommand): Promise<PatientResponse> {
    // Map CreatePatientCommand to CreatePatientRequestDto for API consistency
    const requestDto: CreatePatientRequestDto = {
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName,
      dateOfBirth: command.dateOfBirth,
      gender: command.gender,
      contactNumber: command.contactNumber,
      
      // Address Information
      houseNumber: command.houseNumber,
      streetName: command.streetName,
      province: command.province,
      cityMunicipality: command.cityMunicipality,
      barangay: command.barangay,
      
      // Guardian Information
      guardianName: command.guardianName,
      guardianGender: command.guardianGender,
      guardianRelationship: command.guardianRelationship,
      guardianContactNumber: command.guardianContactNumber,
      
      // Guardian Address Information
      guardianHouseNumber: command.guardianHouseNumber,
      guardianStreetName: command.guardianStreetName,
      guardianProvince: command.guardianProvince,
      guardianCityMunicipality: command.guardianCityMunicipality,
      guardianBarangay: command.guardianBarangay,
    };

    const response = await this.httpClient.post<PatientResponse>(
      this.apiConfig.endpoints.patients.create,
      requestDto
    );
    
    if (!response.data.success) {
      throw new Error('Failed to create patient');
    }
    
    return response.data;
  }

  async updatePatient(command: UpdatePatientCommand): Promise<PatientResponse> {
    console.log('🌐 PatientApiService.updatePatient called with:', command);
    
    // Map UpdatePatientCommand to UpdatePatientRequestDto for API consistency
    const requestDto: UpdatePatientRequestDto = {
      id: command.id,
      firstName: command.firstName,
      lastName: command.lastName,
      middleName: command.middleName,
      dateOfBirth: command.dateOfBirth,
      gender: command.gender,
      contactNumber: command.contactNumber,
      
      // Address Information
      houseNumber: command.houseNumber,
      streetName: command.streetName,
      province: command.province,
      cityMunicipality: command.cityMunicipality,
      barangay: command.barangay,
      
      // Guardian Information
      guardianName: command.guardianName,
      guardianGender: command.guardianGender,
      guardianRelationship: command.guardianRelationship,
      guardianContactNumber: command.guardianContactNumber,
      
      // Guardian Address Information
      guardianHouseNumber: command.guardianHouseNumber,
      guardianStreetName: command.guardianStreetName,
      guardianProvince: command.guardianProvince,
      guardianCityMunicipality: command.guardianCityMunicipality,
      guardianBarangay: command.guardianBarangay,
    };

    console.log('🌐 Request DTO prepared:', requestDto);
    
    const endpoint = this.apiConfig.endpoints.patients.update(command.id);
    console.log('🌐 Making PUT request to endpoint:', endpoint);

    const response = await this.httpClient.put<PatientResponse>(
      endpoint,
      requestDto
    );
    
    console.log('🌐 HTTP response received:', response);
    
    if (!response.data.success) {
      throw new Error(`Failed to update patient with ID: ${command.id}`);
    }
    
    return response.data;
  }

  async getAllPatients(): Promise<PatientListResponse> {
    const response = await this.httpClient.get<PatientListResponse>(
      this.apiConfig.endpoints.patients.all
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch patients');
    }
    
    return response.data;
  }

  async getPatientById(id: string): Promise<PatientResponse> {
    const response = await this.httpClient.get<PatientResponse>(
      this.apiConfig.endpoints.patients.byId(id)
    );
    
    if (!response.data.success) {
      throw new Error(`Failed to fetch patient with ID: ${id}`);
    }
    
    return response.data;
  }

  async getPatientStats(): Promise<PatientStatsResponse> {
    const response = await this.httpClient.get<PatientStatsResponse>(
      this.apiConfig.endpoints.patients.stats
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch patient statistics');
    }
    
    return response.data;
  }
}