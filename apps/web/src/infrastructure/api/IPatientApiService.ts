import { PatientListDto } from '@nx-starter/application-shared';

export interface PatientListResponse {
  success: boolean;
  data: PatientListDto[];
  message?: string;
}

export interface IPatientApiService {
  getAllPatients(): Promise<PatientListResponse>;
}