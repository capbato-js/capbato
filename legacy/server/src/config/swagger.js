import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinic Management System API',
      version: '1.0.0',
      description: 'A comprehensive API for managing clinic operations including patients, appointments, laboratory tests, schedules, doctors, and users.',
      contact: {
        name: 'Clinic Management System',
        email: 'contact@clinicms.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Patient ID'
            },
            first_name: {
              type: 'string',
              description: 'Patient first name'
            },
            last_name: {
              type: 'string',
              description: 'Patient last name'
            },
            date_of_birth: {
              type: 'string',
              format: 'date',
              description: 'Patient date of birth'
            },
            phone: {
              type: 'string',
              description: 'Patient phone number'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Patient email address'
            },
            address: {
              type: 'string',
              description: 'Patient address'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'Patient gender'
            }
          }
        },
        NewPatient: {
          type: 'object',
          required: ['first_name', 'last_name', 'date_of_birth', 'phone'],
          properties: {
            first_name: {
              type: 'string',
              description: 'Patient first name'
            },
            last_name: {
              type: 'string',
              description: 'Patient last name'
            },
            date_of_birth: {
              type: 'string',
              format: 'date',
              description: 'Patient date of birth'
            },
            phone: {
              type: 'string',
              description: 'Patient phone number'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Patient email address'
            },
            address: {
              type: 'string',
              description: 'Patient address'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Other'],
              description: 'Patient gender'
            }
          }
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Appointment ID'
            },
            patient_id: {
              type: 'integer',
              description: 'Patient ID'
            },
            doctor_id: {
              type: 'integer',
              description: 'Doctor ID'
            },
            appointment_date: {
              type: 'string',
              format: 'date-time',
              description: 'Appointment date and time'
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'completed', 'cancelled'],
              description: 'Appointment status'
            },
            notes: {
              type: 'string',
              description: 'Appointment notes'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['admin', 'doctor', 'receptionist'],
              description: 'User role'
            },
            first_name: {
              type: 'string',
              description: 'User first name'
            },
            last_name: {
              type: 'string',
              description: 'User last name'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Username'
            },
            password: {
              type: 'string',
              description: 'Password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
