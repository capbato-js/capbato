import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Welcome to the Clinic Management System API!
 */
router.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API!')
})

export default router
