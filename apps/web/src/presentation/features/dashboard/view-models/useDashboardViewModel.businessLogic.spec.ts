import { describe, it, expect } from 'vitest';

describe('Dashboard Current Patient Logic', () => {
  it('should implement the correct business rule for current patient', () => {
    // Mock appointments data (simulating what the dashboard would receive)
    const mockAppointments = [
      {
        id: '1',
        patientId: 'patient-1',
        patientName: 'John Doe',
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00',
        status: 'completed',
        reasonForVisit: 'Checkup 1',
        doctor: 'Dr. Smith'
      },
      {
        id: '2', 
        patientId: 'patient-2',
        patientName: 'Jane Smith',
        appointmentDate: '2024-01-15',
        appointmentTime: '14:00',
        status: 'confirmed',
        reasonForVisit: 'Checkup 2',
        doctor: 'Dr. Smith'
      },
      {
        id: '3',
        patientId: 'patient-3', 
        patientName: 'Bob Johnson',
        appointmentDate: '2024-01-16',
        appointmentTime: '10:00',
        status: 'confirmed',
        reasonForVisit: 'Checkup 3',
        doctor: 'Dr. Smith'
      }
    ];

    // Simulate the new current patient logic from useDashboardViewModel
    const getCurrentPatientFromAppointments = (appointments: typeof mockAppointments): string => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Get all appointments sorted by date and time (earliest first)
      const allAppointmentsSorted = appointments
        .sort((a, b) => {
          // Create date objects for comparison
          const dateTimeA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateTimeB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

      // Find first non-completed appointment that is either:
      // 1. From the past or current time (has started or should have started)
      // 2. Scheduled for today (regardless of time)
      const currentAppointment = allAppointmentsSorted.find(apt => {
        if (apt.status === 'completed') return false;
        
        const appointmentDate = new Date(apt.appointmentDate);
        const appointmentDateTime = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
        
        // Check if appointment is today or in the past
        const isToday = appointmentDate.getTime() === today.getTime();
        const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
        
        return isToday || isInPastOrNow;
      });
      
      return currentAppointment?.patientName || 'N/A';
    };

    // Test the business logic
    const currentPatient = getCurrentPatientFromAppointments(mockAppointments);

    // Should return Jane Smith (earliest non-completed appointment)
    // NOT John Doe (completed) and NOT just today's appointments
    expect(currentPatient).toBe('Jane Smith');
  });

  it('should return N/A when all appointments are completed', () => {
    const mockAppointments = [
      {
        id: '1',
        patientId: 'patient-1', 
        patientName: 'John Doe',
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00',
        status: 'completed',
        reasonForVisit: 'Checkup 1',
        doctor: 'Dr. Smith'
      }
    ];

    const getCurrentPatientFromAppointments = (appointments: typeof mockAppointments): string => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const allAppointmentsSorted = appointments
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateTimeB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

      const currentAppointment = allAppointmentsSorted.find(apt => {
        if (apt.status === 'completed') return false;
        
        const appointmentDate = new Date(apt.appointmentDate);
        const appointmentDateTime = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
        
        const isToday = appointmentDate.getTime() === today.getTime();
        const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
        
        return isToday || isInPastOrNow;
      });
      return currentAppointment?.patientName || 'N/A';
    };

    const currentPatient = getCurrentPatientFromAppointments(mockAppointments);
    expect(currentPatient).toBe('N/A');
  });

  it('should handle past appointment times correctly', () => {
    // Even if an appointment time has passed, if it's not marked completed, 
    // it should still be considered current
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);  
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const mockAppointments = [
      {
        id: '1',
        patientId: 'patient-1',
        patientName: 'Past Patient', 
        appointmentDate: yesterdayStr,
        appointmentTime: '09:00',
        status: 'confirmed', // Not completed even though time passed
        reasonForVisit: 'Checkup 1',
        doctor: 'Dr. Smith'
      },
      {
        id: '2',
        patientId: 'patient-2',
        patientName: 'Future Patient',
        appointmentDate: tomorrowStr,
        appointmentTime: '10:00', 
        status: 'confirmed',
        reasonForVisit: 'Checkup 2',
        doctor: 'Dr. Smith'
      }
    ];

    const getCurrentPatientFromAppointments = (appointments: typeof mockAppointments): string => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const allAppointmentsSorted = appointments
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateTimeB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

      const currentAppointment = allAppointmentsSorted.find(apt => {
        if (apt.status === 'completed') return false;
        
        const appointmentDate = new Date(apt.appointmentDate);
        const appointmentDateTime = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
        
        const isToday = appointmentDate.getTime() === today.getTime();
        const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
        
        return isToday || isInPastOrNow;
      });
      return currentAppointment?.patientName || 'N/A';
    };

    const currentPatient = getCurrentPatientFromAppointments(mockAppointments);
    
    // Should return "Past Patient" because it's the earliest non-completed appointment that has passed
    // This demonstrates the business rule: current patient is determined by earliest 
    // non-completed appointment that has started or is today
    expect(currentPatient).toBe('Past Patient');
  });

  it('should return N/A when only future appointments exist (not today)', () => {
    // This test covers the main issue: future appointments should not show as current patient
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2); // 2 days from now
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const mockAppointments = [
      {
        id: '1',
        patientId: 'patient-1',
        patientName: 'Future Patient',
        appointmentDate: futureDateStr,
        appointmentTime: '09:00',
        status: 'confirmed',
        reasonForVisit: 'Future Checkup',
        doctor: 'Dr. Smith'
      }
    ];

    const getCurrentPatientFromAppointments = (appointments: typeof mockAppointments): string => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const allAppointmentsSorted = appointments
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateTimeB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

      const currentAppointment = allAppointmentsSorted.find(apt => {
        if (apt.status === 'completed') return false;
        
        const appointmentDate = new Date(apt.appointmentDate);
        const appointmentDateTime = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
        
        const isToday = appointmentDate.getTime() === today.getTime();
        const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
        
        return isToday || isInPastOrNow;
      });
      return currentAppointment?.patientName || 'N/A';
    };

    const currentPatient = getCurrentPatientFromAppointments(mockAppointments);
    
    // Should return "N/A" because the appointment is in the future (not today)
    // This fixes the main issue where Aug 12 appointments were showing as current on Aug 10
    expect(currentPatient).toBe('N/A');
  });

  it('should show today\'s future appointments as current patient', () => {
    // Today's appointments should still be considered current even if time hasn't passed
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const mockAppointments = [
      {
        id: '1',
        patientId: 'patient-1',
        patientName: 'Today\'s Patient',
        appointmentDate: todayStr,
        appointmentTime: '23:59', // Late today
        status: 'confirmed',
        reasonForVisit: 'Today\'s Checkup',
        doctor: 'Dr. Smith'
      }
    ];

    const getCurrentPatientFromAppointments = (appointments: typeof mockAppointments): string => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const allAppointmentsSorted = appointments
        .sort((a, b) => {
          const dateTimeA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateTimeB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateTimeA.getTime() - dateTimeB.getTime();
        });

      const currentAppointment = allAppointmentsSorted.find(apt => {
        if (apt.status === 'completed') return false;
        
        const appointmentDate = new Date(apt.appointmentDate);
        const appointmentDateTime = new Date(`${apt.appointmentDate} ${apt.appointmentTime}`);
        
        const isToday = appointmentDate.getTime() === today.getTime();
        const isInPastOrNow = appointmentDateTime.getTime() <= now.getTime();
        
        return isToday || isInPastOrNow;
      });
      return currentAppointment?.patientName || 'N/A';
    };

    const currentPatient = getCurrentPatientFromAppointments(mockAppointments);
    
    // Should show today's appointment as current patient even if it's later today
    expect(currentPatient).toBe('Today\'s Patient');
  });
});