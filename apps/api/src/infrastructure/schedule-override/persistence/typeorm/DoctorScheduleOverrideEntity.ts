import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * TypeORM entity for Doctor Schedule Override
 * Maps domain entity to database table
 */
@Entity('doctor_schedule_overrides')
export class DoctorScheduleOverrideEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column('date', { comment: 'Date of the schedule override (YYYY-MM-DD)' })
  date!: string;

  @Column('varchar', { nullable: true, comment: 'Original doctor ID for this date (can be null if no pattern existed)' })
  originalDoctorId!: string | null;

  @Column('varchar', { comment: 'Assigned doctor ID for the override' })
  assignedDoctorId!: string;

  @Column('text', { comment: 'Reason for the schedule override' })
  reason!: string;

  @CreateDateColumn({ comment: 'When the override was created' })
  createdAt!: Date;

  @UpdateDateColumn({ comment: 'When the override was last updated' })
  updatedAt!: Date;
}
