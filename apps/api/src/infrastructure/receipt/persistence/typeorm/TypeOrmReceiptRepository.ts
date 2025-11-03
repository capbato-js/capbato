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
      where: { id },
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
    entity.labRequestId = receipt.labRequestId;

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

  async createWithAtomicSequence(
    date: Date,
    patientId: string,
    paymentMethod: string,
    receivedById: string,
    items: Array<{
      serviceName: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
    labRequestId?: string
  ): Promise<Receipt> {
    console.log('🔒 Starting atomic receipt creation transaction...');
    return await this.repository.manager.transaction(async manager => {
      const year = date.getFullYear();
      
      console.log('🔍 Getting sequence number with FOR UPDATE lock...');
      // Get next sequence number atomically within the same transaction
      // Instead of COUNT, get the MAX sequence number to avoid gaps
      const result = await manager.query(`
        SELECT COALESCE(
          MAX(CAST(SUBSTRING(receipt_number, 8) AS UNSIGNED)), 
          0
        ) as max_sequence
        FROM receipts 
        WHERE receipt_number LIKE 'R-${year}-%'
        FOR UPDATE
      `);
      
      const maxSequence = parseInt(result[0].max_sequence, 10);
      const sequenceNumber = maxSequence + 1;
      const receiptNumber = `R-${year}-${sequenceNumber.toString().padStart(3, '0')}`;
      
      console.log(`📊 Max sequence: ${maxSequence}, Next sequence: ${sequenceNumber}, Receipt number: ${receiptNumber}`);

      // Create the receipt entity
      const entity = new ReceiptEntity();
      entity.receiptNumber = receiptNumber;
      entity.date = date;
      entity.patientId = patientId;
      entity.paymentMethod = paymentMethod;
      entity.receivedById = receivedById;
      entity.labRequestId = labRequestId;

      // Create receipt items and calculate total
      const itemEntities = items.map(item => {
        const itemEntity = new ReceiptItemEntity();
        itemEntity.serviceName = item.serviceName;
        itemEntity.description = item.description;
        itemEntity.quantity = item.quantity;
        itemEntity.unitPrice = item.unitPrice;
        itemEntity.subtotal = item.quantity * item.unitPrice;
        return itemEntity;
      });

      entity.totalAmount = itemEntities.reduce((total, item) => total + item.subtotal, 0);
      entity.items = itemEntities;

      console.log('💾 Saving receipt within same transaction...');
      // Save within the same transaction
      const savedEntity = await manager.save(ReceiptEntity, entity);
      console.log('✅ Receipt saved successfully, transaction will commit');
      return this.toDomain(savedEntity);
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
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

    // Ensure dates are Date objects, not strings
    const date = entity.date instanceof Date ? entity.date : new Date(entity.date);
    const createdAt = entity.createdAt instanceof Date ? entity.createdAt : new Date(entity.createdAt);
    const updatedAt = entity.updatedAt instanceof Date ? entity.updatedAt : new Date(entity.updatedAt);

    return new Receipt(
      entity.receiptNumber,
      date,
      entity.patientId,
      entity.paymentMethod,
      entity.receivedById,
      items,
      createdAt,
      updatedAt,
      entity.id,
      entity.labRequestId
    );
  }
}