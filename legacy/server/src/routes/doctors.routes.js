import express from 'express';
import { getDoctors } from '../controllers/doctors.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctor management endpoints
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of all doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Doctor ID
 *                   first_name:
 *                     type: string
 *                     description: Doctor first name
 *                   last_name:
 *                     type: string
 *                     description: Doctor last name
 *                   specialization:
 *                     type: string
 *                     description: Doctor specialization
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Doctor email
 *                   phone:
 *                     type: string
 *                     description: Doctor phone number
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getDoctors);
export default router;
