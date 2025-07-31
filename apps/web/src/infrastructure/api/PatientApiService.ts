import { injectable, inject } from 'tsyringe';
import { IHttpClient } from '../http/IHttpClient';
import { IPatientApiService, PatientListResponse } from './IPatientApiService';
import { getApiConfig } from './config/ApiConfig';
import { TOKENS } from '@nx-starter/application-shared';

@injectable()
export class PatientApiService implements IPatientApiService {
  private readonly apiConfig = getApiConfig();

  constructor(
    @inject(TOKENS.HttpClient) private readonly httpClient: IHttpClient
  ) {}

  async getAllPatients(): Promise<PatientListResponse> {
    const response = await this.httpClient.get<PatientListResponse>(
      this.apiConfig.endpoints.patients.all
    );
    
    if (!response.data.success) {
      throw new Error('Failed to fetch patients');
    }
    
    return response.data;
  }
}