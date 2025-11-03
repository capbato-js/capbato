import { container } from 'tsyringe';
import { TOKENS } from '@nx-starter/application-shared';
import type { ILaboratoryApiService } from '../../../../infrastructure/api/ILaboratoryApiService';

export interface ReceiptItemFromLabRequest {
  serviceName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Fetches receipt items for a lab request from the API
 * @param labRequestId - The ID of the lab request
 * @returns Array of receipt items with pricing
 */
export async function fetchLabRequestReceiptItems(
  labRequestId: string
): Promise<ReceiptItemFromLabRequest[]> {
  try {
    const laboratoryApiService = container.resolve<ILaboratoryApiService>(
      TOKENS.LaboratoryApiService
    );

    const response = await laboratoryApiService.getLabRequestReceiptItems(labRequestId);

    if (response.success && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error('Error fetching lab request receipt items:', error);
    return [];
  }
}
