import { LabTest } from '../types';

export const formatTestDisplayName = (test: LabTest): string => {
  // Priority 1: Use testName if available (already formatted from API)
  if (test.testName && test.testName.trim() !== '') {
    return test.testName;
  }
  
  // Priority 2: Use testDisplayNames if available, otherwise fall back to tests
  if (test.testDisplayNames && test.testDisplayNames.length > 0) {
    const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
    const result = `${categoryDisplayName}: ${test.testDisplayNames.join(', ')}`;
    return result;
  }
  
  // Priority 3: Construct from testCategory and tests array
  if (test.tests && test.tests.length > 0) {
    const categoryDisplayName = test.testCategory?.replace('_', ' ') || 'Test';
    const result = `${categoryDisplayName}: ${test.tests.join(', ')}`;
    return result;
  }
  
  // Final fallback
  const result = test.testCategory?.replace('_', ' ') || 'Test: N/A';
  return result;
};

export const getRowClickAction = (
  test: LabTest,
  onViewTest: (test: LabTest) => void,
  onAddResult: (test: LabTest) => void
) => {
  // Check if the test has results to view, otherwise show add result
  if (test.status === 'Confirmed' || test.status === 'Completed') {
    onViewTest(test);
  } else if (test.status === 'Pending') {
    onAddResult(test);
  }
  // Don't do anything for cancelled tests
};