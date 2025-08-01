import { Patient, PatientDetails, GuardianDetails, Appointment } from '../features/patients/types';

// Calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const mockPatients: Patient[] = [
  {
    id: '1',
    patientNumber: 'P001',
    firstName: 'Maria',
    lastName: 'Santos',
    fullName: 'Maria Santos',
    dateOfBirth: '1990-05-15',
    age: calculateAge('1990-05-15'),
    gender: 'Female',
    phoneNumber: '+63 912 345 6789',
    email: 'maria.santos@email.com',
    address: {
      street: '123 Rizal Street',
      city: 'Quezon City',
      province: 'Metro Manila',
      zipCode: '1100'
    },
    emergencyContact: {
      name: 'Juan Santos',
      relationship: 'Husband',
      phoneNumber: '+63 917 123 4567'
    },
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Penicillin'],
    bloodType: 'O+',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-12-15T14:30:00.000Z'
  },
  {
    id: '2',
    patientNumber: 'P002',
    firstName: 'Jose',
    lastName: 'Reyes',
    fullName: 'Jose Reyes',
    dateOfBirth: '1985-08-22',
    age: calculateAge('1985-08-22'),
    gender: 'Male',
    phoneNumber: '+63 920 987 6543',
    email: 'jose.reyes@email.com',
    address: {
      street: '456 Bonifacio Avenue',
      city: 'Makati City',
      province: 'Metro Manila',
      zipCode: '1200'
    },
    emergencyContact: {
      name: 'Rosa Reyes',
      relationship: 'Mother',
      phoneNumber: '+63 918 765 4321'
    },
    medicalHistory: ['Asthma'],
    allergies: ['Shellfish', 'Dust'],
    bloodType: 'A+',
    createdAt: '2024-02-10T10:15:00.000Z',
    updatedAt: '2024-12-10T16:20:00.000Z'
  },
  {
    id: '3',
    patientNumber: 'P003',
    firstName: 'Ana',
    lastName: 'Cruz',
    fullName: 'Ana Cruz',
    dateOfBirth: '1995-12-03',
    age: calculateAge('1995-12-03'),
    gender: 'Female',
    phoneNumber: '+63 915 234 5678',
    email: 'ana.cruz@email.com',
    address: {
      street: '789 Del Pilar Street',
      city: 'Pasig City',
      province: 'Metro Manila',
      zipCode: '1600'
    },
    emergencyContact: {
      name: 'Pedro Cruz',
      relationship: 'Father',
      phoneNumber: '+63 919 876 5432'
    },
    medicalHistory: [],
    allergies: [],
    bloodType: 'B+',
    createdAt: '2024-03-05T11:00:00.000Z',
    updatedAt: '2024-12-05T09:45:00.000Z'
  },
  {
    id: '4',
    patientNumber: 'P004',
    firstName: 'Carlos',
    lastName: 'Garcia',
    fullName: 'Carlos Garcia',
    dateOfBirth: '1978-01-18',
    age: calculateAge('1978-01-18'),
    gender: 'Male',
    phoneNumber: '+63 925 111 2222',
    email: 'carlos.garcia@email.com',
    address: {
      street: '321 Mabini Street',
      city: 'Taguig City',
      province: 'Metro Manila',
      zipCode: '1630'
    },
    emergencyContact: {
      name: 'Elena Garcia',
      relationship: 'Wife',
      phoneNumber: '+63 926 333 4444'
    },
    medicalHistory: ['High Cholesterol', 'Heart Disease'],
    allergies: ['Codeine'],
    bloodType: 'AB+',
    createdAt: '2024-04-12T08:30:00.000Z',
    updatedAt: '2024-12-12T13:15:00.000Z'
  },
  {
    id: '5',
    patientNumber: 'P005',
    firstName: 'Sofia',
    lastName: 'Mendoza',
    fullName: 'Sofia Mendoza',
    dateOfBirth: '2000-07-29',
    age: calculateAge('2000-07-29'),
    gender: 'Female',
    phoneNumber: '+63 917 555 6666',
    email: 'sofia.mendoza@email.com',
    address: {
      street: '654 Luna Street',
      city: 'Mandaluyong City',
      province: 'Metro Manila',
      zipCode: '1550'
    },
    emergencyContact: {
      name: 'Carmen Mendoza',
      relationship: 'Mother',
      phoneNumber: '+63 918 777 8888'
    },
    medicalHistory: ['Migraine'],
    allergies: ['Latex'],
    bloodType: 'O-',
    createdAt: '2024-05-20T12:00:00.000Z',
    updatedAt: '2024-12-20T15:00:00.000Z'
  },
  {
    id: '6',
    patientNumber: 'P006',
    firstName: 'Miguel',
    lastName: 'Fernandez',
    fullName: 'Miguel Fernandez',
    dateOfBirth: '1992-11-14',
    age: calculateAge('1992-11-14'),
    gender: 'Male',
    phoneNumber: '+63 922 999 0000',
    email: 'miguel.fernandez@email.com',
    address: {
      street: '987 Aguinaldo Street',
      city: 'San Juan City',
      province: 'Metro Manila',
      zipCode: '1500'
    },
    emergencyContact: {
      name: 'Isabella Fernandez',
      relationship: 'Sister',
      phoneNumber: '+63 923 111 2222'
    },
    medicalHistory: ['Kidney Stone'],
    allergies: ['Peanuts'],
    bloodType: 'A-',
    createdAt: '2024-06-08T14:45:00.000Z',
    updatedAt: '2024-12-08T11:30:00.000Z'
  },
  {
    id: '7',
    patientNumber: 'P007',
    firstName: 'Carmen',
    lastName: 'Torres',
    fullName: 'Carmen Torres',
    dateOfBirth: '1988-04-07',
    age: calculateAge('1988-04-07'),
    gender: 'Female',
    phoneNumber: '+63 916 333 4444',
    email: 'carmen.torres@email.com',
    address: {
      street: '147 Magsaysay Avenue',
      city: 'Caloocan City',
      province: 'Metro Manila',
      zipCode: '1400'
    },
    emergencyContact: {
      name: 'Roberto Torres',
      relationship: 'Husband',
      phoneNumber: '+63 914 555 6666'
    },
    medicalHistory: ['Thyroid Disease'],
    allergies: ['Iodine'],
    bloodType: 'B-',
    createdAt: '2024-07-14T09:15:00.000Z',
    updatedAt: '2024-12-14T16:45:00.000Z'
  },
  {
    id: '8',
    patientNumber: 'P008',
    firstName: 'Ricardo',
    lastName: 'Villanueva',
    fullName: 'Ricardo Villanueva',
    dateOfBirth: '1975-09-25',
    age: calculateAge('1975-09-25'),
    gender: 'Male',
    phoneNumber: '+63 921 777 8888',
    email: 'ricardo.villanueva@email.com',
    address: {
      street: '258 Katipunan Avenue',
      city: 'Muntinlupa City',
      province: 'Metro Manila',
      zipCode: '1770'
    },
    emergencyContact: {
      name: 'Lucia Villanueva',
      relationship: 'Wife',
      phoneNumber: '+63 924 999 0000'
    },
    medicalHistory: ['Arthritis', 'Back Pain'],
    allergies: ['Aspirin'],
    bloodType: 'AB-',
    createdAt: '2024-08-22T13:20:00.000Z',
    updatedAt: '2024-12-22T10:10:00.000Z'
  }
];

