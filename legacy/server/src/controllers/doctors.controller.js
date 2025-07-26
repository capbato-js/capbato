import db from '../config/db.js';

export async function getDoctors(req, res) {
  const query = `SELECT DoctorID, FirstName, LastName, Specialization, ContactNumber FROM doctors`;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (error) {
    console.error('❌ Error fetching doctors:', error.message);
    res.status(500).json({ error: 'Database error' });
  }
}
