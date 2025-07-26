import express from 'express';
import { getSchedules, addSchedule, updateSchedule, deleteSchedule, getDoctorForToday } from '../controllers/schedule.controller.js';

const router = express.Router();

router.get("/", getSchedules);
router.post("/", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);
router.get("/today", getDoctorForToday);

export default router;
