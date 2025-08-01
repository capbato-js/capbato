import { 
  PatientListDto, 
  PatientDto, 
  PatientStatsDto,
  CreatePatientCommand 
} from '@nx-starter/application-shared';

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

export interface PatientStatsResponse {
  success: boolean;
  data: PatientStatsDto;
  message?: string;
}

export interface IPatientApiService {
  createPatient(command: CreatePatientCommand): Promise<PatientResponse>;
  getAllPatients(): Promise<PatientListResponse>;
  getPatientById(id: string): Promise<PatientResponse>;
  getPatientStats(): Promise<PatientStatsResponse>;
}