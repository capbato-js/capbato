import React from 'react';
import { container } from 'tsyringe';
import { MedicalClinicLayout } from '../../../components/layout';
import { DoctorsTable, DoctorScheduleCalendar } from '../components';
import { useDoctorScheduleCalendarViewModel } from '../view-models/useDoctorScheduleCalendarViewModel';
import { DoctorApiService } from '../../../../infrastructure/api/DoctorApiService';
import type { ScheduleEntry } from '../types';

export const DoctorsPage: React.FC = () => {
  // Use the real API integration for doctor schedule data
  const {
    scheduleBlocks,
    error,
    availableDoctors,
    refreshData,
  } = useDoctorScheduleCalendarViewModel();

  // Get DoctorApiService instance
  const doctorApiService = container.resolve(DoctorApiService);

  // Convert doctor schedule blocks to DoctorScheduleCalendar format
  const convertToScheduleEntries = (): ScheduleEntry[] => {
    const entries = scheduleBlocks?.map(block => ({
      date: block.date, // Already in YYYY-MM-DD format
      details: block.doctorName, // Only doctor name, no time
      note: block.schedulePattern,
      doctorId: block.doctorId // Include doctor ID for filtering
    })) || [];
    
    console.log('🔄 [DEBUG] DoctorsPage converting schedule blocks to entries:', {
      inputBlocks: scheduleBlocks.length,
      outputEntries: entries.length,
      sampleEntries: entries.slice(0, 3)
    });
    
    return entries;
  };

    // Handle doctor change for a specific date
  const handleDoctorChange = async (date: string, newDoctorId: string, newDoctorName: string) => {
    console.log('🔄 [DEBUG] Doctor change requested:', { date, newDoctorId, newDoctorName });
    
    try {
      // Get all schedule overrides to find if one exists for this date
      const allOverrides = await doctorApiService.getAllScheduleOverrides();
      const existingOverride = allOverrides.find(override => override.date === date);
      
      if (existingOverride) {
        // Update existing override using PUT
        console.log('🔄 [DEBUG] Updating existing schedule override with ID:', existingOverride.id);
        await doctorApiService.updateScheduleOverride(existingOverride.id, {
          assignedDoctorId: newDoctorId,
          reason: `Manual override: Assigned ${newDoctorName} for ${date}`
        });
        console.log('✅ [DEBUG] Schedule override updated successfully');
      } else {
        // Create new override using POST
        console.log('🔄 [DEBUG] Creating new schedule override...');
        await doctorApiService.createScheduleOverride({
          date,
          assignedDoctorId: newDoctorId,
          reason: `Manual override: Assigned ${newDoctorName} for ${date}`
        });
        console.log('✅ [DEBUG] Schedule override created successfully');
      }
      
      // Refresh the schedule data to reflect the change
      await refreshData();
      
      // Show success notification
      console.log(`✅ Successfully assigned ${newDoctorName} for ${date}`);
      
    } catch (error) {
      console.error('❌ [DEBUG] Error creating/updating schedule override:', error);
      
      // Show error notification
      console.error('❌ Failed to update doctor assignment');
    }
  };

  const scheduleEntries = convertToScheduleEntries();

  return (
    <MedicalClinicLayout>
      {/* Doctors Table */}
      <DoctorsTable />
      
      {/* Doctor's Schedule Calendar - Shows doctor availability based on schedule patterns */}
      <DoctorScheduleCalendar 
        schedules={error ? [] : scheduleEntries}
        availableDoctors={availableDoctors}
        onDoctorChange={handleDoctorChange}
      />
    </MedicalClinicLayout>
  );
};