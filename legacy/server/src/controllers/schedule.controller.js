import db from '../config/db.js';

// GET all schedules
export const getSchedules = async (req, res) => {
  const sql = "SELECT id, doctor_name, date, time FROM doctor_schedule ORDER BY date";
  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (error) {
    console.error('❌ Error fetching schedules:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// POST new schedule
export const addSchedule = async (req, res) => {
  const { doctor, date, time } = req.body;

  if (!doctor || !date || !time) {
    return res.status(400).json({ error: "Missing doctor, date, or time" });
  }

  const sql = "INSERT INTO doctor_schedule (doctor_name, date, time) VALUES (?, ?, ?)";
  try {
    const [result] = await db.query(sql, [doctor, date, time]);
    res.status(201).json({ message: "Schedule added", id: result.insertId });
  } catch (error) {
    console.error('❌ Error adding schedule:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// PUT update schedule
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { doctor, date, time } = req.body;

  if (!doctor || !date || !time) {
    return res.status(400).json({ error: "Missing doctor, date, or time" });
  }

  const sql = "UPDATE doctor_schedule SET doctor_name = ?, date = ?, time = ? WHERE id = ?";
  try {
    await db.query(sql, [doctor, date, time, id]);
    res.json({ message: "Schedule updated" });
  } catch (error) {
    console.error('❌ Error updating schedule:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// DELETE schedule
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM doctor_schedule WHERE id = ?", [id]);
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    console.error('❌ Error deleting schedule:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Add this function
export const getDoctorForToday = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const sql = "SELECT doctor_name FROM doctor_schedule WHERE date = ? LIMIT 1";

  try {
    const [results] = await db.query(sql, [today]);
    if (results.length === 0) return res.json({ doctor_name: "N/A" });
    res.json(results[0]);
  } catch (error) {
    console.error('❌ Error fetching today\'s doctor:', error.message);
    res.status(500).json({ error: error.message });
  }
};
