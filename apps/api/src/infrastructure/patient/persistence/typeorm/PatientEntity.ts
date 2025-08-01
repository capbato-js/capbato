import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('patient')
@Index(['firstName', 'lastName']) // For name-based searches
@Index(['dateOfBirth']) // For age-based queries
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ 
    type: 'varchar', 
    length: 15, 
    unique: true,
    name: 'patient_number'
  })
  patientNumber!: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName!: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: true,
    name: 'middle_name'
  })
  middleName?: string;

  @Column({ type: 'date', name: 'date_of_birth' })
  dateOfBirth!: Date;

  @Column({ 
    type: 'enum', 
    enum: ['Male', 'Female']
  })
  gender!: 'Male' | 'Female';

  @Column({ 
    type: 'varchar', 
    length: 11,
    unique: true,
    name: 'contact_number'
  })
  contactNumber!: string;

  @Column({ type: 'text' })
  address!: string;

  // Guardian Information
  @Column({ 
    type: 'varchar', 
    length: 100, 
    nullable: true,
    name: 'guardian_name'
  })
  guardianName?: string;

  @Column({ 
    type: 'enum', 
    enum: ['Male', 'Female'], 
    nullable: true,
    name: 'guardian_gender'
  })
  guardianGender?: 'Male' | 'Female';

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: true,
    name: 'guardian_relationship'
  })
  guardianRelationship?: string;

  @Column({ 
    type: 'varchar', 
    length: 11, 
    nullable: true,
    name: 'guardian_contact_number'
  })
  guardianContactNumber?: string;

  @Column({ 
    type: 'text', 
    nullable: true,
    name: 'guardian_address'
  })
  guardianAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}