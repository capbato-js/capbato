import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🧹 Starting global test setup...');
  
  // Clear any existing backend data before starting tests
  const API_BASE_URL = 'http://localhost:4000';
  
  // Wait for backend to be available
  let backendReady = false;
  const maxAttempts = 30; // 30 seconds
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        backendReady = true;
        break;
      }
    } catch (error) {
      // Backend not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  if (!backendReady) {
    console.error('❌ Backend not available after 30 seconds');
    return;
  }
  
  // Clear backend data using test endpoint
  try {
    // Clear todos
    const todoResponse = await fetch(`${API_BASE_URL}/api/test/todos`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (todoResponse.ok) {
      console.log('✅ Todo backend data cleared');
    }

    // Clear patients - just check if any exist since there's no DELETE endpoint
    const patientsResponse = await fetch(`${API_BASE_URL}/api/patients`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (patientsResponse.ok) {
      const patientsData = await patientsResponse.json();
      if (patientsData.success && Array.isArray(patientsData.data) && patientsData.data.length > 0) {
        console.log(`ℹ️ Found ${patientsData.data.length} existing patients (no DELETE endpoint available)`);
      } else {
        console.log('✅ No existing patients found');
      }
    }
  } catch (error) {
    console.warn('⚠️  Failed to clear backend data:', error);
  }
  
  console.log('✅ Global test setup complete');
}

export default globalSetup;