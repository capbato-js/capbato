import { useCallback } from 'react';
import { container } from 'tsyringe';
import { TOKENS } from '@nx-starter/application-shared';
import type { IDoctorApiService } from '../../../../infrastructure/api/IDoctorApiService';

export const useDoctorActions = (refreshData: () => Promise<void>) => {
  const doctorApiService = container.resolve<IDoctorApiService>(TOKENS.DoctorApiService);

  const handleDoctorChange = useCallback(async (
    date: string, 
    newDoctorId: string, 
    newDoctorName: string
  ) => {
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
      console.error('❌ Failed to update doctor assignment');
    }
  }, [doctorApiService, refreshData]);

  return {
    handleDoctorChange,
  };
};