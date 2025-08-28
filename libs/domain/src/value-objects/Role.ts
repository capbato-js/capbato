import { ValueObject } from './ValueObject';
import { InvalidRoleException } from '../exceptions/DomainExceptions';

export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist'
}

export class Role extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  protected validate(value: string): void {
    if (!value || value.trim() === '') {
      throw new InvalidRoleException('Role cannot be empty');
    }

    const normalizedRole = value.toLowerCase().trim();
    
    if (!Object.values(UserRole).includes(normalizedRole as UserRole)) {
      throw new InvalidRoleException(
        `Invalid role: ${value}. Must be one of: ${Object.values(UserRole).join(', ')}`
      );
    }
  }

  public static create(value: string): Role {
    if (!value || typeof value !== 'string') {
      throw new InvalidRoleException('Role cannot be null or undefined');
    }
    const normalizedRole = value.toLowerCase().trim();
    return new Role(normalizedRole);
  }

  public isAdmin(): boolean {
    return this.value === UserRole.ADMIN;
  }

  public isDoctor(): boolean {
    return this.value === UserRole.DOCTOR;
  }

  public isReceptionist(): boolean {
    return this.value === UserRole.RECEPTIONIST;
  }

  public hasAdminPrivileges(): boolean {
    return this.isAdmin();
  }

  public canManagePatients(): boolean {
    return this.isAdmin() || this.isDoctor() || this.isReceptionist();
  }
}
