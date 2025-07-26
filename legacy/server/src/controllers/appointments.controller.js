import db from '../config/db.js';
import { validatePhilippineMobile } from '../utils/phoneValidation.js';

export async function getAppointments(req, res) {
  const query = `
  SELECT 
    appointments.id,
    appointments.patient_id,
    CONCAT(patients.LastName, ', ', patients.FirstName, ' ', COALESCE(patients.MiddleName, '')) AS patient_name,
    appointments.reason_for_visit,
    DATE_FORMAT(appointments.appointment_date, '%Y-%m-%d') AS appointment_date,
    appointments.appointment_time,
    appointments.status,
    appointments.doctor_name
  FROM appointments
  JOIN patients ON appointments.patient_id = patients.PatientID
`;

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error fetching appointments:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function getAppointmentsByPatientId(req, res) {
  const patientId = req.params.id;
  const sql = `
    SELECT 
      id, reason_for_visit, appointment_date, appointment_time, status
    FROM appointments
    WHERE patient_id = ?
    ORDER BY appointment_date DESC, appointment_time DESC
  `;

  try {
    const [result] = await db.query(sql, [patientId]);
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching appointments by Patient #:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
}

export async function addAppointment(req, res) {
  console.log("Received POST /appointments/add with:", req.body);

  const {
    patient_id = '',
    patient_name,
    reason_for_visit,
    appointment_date,
    appointment_time,
    doctor_name,
    status // ← ✅ add this line
  } = req.body;

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time || !patient_id) {
    return res.status(400).json({ error: 'All fields including valid Patient # are required' });
  }

  const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
  const now = new Date();
  if (appointmentDateTime < now) {
    return res.status(400).json({ error: 'Cannot book a past time slot.' });
  }

  try {
    // Verify patient exists and get contact number
    const verifyPatientQuery = `SELECT ContactNumber FROM patients WHERE PatientID = ? LIMIT 1`;
    const [patientResult] = await db.query(verifyPatientQuery, [patient_id]);

    if (patientResult.length === 0) {
      return res.status(400).json({ error: 'Patient does not exist in the database.' });
    }

    const contact_number = patientResult[0].ContactNumber || patientResult[0].contact_number || '';

    // Validate the contact number format from database
    if (contact_number && !validatePhilippineMobile(contact_number)) {
      console.warn(`Invalid contact number format found in database for patient ${patient_id}: ${contact_number}`);
    }

    // Check for duplicate appointment for the same patient on the same date
    const duplicateCheckQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE patient_id = ? AND appointment_date = ? AND status = 'Confirmed'
    `;
    const [dupResults] = await db.query(duplicateCheckQuery, [patient_id, appointment_date]);

    if (dupResults[0].count > 0) {
      return res.status(400).json({ error: 'This patient already has an appointment for that day.' });
    }

    // Check if time slot is available
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE appointment_date = ? AND appointment_time = ? AND status = 'Confirmed'
    `;
    const [timeResults] = await db.query(checkQuery, [appointment_date, appointment_time]);

    const count = timeResults[0].count;
    if (count >= 1) {
      return res.status(400).json({ error: 'This time slot is already booked.' });
    }

    // Insert the appointment
    const insertQuery = `
      INSERT INTO appointments (patient_id, patient_name, reason_for_visit, appointment_date, appointment_time, status, contact_number, doctor_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(
      insertQuery,
      [patient_id, patient_name, reason_for_visit, appointment_date, appointment_time, status, contact_number, doctor_name]
    );

    res.status(201).json({
      message: 'Appointment added successfully!',
      id: result.insertId,
    });

  } catch (error) {
    console.error('❌ Error adding appointment:', error.message);
    res.status(500).json({ error: 'Failed to insert appointment' });
  }
}

export async function updateAppointment(req, res) {
  const appointmentId = req.params.id;
  const {
    patient_id = '',
    patient_name,
    reason_for_visit,
    appointment_date,
    appointment_time,
    status,
    doctor_name
  } = req.body;

  if (!patient_name || !reason_for_visit || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Get patient contact number
    const getPatientQuery = `
      SELECT ContactNumber
      FROM patients
      WHERE PatientID = ?
      LIMIT 1
    `;
    const [patientResult] = await db.query(getPatientQuery, [patient_id]);

    const contact_number = patientResult.length > 0 ? patientResult[0].ContactNumber : '';

    // Validate the contact number format from database
    if (contact_number && !validatePhilippineMobile(contact_number)) {
      console.warn(`Invalid contact number format found in database for patient ${patient_id}: ${contact_number}`);
    }

    // Check for duplicate appointment (same patient, same date, different appointment)
    const duplicateCheckQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE patient_id = ? AND appointment_date = ? AND id != ? AND status = 'Confirmed'
    `;
    const [dupResults] = await db.query(duplicateCheckQuery, [patient_id, appointment_date, appointmentId]);

    if (dupResults[0].count > 0) {
      return res.status(400).json({ error: 'This patient already has another appointment on the same day.' });
    }

    // Check time slot availability
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM appointments
      WHERE appointment_date = ? AND appointment_time = ? AND id != ? AND status = 'Confirmed'
    `;
    const [timeResults] = await db.query(checkQuery, [appointment_date, appointment_time, appointmentId]);

    const count = timeResults[0].count;

    if (count >= 4) {
      return res.status(400).json({ error: 'This time slot is already fully booked.' });
    }

    // Update the appointment
    const updateQuery = `
      UPDATE appointments 
      SET patient_id = ?, patient_name = ?, reason_for_visit = ?, appointment_date = ?, appointment_time = ?, status = ?, contact_number = ?, doctor_name = ?
      WHERE id = ?
    `;

    await db.query(updateQuery, [
      patient_id,
      patient_name,
      reason_for_visit,
      appointment_date,
      appointment_time,
      status,
      contact_number,
      doctor_name,
      appointmentId,
    ]);

    res.status(200).json({ message: 'Appointment updated successfully!' });

  } catch (error) {
    console.error('❌ Error updating appointment:', error.message);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
}

export async function cancelAppointment(req, res) {
  const appointmentId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    if (status === "Confirmed") {
      // Get appointment details
      const getDetailsQuery = 'SELECT appointment_date, appointment_time FROM appointments WHERE id = ?';
      const [appointmentResults] = await db.query(getDetailsQuery, [appointmentId]);

      if (appointmentResults.length === 0) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const { appointment_date, appointment_time } = appointmentResults[0];

      // Check if time slot is available for confirmation
      const checkQuery = `
        SELECT COUNT(*) AS count
        FROM appointments
        WHERE appointment_date = ? AND appointment_time = ? AND status = 'Confirmed'
      `;
      const [countResults] = await db.query(checkQuery, [appointment_date, appointment_time]);

      const confirmedCount = countResults[0].count;
      if (confirmedCount >= 4) {
        return res.status(400).json({ error: 'This time slot is already fully booked. Please choose another.' });
      }

      // Update appointment status to confirmed
      const updateQuery = 'UPDATE appointments SET status = ? WHERE id = ?';
      await db.query(updateQuery, [status, appointmentId]);

      res.json({ message: 'Appointment reconfirmed successfully!' });
    } else {
      // Update appointment status (cancel/reschedule)
      const updateQuery = 'UPDATE appointments SET status = ? WHERE id = ?';
      await db.query(updateQuery, [status, appointmentId]);

      res.json({ message: 'Appointment cancelled successfully!' });
    }
  } catch (error) {
    console.error('❌ Error updating appointment status:', error.message);
    res.status(500).json({ error: 'Failed to update appointment status.' });
  }
}

export async function getTodayConfirmedAppointments(req, res) {
  const sql = `
    SELECT COUNT(*) AS total 
    FROM appointments 
    WHERE DATE(appointment_date) = CURDATE() AND status = 'Confirmed'
  `;

  try {
    const [result] = await db.query(sql);
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('❌ Error fetching today\'s confirmed appointments:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}

export async function getTodayAppointments(req, res) {
  const sql = `
    SELECT 
      appointments.patient_id, 
      appointments.patient_name, 
      appointments.reason_for_visit, 
      appointments.contact_number, 
      appointments.appointment_time, 
      appointments.status,
      appointments.doctor_name
    FROM appointments
    WHERE DATE(appointments.appointment_date) = CURDATE() AND appointments.status = 'Confirmed'
    ORDER BY appointments.appointment_time ASC
  `;

  try {
    const [result] = await db.query(sql);
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching today's appointments:", error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}


export async function getWeeklyAppointmentSummary(req, res) {
  const sql = `
    SELECT appointment_date AS date, COUNT(*) AS count
    FROM appointments
    WHERE status = 'Confirmed'
      AND appointment_date >= CURDATE() - INTERVAL 6 DAY
    GROUP BY appointment_date
    ORDER BY appointment_date
  `;

  try {
    const [results] = await db.query(sql);
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error fetching weekly summary:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}

