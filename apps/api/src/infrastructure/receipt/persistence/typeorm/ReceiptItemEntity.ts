import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ReceiptEntity } from './ReceiptEntity';

@Entity('receipt_items')
export class ReceiptItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'receipt_id' })
  receiptId!: number;

  @Column({ type: 'varchar', length: 255, name: 'service_name' })
  serviceName!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int', default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'unit_price' })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @ManyToOne(() => ReceiptEntity, (receipt) => receipt.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receipt_id' })
  receipt!: ReceiptEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}