import { Receipt } from '@nx-starter/domain';
import type { 
  TransactionDto, 
  TransactionItemDto, 
  PatientInfoDto,
  CreateTransactionDto 
} from '../dto/TransactionDto';

/**
 * Mapper for converting between Receipt entities and Transaction DTOs
 * Note: This mapper requires external services to fetch patient and user details
 */
export class TransactionMapper {
  /**
   * Maps a Receipt entity to a TransactionDto
   * Note: Patient and receivedBy information will need to be populated externally
   */
  static toDto(
    receipt: Receipt, 
    patientInfo?: PatientInfoDto, 
    receivedByName?: string
  ): TransactionDto {
    const items: TransactionItemDto[] = receipt.items.map(item => ({
      serviceName: item.serviceName,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    }));

    return {
      id: receipt.stringId || null,
      receiptNumber: receipt.receiptNumberValue,
      date: receipt.date.toISOString().split('T')[0], // YYYY-MM-DD format
      patient: patientInfo || {
        id: receipt.patientId,
        patientNumber: 'Unknown',
        firstName: 'Unknown',
        lastName: 'Patient',
        middleName: '',
        fullName: 'Unknown Patient',
      },
      totalAmount: receipt.totalAmount,
      paymentMethod: receipt.paymentMethodValue,
      receivedBy: receivedByName || 'Unknown',
      items,
      itemsSummary: receipt.getItemsSummary(),
      createdAt: receipt.createdAt.toISOString(),
      updatedAt: receipt.updatedAt.toISOString(),
    };
  }

  /**
   * Maps an array of Receipt entities to TransactionDtos
   */
  static toDtoArray(
    receipts: Receipt[], 
    patientsMap?: Map<string, PatientInfoDto>,
    usersMap?: Map<string, string>
  ): TransactionDto[] {
    return receipts.map((receipt) => 
      this.toDto(
        receipt, 
        patientsMap?.get(receipt.patientId),
        usersMap?.get(receipt.receivedById)
      )
    );
  }

  /**
   * Maps a CreateTransactionDto to a Receipt entity
   * Note: Receipt number and ID will be generated during creation
   */
  static createToDomain(dto: CreateTransactionDto): {
    patientId: string;
    date: Date;
    paymentMethod: string;
    receivedById: string;
    items: Array<{
      serviceName: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>;
  } {
    return {
      patientId: dto.patientId,
      date: new Date(dto.date),
      paymentMethod: dto.paymentMethod,
      receivedById: dto.receivedById,
      items: dto.items.map(item => ({
        serviceName: item.serviceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  }

  /**
   * Maps Receipt entity to plain object for database storage
   */
  static toPlainObject(receipt: Receipt): {
    receiptNumber: string;
    date: Date;
    patientId: string;
    totalAmount: number;
    paymentMethod: string;
    receivedById: string;
    items: Array<{
      serviceName: string;
      description: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }>;
  } {
    return {
      receiptNumber: receipt.receiptNumberValue,
      date: receipt.date,
      patientId: receipt.patientId,
      totalAmount: receipt.totalAmount,
      paymentMethod: receipt.paymentMethodValue,
      receivedById: receipt.receivedById,
      items: receipt.items.map(item => ({
        serviceName: item.serviceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      })),
    };
  }
}