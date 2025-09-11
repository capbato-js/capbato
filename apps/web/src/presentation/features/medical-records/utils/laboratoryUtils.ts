import { LaboratoryResult } from '../types';

export const transformLabRequestsToResults = (labRequests: any[]): LaboratoryResult[] => {
  if (!Array.isArray(labRequests)) return [];

  // Group lab requests by patient ID
  const patientGroups = labRequests.reduce((groups, labRequest) => {
    const patientId = labRequest.patient.id;
    if (!groups[patientId]) {
      groups[patientId] = [];
    }
    groups[patientId].push(labRequest);
    return groups;
  }, {} as Record<string, typeof labRequests>);

  // Convert each patient group to a single LaboratoryResult
  return Object.values(patientGroups).map(patientLabRequests => {
    const firstRequest = patientLabRequests[0];
    
    // Aggregate status: "Pending" if any test is pending, otherwise "Completed"
    const hasAnyPending = patientLabRequests.some(req => 
      req.status.toLowerCase() === 'pending'
    );
    const aggregatedStatus: LaboratoryResult['status'] = hasAnyPending ? 'Pending' : 'Completed';

    // Collect all test types for this patient
    const allTestTypes = patientLabRequests.flatMap(req => req.selectedTests).filter(Boolean);
    const uniqueTestTypes = [...new Set(allTestTypes)];
    const testType = uniqueTestTypes.length > 0 
      ? uniqueTestTypes.join(', ')
      : 'Laboratory Tests';

    // Use enhanced patient data when available
    let patientNumber = firstRequest.patient.patientNumber || firstRequest.patient.id;
    let patientName = firstRequest.patient.name;
    
    // If we have firstName and lastName, construct full name
    if (firstRequest.patient.firstName && firstRequest.patient.lastName) {
      patientName = `${firstRequest.patient.firstName} ${firstRequest.patient.lastName}`.trim();
    }
    
    // If patientNumber is not available but we have a proper patient ID format, use it
    if (!firstRequest.patient.patientNumber) {
      // Handle potential data swapping issue in legacy data
      if (/^[a-f0-9-]{32,36}$/i.test(firstRequest.patient.id) && /^[0-9-]+$/.test(firstRequest.patient.name)) {
        // Data appears to be swapped
        patientNumber = firstRequest.patient.name;
        if (!firstRequest.patient.firstName && !firstRequest.patient.lastName) {
          patientName = `Patient ${firstRequest.patient.id.substring(0, 8)}...`; // Use part of ID as fallback name
        }
      }
    }

    return {
      id: firstRequest.patient.id, // Use patient ID as the unique identifier
      patientId: firstRequest.patient.id, // Store the actual patient ID for navigation to tests page
      patientNumber,
      patientName,
      testType: testType,
      datePerformed: new Date(firstRequest.requestDate).toLocaleDateString(),
      status: aggregatedStatus,
      results: aggregatedStatus === 'Completed' ? 'Results available' : undefined
    };
  });
};