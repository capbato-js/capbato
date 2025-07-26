import express from 'express';
import { getProvinces, getCities, getBarangays } from '../controllers/address.controller.js';

const router = express.Router();

/**
 * @swagger
 * /address/provinces:
 *   get:
 *     summary: Get all provinces in the Philippines
 *     tags: [Address]
 *     responses:
 *       200:
 *         description: List of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: Province code
 *                   name:
 *                     type: string
 *                     description: Province name
 */
router.get('/provinces', getProvinces);

/**
 * @swagger
 * /address/cities/{provinceCode}:
 *   get:
 *     summary: Get cities/municipalities by province
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: provinceCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Province code
 *     responses:
 *       200:
 *         description: List of cities/municipalities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: City/municipality code
 *                   name:
 *                     type: string
 *                     description: City/municipality name
 */
router.get('/cities/:provinceCode', getCities);

/**
 * @swagger
 * /address/barangays/{cityCode}:
 *   get:
 *     summary: Get barangays by city/municipality
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: cityCode
 *         required: true
 *         schema:
 *           type: string
 *         description: City/municipality code
 *     responses:
 *       200:
 *         description: List of barangays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: Barangay code
 *                   name:
 *                     type: string
 *                     description: Barangay name
 */
router.get('/barangays/:cityCode', getBarangays);

export default router;
