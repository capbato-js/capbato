import db from '../config/db.js';
import { validateContactNumbers, sanitizePhoneNumber } from '../utils/phoneValidation.js';

export async function getPatientById(req, res) {
  const patientId = req.params.id;

  const sql = `
    SELECT 
      PatientID, FirstName, MiddleName, LastName, Gender, Age, DateOfBirth,
      ContactNumber, Address,
      GuardianName, GuardianGender, GuardianRelationship, GuardianContactNumber, GuardianAddress
    FROM patients
    WHERE PatientID = ?
  `;

  try {
    const [result] = await db.query(sql, [patientId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = result[0];

    for (const key in patient) {
      if (typeof patient[key] === 'string') {
        patient[key] = patient[key].toUpperCase();
      }
    }

    res.json(patient);
  } catch (error) {
    console.error('❌ Error fetching patient by ID:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}

export async function getPatients(req, res) {
  const sql = `
    SELECT 
      PatientID,
      FirstName,
      MiddleName,
      LastName,
      DATE_FORMAT(DateOfBirth, '%Y-%m-%d') AS date_of_birth 
    FROM patients
    ORDER BY LastName ASC;
  `;

  try {
    const [result] = await db.query(sql);
    
    // Optionally capitalize names here if not done in DB
    const formatted = result.map((p) => ({
      ...p,
      FirstName: (p.FirstName || "").toUpperCase(),
      MiddleName: (p.MiddleName || "").toUpperCase(),
      LastName: (p.LastName || "").toUpperCase(),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching patients:', error.message);
    res.status(500).json({ error: error.message });
  }
}


export async function addPatient(req, res) {
  console.log("🟡 Backend Received Data:", req.body);

  const {
    lastname,
    firstname,
    middlename,
    dob,
    age,
    gender,
    contact,
    address,
    guardian_name,
    guardian_gender,
    guardian_relationship,
    guardian_contact,
    guardian_address
  } = req.body;

  // Validate contact numbers
  const contactValidationErrors = validateContactNumbers({
    'Patient contact number': contact,
    'Guardian contact number': guardian_contact
  });

  if (contactValidationErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Invalid contact number format', 
      details: contactValidationErrors 
    });
  }

  // Sanitize contact numbers
  const sanitizedContact = sanitizePhoneNumber(contact);
  const sanitizedGuardianContact = sanitizePhoneNumber(guardian_contact);

  const firstLetter = (lastname || '')[0].toUpperCase();

  try {
    // Generate PatientID with current year prefix
    const currentYear = new Date().getFullYear();
    const patientIdPrefix = `${currentYear}-${firstLetter}`;
    
    const countSql = `
      SELECT COUNT(*) AS count
      FROM patients
      WHERE PatientID LIKE '${patientIdPrefix}%'
    `;

    const [countResult] = await db.query(countSql);
    const count = countResult[0].count + 1;
    const patientId = `${patientIdPrefix}${count}`;

    const patientData = [
      patientId,
      (lastname || '').toUpperCase(),
      (firstname || '').toUpperCase(),
      (middlename || '').toUpperCase(),
      dob,
      age,
      (gender || '').toUpperCase(),
      sanitizedContact,
      (address || '').toUpperCase(),
      (guardian_name || '').toUpperCase(),
      (guardian_gender || '').toUpperCase(),
      (guardian_relationship || '').toUpperCase(),
      sanitizedGuardianContact,
      (guardian_address || '').toUpperCase()
    ];

    const sql = `
      INSERT INTO patients 
      (PatientID, LastName, FirstName, MiddleName, DateOfBirth, Age, Gender, ContactNumber, Address,
       GuardianName, GuardianGender, GuardianRelationship, GuardianContactNumber, GuardianAddress) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, patientData);
    console.log("✅ New patient added successfully!");
    res.json({ message: "Patient added successfully!", patient_id: patientId });

  } catch (error) {
    console.error("❌ Error adding patient:", error.message);
    res.status(500).json({ error: "Failed to add patient", details: error.message });
  }
}

export async function getTotalPatients(req, res) {
  const sql = `SELECT COUNT(*) AS total FROM patients`;

  try {
    const [result] = await db.query(sql);
    res.json({ total: result[0].total });
  } catch (error) {
    console.error('❌ Error fetching total patients:', error.message);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
}

export async function searchPatients(req, res) {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Name query required" });

  const sql = `
    SELECT 
      PatientID AS id,
      CONCAT(FirstName, ' ', IFNULL(MiddleName, ''), ' ', LastName) AS name,
      Age AS age,
      Gender AS gender
    FROM patients
    WHERE FirstName LIKE ? OR MiddleName LIKE ? OR LastName LIKE ?
    LIMIT 10
  `;

  const wildcard = `%${name}%`;

  try {
    const [results] = await db.query(sql, [wildcard, wildcard, wildcard]);

    const formatted = results.map(p => ({
      ...p,
      name: p.name.trim(),
      gender: (p.gender || '').toUpperCase()
    }));

    res.json(formatted);
  } catch (error) {
    console.error('❌ Error searching patients:', error.message);
    res.status(500).json({ error: "DB error", details: error.message });
  }
}
