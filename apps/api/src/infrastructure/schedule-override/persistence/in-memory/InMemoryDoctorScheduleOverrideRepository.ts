import { injectable } from 'tsyringe';
import { DoctorScheduleOverride } from '@nx-starter/domain';
import type { IDoctorScheduleOverrideRepository } from '@nx-starter/domain';

/**
 * In-memory implementation of IDoctorScheduleOverrideRepository
 * Used for testing and development
 */
@injectable()
export class InMemoryDoctorScheduleOverrideRepository implements IDoctorScheduleOverrideRepository {
  private overrides: Map<string, DoctorScheduleOverride> = new Map();

  async getAll(): Promise<DoctorScheduleOverride[]> {
    return Array.from(this.overrides.values())
      .sort((a, b) => a.date.value.localeCompare(b.date.value));
  }

  async getByDate(date: string): Promise<DoctorScheduleOverride | null> {
    for (const override of this.overrides.values()) {
      if (override.date.value === date) {
        return override;
      }
    }
    return null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<DoctorScheduleOverride[]> {
    return Array.from(this.overrides.values())
      .filter(override => {
        const overrideDate = override.date.value;
        return overrideDate >= startDate && overrideDate <= endDate;
      })
      .sort((a, b) => a.date.value.localeCompare(b.date.value));
  }

  async getByDoctorId(doctorId: string): Promise<DoctorScheduleOverride[]> {
    return Array.from(this.overrides.values())
      .filter(override => override.assignedDoctorId.value === doctorId)
      .sort((a, b) => a.date.value.localeCompare(b.date.value));
  }

  async getById(id: string): Promise<DoctorScheduleOverride | null> {
    return this.overrides.get(id) || null;
  }

  async create(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride> {
    this.overrides.set(override.id, override);
    return override;
  }

  async update(override: DoctorScheduleOverride): Promise<DoctorScheduleOverride> {
    this.overrides.set(override.id, override);
    return override;
  }

  async delete(id: string): Promise<void> {
    this.overrides.delete(id);
  }

  async deleteByDate(date: string): Promise<void> {
    for (const [id, override] of this.overrides.entries()) {
      if (override.date.value === date) {
        this.overrides.delete(id);
        break;
      }
    }
  }

  async existsByDate(date: string): Promise<boolean> {
    for (const override of this.overrides.values()) {
      if (override.date.value === date) {
        return true;
      }
    }
    return false;
  }

  async getByDates(dates: string[]): Promise<DoctorScheduleOverride[]> {
    return Array.from(this.overrides.values())
      .filter(override => dates.includes(override.date.value))
      .sort((a, b) => a.date.value.localeCompare(b.date.value));
  }

  // Helper methods for testing
  clear(): void {
    this.overrides.clear();
  }

  size(): number {
    return this.overrides.size;
  }
}
