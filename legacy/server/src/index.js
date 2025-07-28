import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import { swaggerUi, specs } from './config/swagger.js';

import patientRoutes from './routes/patients.routes.js';
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import laboratoryRoutes from './routes/laboratory.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import usersRoutes from './routes/users.routes.js';
import addressRoutes from './routes/address.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger (for debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Test DB connection
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Clinic Management System API Documentation'
}));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../../client')));

// Root route - serve index.html (must be before indexRoutes)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/pages/index.html'));
});

// Direct HTML file routes (without /pages/ prefix)
const htmlRoutes = [
  'appointments', 'laboratory', 'patients', 'prescriptions', 'login', 
  'register', 'admin', 'accounts', 'doctor-schedule', 'add-appointments',
  'add-new-patient', 'medical-certificate', 'lab-request-form', 'patientinfo',
  'receptionist', 'asreceptionist', 'urinalysis', 'fecalysis', 'hematology',
  'blood-chemistry', 'serology-immunology', 'edit-sched', 'addpatientbtnform',
  'add-prescription-form', 'phone-validation-test', 'index'
];

htmlRoutes.forEach(route => {
  app.get(`/${route}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, `../../client/pages/${route}.html`));
  });
});

// API Routes
app.use('/', indexRoutes);
app.use('/patients', patientRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/api', laboratoryRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/doctors', doctorRoutes);
app.use('/users', usersRoutes);
app.use('/address', addressRoutes);

// API status check
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});
