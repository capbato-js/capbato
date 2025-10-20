// Query DTOs for Lab Request Analytics

export interface TopLabTestDto {
  testName: string;      // Display name (e.g., "CBC with Platelet")
  testKey: string;       // Internal key (e.g., "routineCbcWithPlatelet")
  category: string;      // Category (e.g., "Routine", "Serology")
  count: number;         // Number of requests
  percentage: number;    // Percentage of total requests
}

export interface GetTopLabTestsQuery {
  startDate?: string;    // ISO date string (YYYY-MM-DD)
  endDate?: string;      // ISO date string (YYYY-MM-DD)
  limit?: number;        // Number of top tests to return (default: 10)
}

export interface TopLabTestsResponse {
  success: true;
  data: TopLabTestDto[];
}
