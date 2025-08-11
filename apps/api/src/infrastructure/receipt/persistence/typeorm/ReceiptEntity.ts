import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReceiptItemEntity } from './ReceiptItemEntity';

@Entity('receipts')
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'receipt_number' })
  receiptNumber!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'varchar', length: 36, name: 'patient_id' })
  patientId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'total_amount' })
  totalAmount!: number;

  @Column({ type: 'varchar', length: 50, name: 'payment_method' })
  paymentMethod!: string;

  @Column({ type: 'varchar', length: 36, name: 'received_by_id' })
  receivedById!: string;

  @OneToMany(() => ReceiptItemEntity, (item) => item.receipt, {
    cascade: true,
    eager: true,
  })
  items!: ReceiptItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}