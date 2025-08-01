import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('schedules')
@Index(['doctorId', 'date']) // For querying schedules by doctor and date
@Index(['date']) // For querying schedules by date
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, name: 'doctor_id' })
  @Index('idx_schedule_doctor_id') // For efficient doctor-based queries
  doctorId!: string;

  @Column({ type: 'date' })
  date!: string; // ISO date string (YYYY-MM-DD)

  @Column({ type: 'time' })
  time!: string; // Time string (HH:MM)

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt?: Date;

  // DEPRECATED: Keep for backward compatibility during migration
  // TODO: Remove after data migration is complete
  @Column({ type: 'varchar', length: 100, name: 'doctor_name', nullable: true })
  doctorName?: string;
}