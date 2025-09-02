import type { ScheduleEntry } from '../types';

export const convertScheduleBlocksToEntries = (scheduleBlocks: any[]): ScheduleEntry[] => {
  const entries = scheduleBlocks?.map(block => ({
    date: block.date, // Already in YYYY-MM-DD format
    details: block.doctorName, // Only doctor name, no time
    note: block.schedulePattern,
    doctorId: block.doctorId // Include doctor ID for filtering
  })) || [];
  
  console.log('🔄 [DEBUG] Converting schedule blocks to entries:', {
    inputBlocks: scheduleBlocks?.length || 0,
    outputEntries: entries.length,
    sampleEntries: entries.slice(0, 3)
  });
  
  return entries;
};