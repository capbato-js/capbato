// Test the date filtering logic
const today = new Date();
console.log('Today is:', today.toISOString().split('T')[0]);

const testDates = [
  '2025-07-06T16:00:00.000Z', // Today (July 6)
  '2025-07-05T16:00:00.000Z', // Yesterday (July 5)
  '2025-07-07T16:00:00.000Z'  // Tomorrow (July 7)
];

function isToday(dateString) {
  if (!dateString) return false;
  const testDate = new Date(dateString);
  return testDate.getFullYear() === today.getFullYear() &&
         testDate.getMonth() === today.getMonth() &&
         testDate.getDate() === today.getDate();
}

console.log('\nTesting date filtering:');
testDates.forEach(date => {
  const testDate = new Date(date);
  console.log(`${date} (${testDate.toDateString()}) -> isToday: ${isToday(date)}`);
});

// Test with sample lab data
const sampleLabData = [
  { patient_id: 'P1', date: '2025-07-06T10:00:00.000Z', status: 'Complete' },
  { patient_id: 'P2', date: '2025-07-05T16:00:00.000Z', status: 'Complete' },
  { patient_id: 'P3', date: '2025-07-06T14:30:00.000Z', status: 'Complete' }
];

const todaysTests = sampleLabData.filter(test => isToday(test.date));
console.log(`\nFiltered ${todaysTests.length} test(s) for today out of ${sampleLabData.length} total tests`);
todaysTests.forEach(test => {
  console.log(`- ${test.patient_id}: ${test.date}`);
});
