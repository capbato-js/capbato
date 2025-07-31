// Query DTOs for Patient operations

export interface GetPatientByIdQuery {
  id: string;
}

export interface GetAllPatientsQuery {
  // No parameters needed - returns all patients for frontend filtering
}

export interface GetPatientStatsQuery {
  // No parameters needed - returns overall statistics
}