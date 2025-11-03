import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

@Entity('lab_test_prices')
export class LabTestPriceEntity {
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

  @Column({ type: 'varchar', length: 100, unique: true, name: 'test_id' })
  testId!: string;

  @Column({ type: 'varchar', length: 255, name: 'test_name' })
  testName!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 50 })
  category!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
