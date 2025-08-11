import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { ReceiptItemEntity } from './ReceiptItemEntity';

@Entity('receipts')
export class ReceiptEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id!: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      // Generate dashless UUID (32 character hex string)
      this.id = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

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