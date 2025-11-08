import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateReasonForVisitToJson1730000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Get the database type to handle SQLite vs other databases differently
    const dbType = queryRunner.connection.driver.options.type;

    if (dbType === 'sqlite' || dbType === 'better-sqlite3') {
      // For SQLite: Migrate existing data to JSON array format
      // First, get all existing appointments
      const appointments = await queryRunner.query(
        'SELECT id, reason_for_visit FROM appointments'
      );

      // Update each appointment to convert string to JSON array
      for (const appointment of appointments) {
        if (appointment.reason_for_visit) {
          const reasonArray = JSON.stringify([appointment.reason_for_visit]);
          await queryRunner.query(
            'UPDATE appointments SET reason_for_visit = ? WHERE id = ?',
            [reasonArray, appointment.id]
          );
        }
      }

      // SQLite doesn't have a native JSON type, but TEXT can store JSON
      // The column type is already TEXT, so no schema change needed
      // TypeORM will handle JSON serialization/deserialization
    } else {
      // For PostgreSQL, MySQL, etc.
      // Migrate existing data
      await queryRunner.query(`
        UPDATE appointments
        SET reason_for_visit = CONCAT('["', reason_for_visit, '"]')
        WHERE reason_for_visit IS NOT NULL
      `);

      // Change column type to JSON
      await queryRunner.changeColumn(
        'appointments',
        'reason_for_visit',
        new TableColumn({
          name: 'reason_for_visit',
          type: 'json',
          isNullable: false,
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.driver.options.type;

    if (dbType === 'sqlite' || dbType === 'better-sqlite3') {
      // For SQLite: Convert JSON array back to first element
      const appointments = await queryRunner.query(
        'SELECT id, reason_for_visit FROM appointments'
      );

      for (const appointment of appointments) {
        if (appointment.reason_for_visit) {
          try {
            const reasonArray = JSON.parse(appointment.reason_for_visit);
            const firstReason = Array.isArray(reasonArray) && reasonArray.length > 0
              ? reasonArray[0]
              : appointment.reason_for_visit;

            await queryRunner.query(
              'UPDATE appointments SET reason_for_visit = ? WHERE id = ?',
              [firstReason, appointment.id]
            );
          } catch {
            // If it's not valid JSON, leave it as is
            continue;
          }
        }
      }
    } else {
      // For PostgreSQL, MySQL, etc.
      // Change column type back to TEXT
      await queryRunner.changeColumn(
        'appointments',
        'reason_for_visit',
        new TableColumn({
          name: 'reason_for_visit',
          type: 'text',
          isNullable: false,
        })
      );

      // Convert JSON array back to first element
      await queryRunner.query(`
        UPDATE appointments
        SET reason_for_visit = JSON_EXTRACT(reason_for_visit, '$[0]')
        WHERE reason_for_visit IS NOT NULL
      `);
    }
  }
}
