import { PatientListDto, PatientDto } from '@nx-starter/application-shared';

export interface PatientListResponse {
  success: boolean;
  data: PatientListDto[];
  message?: string;
}

export interface PatientResponse {
  success: boolean;
  data: PatientDto;
  message?: string;
}

export interface IPatientApiService {
  getAllPatients(): Promise<PatientListResponse>;
  getPatientById(id: string): Promise<PatientResponse>;
}