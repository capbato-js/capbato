import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAppointmentNumber1731456000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add appointment_number column
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'appointment_number',
        type: 'int',
        isNullable: false,
        default: 0,
      })
    );

    // Update existing appointments with calculated appointment numbers
    // based on their appointment time (8:00 AM = 1, 8:15 AM = 2, etc.)
    const appointments = await queryRunner.query(
      'SELECT id, appointment_time FROM appointments ORDER BY appointment_time'
    );

    for (const appointment of appointments) {
      const appointmentNumber = this.calculateAppointmentNumber(appointment.appointment_time);
      await queryRunner.query(
        'UPDATE appointments SET appointment_number = ? WHERE id = ?',
        [appointmentNumber, appointment.id]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'appointment_number');
  }

  private calculateAppointmentNumber(time: string): number {
    // Time format is "HH:MM" (e.g., "08:00", "10:15")
    const [hours, minutes] = time.split(':').map(Number);

    // Starting time is 8:00 AM
    const startHour = 8;

    // Calculate total minutes from start time
    const totalMinutes = (hours - startHour) * 60 + minutes;

    // Each slot is 15 minutes, so divide by 15 and add 1 (to start from 1, not 0)
    const slotNumber = Math.floor(totalMinutes / 15) + 1;

    return slotNumber;
  }
}
