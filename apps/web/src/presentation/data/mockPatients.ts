import { Patient } from '../components/patients/types';

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
