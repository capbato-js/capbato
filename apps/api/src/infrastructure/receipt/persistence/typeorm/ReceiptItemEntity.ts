import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { ReceiptEntity } from './ReceiptEntity';

@Entity('receipt_items')
export class ReceiptItemEntity {
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

  @Column({ type: 'varchar', length: 36, name: 'receipt_id' })
  receiptId!: string;

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