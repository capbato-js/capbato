import express from 'express';
import {
  addAppointment,
  cancelAppointment,
  getAppointments,
  updateAppointment,
  getTodayConfirmedAppointments,
  getTodayAppointments,
  getAppointmentsByPatientId,
  getWeeklyAppointmentSummary
} from '../controllers/appointments.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management endpoints
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of all appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getAppointments);

/**
 * @swagger
 * /appointments/add:
 *   post:
 *     summary: Add a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient_id
 *               - doctor_id
 *               - appointment_date
 *             properties:
 *               patient_id:
 *                 type: integer
 *                 description: Patient ID
 *               doctor_id:
 *                 type: integer
 *                 description: Doctor ID
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date and time
 *               notes:
 *                 type: string
 *                 description: Appointment notes
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/add', addAppointment);

/**
 * @swagger
 * /appointments/cancel/{id}:
 *   put:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/cancel/:id', cancelAppointment);

/**
 * @swagger
 * /appointments/update/{id}:
 *   put:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *                 description: Appointment date and time
 *               notes:
 *                 type: string
 *                 description: Appointment notes
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: Appointment status
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Appointment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/update/:id', updateAppointment);

/**
 * @swagger
 * /appointments/today/confirmed:
 *   get:
 *     summary: Get today's confirmed appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of today's confirmed appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/today/confirmed', getTodayConfirmedAppointments);

/**
 * @swagger
 * /appointments/today:
 *   get:
 *     summary: Get today's appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of today's appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/today', getTodayAppointments);

/**
 * @swagger
 * /appointments/patient/{id}:
 *   get:
 *     summary: Get appointments for a specific patient
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of patient's appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Patient not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/patient/:id', getAppointmentsByPatientId);

/**
 * @swagger
 * /appointments/weekly-summary:
 *   get:
 *     summary: Get weekly appointment summary
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Weekly appointment summary data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weekly_summary:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       day:
 *                         type: string
 *                         description: Day of the week
 *                       count:
 *                         type: integer
 *                         description: Number of appointments
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/weekly-summary', getWeeklyAppointmentSummary);



export default router;
