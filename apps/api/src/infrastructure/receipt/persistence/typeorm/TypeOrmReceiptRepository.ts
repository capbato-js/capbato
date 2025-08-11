import { injectable } from 'tsyringe';
import { Repository, DataSource, Between } from 'typeorm';
import { Receipt, ReceiptItem, IReceiptRepository } from '@nx-starter/domain';
import { ReceiptEntity } from './ReceiptEntity';
import { ReceiptItemEntity } from './ReceiptItemEntity';

/**
 * TypeORM implementation of IReceiptRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmReceiptRepository implements IReceiptRepository {
  private repository: Repository<ReceiptEntity>;
  private itemRepository: Repository<ReceiptItemEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(ReceiptEntity);
    this.itemRepository = this.dataSource.getRepository(ReceiptItemEntity);
  }

  async getAll(): Promise<Receipt[]> {
    const entities = await this.repository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getById(id: string): Promise<Receipt | null> {
    const entity = await this.repository.findOne({
      where: { id: parseInt(id) },
      relations: ['items'],
    });
    return entity ? this.toDomain(entity) : null;
  }

  async create(receipt: Receipt): Promise<Receipt> {
    const entity = new ReceiptEntity();
    entity.receiptNumber = receipt.receiptNumberValue;
    entity.date = receipt.date;
    entity.patientId = receipt.patientId;
    entity.totalAmount = receipt.totalAmount;
    entity.paymentMethod = receipt.paymentMethodValue;
    entity.receivedById = receipt.receivedById;

    // Create receipt items
    const itemEntities = receipt.items.map(item => {
      const itemEntity = new ReceiptItemEntity();
      itemEntity.serviceName = item.serviceName;
      itemEntity.description = item.description;
      itemEntity.quantity = item.quantity;
      itemEntity.unitPrice = item.unitPrice;
      itemEntity.subtotal = item.subtotal;
      return itemEntity;
    });

    entity.items = itemEntities;

    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    const numericId = parseInt(id);
    const result = await this.repository.delete(numericId);
    if (result.affected === 0) {
      throw new Error(`Receipt with ID ${id} not found`);
    }
  }

  async getByPatientId(patientId: string): Promise<Receipt[]> {
    const entities = await this.repository.find({
      where: { patientId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Receipt[]> {
    const entities = await this.repository.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['items'],
      order: { date: 'DESC' },
    });
    return entities.map(this.toDomain);
  }

  async getNextSequenceNumber(year: number): Promise<number> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    
    const count = await this.repository.count({
      where: {
        date: Between(startOfYear, endOfYear),
      },
    });

    return count + 1;
  }

  async existsByReceiptNumber(receiptNumber: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { receiptNumber },
    });
    return count > 0;
  }

  /**
   * Converts TypeORM entity to domain object
   */
  private toDomain(entity: ReceiptEntity): Receipt {
    const items = entity.items.map(item =>
      new ReceiptItem({
        serviceName: item.serviceName,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );

    return new Receipt(
      entity.receiptNumber,
      entity.date,
      entity.patientId,
      entity.paymentMethod as any,
      entity.receivedById,
      items,
      entity.createdAt,
      entity.updatedAt,
      entity.id.toString()
    );
  }
}