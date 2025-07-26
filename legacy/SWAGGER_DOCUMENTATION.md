# Swagger UI Implementation - Clinic Management System

## Overview
This document provides information about the Swagger UI implementation for the Clinic Management System API.

## Access Swagger UI
Once the server is running, you can access the interactive API documentation at:
```
http://localhost:3001/api-docs
```

## Features Implemented

### 📚 API Documentation
- **Interactive Documentation**: Full Swagger UI interface with expandable endpoints
- **Try It Out**: Test API endpoints directly from the documentation
- **Schema Definitions**: Comprehensive data models for all entities
- **Authentication Support**: Bearer token authentication ready

### 🔗 Documented Endpoints

#### Patients (`/patients`)
- `GET /patients` - Get all patients
- `GET /patients/search` - Search patients by name, phone, or email
- `GET /patients/total` - Get total patient count
- `GET /patients/{id}` - Get patient by ID
- `POST /patients/add-patient` - Add a new patient

#### Authentication (`/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

#### Appointments (`/appointments`)
- `GET /appointments` - Get all appointments
- `POST /appointments/add` - Add a new appointment
- `PUT /appointments/cancel/{id}` - Cancel an appointment
- `PUT /appointments/update/{id}` - Update an appointment
- `GET /appointments/today/confirmed` - Get today's confirmed appointments
- `GET /appointments/today` - Get today's appointments
- `GET /appointments/patient/{id}` - Get appointments for a specific patient
- `GET /appointments/weekly-summary` - Get weekly appointment summary

#### Users (`/users`)
- `GET /users` - Get all users
- `POST /users` - Create a new user
- `PUT /users/{id}/password` - Change user password

#### General (`/`)
- `GET /` - Welcome message

### 🏗️ Data Models
The following schemas are defined:
- **Patient**: Complete patient information model
- **NewPatient**: Model for creating new patients
- **Appointment**: Appointment data structure
- **User**: User account information
- **LoginRequest/LoginResponse**: Authentication models
- **Error/Success**: Standard response models

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure your database:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
CLINIC_DB_HOST=localhost
CLINIC_DB_USER=root
CLINIC_DB_PASSWORD=your_password
CLINIC_DB_NAME=clinic_management_system
PORT=3001
```

### 3. Start the Server
Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 4. Access Documentation
Open your browser and navigate to:
```
http://localhost:3001/api-docs
```

## Using the Swagger UI

### 🔍 Exploring Endpoints
1. **Browse by Tags**: Endpoints are organized by functional areas (Patients, Appointments, etc.)
2. **View Details**: Click on any endpoint to see detailed information
3. **Check Schemas**: Scroll down to see request/response schemas

### 🧪 Testing Endpoints
1. **Expand an Endpoint**: Click on the endpoint you want to test
2. **Click "Try it out"**: This enables the testing interface
3. **Fill Parameters**: Enter required parameters and request body data
4. **Execute**: Click "Execute" to make the API call
5. **View Results**: See the response code, headers, and body

### 🔐 Authentication
For endpoints that require authentication:
1. Click the "Authorize" button at the top of the page
2. Enter your Bearer token in the format: `Bearer your_jwt_token_here`
3. Click "Authorize"
4. Now you can test protected endpoints

## Customization

### Adding New Endpoints
To document new endpoints, add JSDoc comments above your route definitions:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   get:
 *     summary: Description of your endpoint
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
router.get('/your-endpoint', yourController);
```

### Adding New Schemas
Add new data models in `/src/config/swagger.js` under the `components.schemas` section.

## Troubleshooting

### Common Issues
1. **Swagger UI not loading**: Ensure the server is running on the correct port
2. **Endpoints not showing**: Check that JSDoc comments are properly formatted
3. **Database connection errors**: Verify your `.env` configuration

### Server Logs
Check the console output when starting the server. You should see:
```
✅ Server running at http://localhost:3001
📚 API Documentation available at http://localhost:3001/api-docs
```

## Next Steps

### Potential Enhancements
1. **Add more endpoints**: Document remaining routes (doctors, schedules, laboratory)
2. **Request/Response examples**: Add example data for better understanding
3. **API versioning**: Implement versioning strategy
4. **Rate limiting documentation**: Document any rate limiting policies
5. **Authentication flows**: Add OAuth2 or other authentication flows

### Integration with Frontend
The Swagger documentation can help frontend developers understand:
- Available endpoints and their purposes
- Required request formats
- Expected response structures
- Error handling patterns

## Support
For questions or issues with the API documentation, please check:
1. This README file
2. The interactive Swagger UI at `/api-docs`
3. Server console logs for any errors