// Mock patient details with guardian and appointments data
export const mockPatientDetails: PatientDetails[] = mockPatients.map((patient, index) => {
  const guardians: GuardianDetails[] = [
    {
      fullName: 'Anjela Depanes',
      gender: 'Male',
      relationship: 'Aaa',
      contactNumber: '9083421788',
      address: 'Ph 4 Pkg 5 Blk 34 Lot 17'
    },
    {
      fullName: 'Roberto Santos',
      gender: 'Male',
      relationship: 'Father',
      contactNumber: '9171234567',
      address: '123 Rizal Street, Quezon City'
    },
    {
      fullName: 'Carmen Reyes',
      gender: 'Female',
      relationship: 'Mother',
      contactNumber: '9187654321',
      address: '456 Bonifacio Avenue, Makati City'
    },
    {
      fullName: 'Pedro Cruz',
      gender: 'Male',
      relationship: 'Father',
      contactNumber: '9198765432',
      address: '789 Del Pilar Street, Pasig City'
    },
    {
      fullName: 'Maria Garcia',
      gender: 'Female',
      relationship: 'Mother',
      contactNumber: '9263334444',
      address: '321 Mabini Street, Taguig City'
    },
    {
      fullName: 'Carmen Mendoza',
      gender: 'Female',
      relationship: 'Mother',
      contactNumber: '9187778888',
      address: '654 Luna Street, Mandaluyong City'
    },
    {
      fullName: 'Luis Fernandez',
      gender: 'Male',
      relationship: 'Father',
      contactNumber: '9231112222',
      address: '987 Aguinaldo Street, San Juan City'
    },
    {
      fullName: 'Ana Torres',
      gender: 'Female',
      relationship: 'Mother',
      contactNumber: '9145556666',
      address: '147 Magsaysay Avenue, Caloocan City'
    }
  ];

  const appointmentsSets: Appointment[][] = [
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-06-29',
        time: '11:00',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      },
      {
        id: `${patient.id}-apt2`,
        date: '2025-05-21',
        time: '08:00',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      },
      {
        id: `${patient.id}-apt3`,
        date: '2025-05-20',
        time: '08:00',
        reasonForVisit: 'Consultation',
        labTestsDone: 'N/A',
        prescriptions: 'N/A',
        status: 'Confirmed'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-07-15',
        time: '09:30',
        reasonForVisit: 'Follow-up',
        labTestsDone: 'Blood Test',
        prescriptions: 'Antibiotics',
        status: 'Confirmed'
      },
      {
        id: `${patient.id}-apt2`,
        date: '2025-06-10',
        time: '14:00',
        reasonForVisit: 'Check-up',
        labTestsDone: 'X-ray',
        prescriptions: 'Pain Relief',
        status: 'Completed'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-08-05',
        time: '10:15',
        reasonForVisit: 'Annual Physical',
        labTestsDone: 'Complete Blood Count',
        prescriptions: 'Vitamins',
        status: 'Pending'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-07-22',
        time: '16:30',
        reasonForVisit: 'Cardiac Assessment',
        labTestsDone: 'ECG, Lipid Profile',
        prescriptions: 'Statin, Beta Blocker',
        status: 'Confirmed'
      },
      {
        id: `${patient.id}-apt2`,
        date: '2025-06-15',
        time: '11:45',
        reasonForVisit: 'Follow-up',
        labTestsDone: 'Blood Pressure',
        prescriptions: 'ACE Inhibitor',
        status: 'Completed'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-09-10',
        time: '13:20',
        reasonForVisit: 'Migraine Treatment',
        labTestsDone: 'MRI',
        prescriptions: 'Sumatriptan',
        status: 'Confirmed'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-08-18',
        time: '15:00',
        reasonForVisit: 'Kidney Stone Follow-up',
        labTestsDone: 'Ultrasound',
        prescriptions: 'Pain Medication',
        status: 'Pending'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-07-30',
        time: '12:30',
        reasonForVisit: 'Thyroid Check',
        labTestsDone: 'TSH, T3, T4',
        prescriptions: 'Levothyroxine',
        status: 'Confirmed'
      }
    ],
    [
      {
        id: `${patient.id}-apt1`,
        date: '2025-09-25',
        time: '09:00',
        reasonForVisit: 'Arthritis Management',
        labTestsDone: 'Joint X-ray',
        prescriptions: 'Anti-inflammatory',
        status: 'Confirmed'
      }
    ]
  ];

  return {
    ...patient,
    guardian: guardians[index % guardians.length],
    appointments: appointmentsSets[index % appointmentsSets.length]
  };
});

// Helper function to get patient details by ID
export const getPatientDetailsById = (id: string): PatientDetails | undefined => {
  return mockPatientDetails.find(patient => patient.id === id);
};
