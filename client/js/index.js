// ✅ index.js (Updated): Dashboard shows Doctor, Current Patient, Total Appointments only

document.addEventListener("DOMContentLoaded", () => {

  // Robust role/username/profile avatar display (matches medical-certificate.js logic)
  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const profileAvatar = document.getElementById("profileAvatar");
  let loggedInRole = localStorage.getItem('loggedInRole') || sessionStorage.getItem('loggedInRole');
  let loggedInUsername = localStorage.getItem('loggedInUsername') || sessionStorage.getItem('loggedInUsername');
  if (roleDisplay && loggedInRole) {
    roleDisplay.textContent = loggedInRole.charAt(0).toUpperCase() + loggedInRole.slice(1);
    roleDisplay.classList.add("ms-auto");
  }
  if (usernameDisplay && loggedInUsername) {
    usernameDisplay.textContent = loggedInUsername;
  }
  if (profileAvatar && loggedInUsername) {
    const initials = loggedInUsername.split(' ').map(n => n[0]).join('').toUpperCase();
    profileAvatar.textContent = initials;
    // Generate random color based on username
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    const colorIndex = loggedInUsername.charCodeAt(0) % colors.length;
    profileAvatar.style.backgroundColor = colors[colorIndex];
  }

  // Check if user is a doctor to show lab results section
  const labResultsSection = document.getElementById('labResultsSection');
  if (loggedInRole && loggedInRole.toLowerCase() === 'doctor') {
    // Show lab results section for doctors
    if (labResultsSection) {
      labResultsSection.style.display = 'block';
    }
  } else {
    // Hide lab results section for non-doctors
    if (labResultsSection) {
      labResultsSection.style.display = 'none';
    }
  }

  // Profile Dropdown Functionality
  const profileDropdown = document.getElementById("profileDropdown");
  const settingsOption = document.getElementById("settingsOption");
  const logoutOption = document.getElementById("logoutOption");

  // Toggle dropdown when avatar is clicked
  if (profileAvatar && profileDropdown) {
    profileAvatar.addEventListener("click", function(e) {
      e.stopPropagation();
      profileDropdown.classList.toggle("hidden");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function(e) {
    if (profileDropdown && !profileDropdown.classList.contains("hidden")) {
      profileDropdown.classList.add("hidden");
    }
  });

  // Settings option click handler
  if (settingsOption) {
    settingsOption.addEventListener("click", function() {
      profileDropdown.classList.add("hidden");
      // TODO: Implement settings functionality
      alert("Settings functionality coming soon!");
    });
  }

  // Logout option click handler
  if (logoutOption) {
    logoutOption.addEventListener("click", function() {
      profileDropdown.classList.add("hidden");
      
      // Clear localStorage
      localStorage.removeItem("loggedInRole");
      localStorage.removeItem("loggedInUsername");
      localStorage.removeItem("isLoggedIn");
      
      // Redirect to login page
      window.location.href = "login.html";
    });
  }

  // Sidebar navigation for all static HTML pages (no extra JS file needed)
  const sidebarLinks = [
    { id: 'dashboardbtn', page: 'index.html' },
    { id: 'appointmentbtn', page: 'appointments.html' },
    { id: 'patientbtn', page: 'patients.html' },
    { id: 'laboratorybtn', page: 'laboratory.html' },
    { id: 'prescriptionbtn', page: 'prescriptions.html' },
    { id: 'schedulebtn', page: 'doctor-schedule.html' }
  ];
  if (loggedInRole && loggedInRole.toLowerCase() === 'admin') {
    sidebarLinks.push({ id: 'accountsbtn', page: 'accounts.html' });
  }
  sidebarLinks.forEach(link => {
    const el = document.getElementById(link.id);
    if (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        window.location.href = link.page;
      });
    }
  });

  updateTodayDate();
  fetchDoctorOfDay();
  refreshDashboardData();
  fetchCurrentPatient();
  loadLabTestResults(); // ✅ Add this line

  // Auto-refresh every 10 seconds
  setInterval(refreshDashboardData, 10000);
  setInterval(fetchCurrentPatient, 10000);
  setInterval(loadLabTestResults, 30000); // ✅ Refresh lab results every 30 seconds

  initializeLabModal(); // Initialize lab modal functionality
  
  // Handle messages from lab forms in iframe
  window.addEventListener("message", (event) => {
    if (event.data.action === "closeLabOverlay") {
      closeLabOverlay();
      
      // Refresh lab results if needed
      if (event.data.actionType === "updateLabTable") {
        loadLabTestResults();
      }
    }
  });
});

function updateTodayDate() {
  const today = new Date();
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formatted = today.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  const dateElement = document.getElementById('today-date');
  if (dateElement) {
    dateElement.textContent = formatted;
  }
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12 + 1);
  return `${hour12}:${minute} ${suffix}`;
}

function formatName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function refreshDashboardData() {
  fetch('http://localhost:3001/appointments/today/confirmed')
    .then(res => res.json())
    .then(data => {
      const count = document.getElementById('todayAppointmentsCount');
      if (count) count.textContent = data.total;
    })
    .catch(err => console.error("Error fetching today's total confirmed appointments:", err));

  fetch('http://localhost:3001/appointments/today')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('todayAppointmentsBody');
      if (!tbody) return;

      tbody.innerHTML = '';

      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      data
        .filter(appointment => {
          const [h, m] = appointment.appointment_time.split(':').map(Number);
          const apptMinutes = h * 60 + m;
          return apptMinutes >= nowMinutes;
        })
        .forEach(appointment => {
          const formattedName = formatName(appointment.patient_name);

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${appointment.patient_id || 'N/A'}</td>
            <td>
              <a href="patientinfo.html?patient_id=${appointment.patient_id}" class="patient-link">
                ${formattedName}
              </a>
            </td>
            <td>${appointment.reason_for_visit}</td>
            <td>${appointment.contact_number}</td>
            <td>${formatTime(appointment.appointment_time)}</td>
            <td>${appointment.doctor_name || 'N/A'}</td>
            <td>${appointment.status}</td>
          `;

          tbody.appendChild(row);
        });
    })
    .catch(err => console.error("Error loading today's appointments:", err));
}

function fetchCurrentPatient() {
  fetch('http://localhost:3001/appointments/today')
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const currentTimeStr = now.toTimeString().slice(0, 5); // "HH:MM"

      let closest = null;
      let minDiff = Infinity;

      data.forEach(appt => {
        const [h, m] = appt.appointment_time.split(':');
        const apptDate = new Date();
        apptDate.setHours(+h, +m, 0, 0);

        const diff = Math.abs(apptDate - now);
        if (apptDate <= now && diff < minDiff) {
          minDiff = diff;
          closest = appt;
        }
      });

      const display = document.getElementById("currentPatient");
      if (display) {
        display.textContent = closest ? formatName(closest.patient_name) : "N/A";
      }
    })
    .catch(err => {
      console.error("Error fetching current patient:", err);
      const display = document.getElementById("currentPatient");
      if (display) display.textContent = "Error";
    });
}

function fetchDoctorOfDay() {
  // For now, return static doctor name
  // This can be enhanced later with actual doctor assignment logic
  const doctorElement = document.getElementById('doctor-of-day');
  if (doctorElement) {
    doctorElement.textContent = 'Dr. Smith (Assigned)';
  }
}

function loadLabTestResults() {
  // Only load lab results for doctors
  const loggedInRole = localStorage.getItem('loggedInRole') || sessionStorage.getItem('loggedInRole');
  if (!loggedInRole || loggedInRole.toLowerCase() !== 'doctor') {
    return;
  }

  fetch('http://localhost:3001/api/lab_requests/completed')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('labTestResultsBody');
      if (!tbody) return;

      tbody.innerHTML = '';

      // Filter for today's lab tests only
      const todaysTests = data.filter(test => isToday(test.date));

      if (todaysTests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No completed lab tests for today</td></tr>';
        return;
      }

      console.log(`Found ${todaysTests.length} lab test(s) completed today`);

      todaysTests.forEach(test => {
        const formattedName = formatName(test.patient_name);
        const formattedDate = formatDate(test.date);

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${test.patient_id}</td>
          <td>
            <a href="patientinfo.html?patient_id=${test.patient_id}" class="patient-link">
              ${formattedName}
            </a>
          </td>
          <td>${test.lab_test}</td>
          <td>${formattedDate}</td>
          <td><span class="status-badge status-complete">${test.status}</span></td>
          <td>
            <button id="temp-dashboard-view-btn" class="btn btn-sm btn-info view-lab-btn btn-view" 
                    data-patient-id="${test.patient_id}" 
                    data-patient-name="${test.patient_name}"
                    data-lab-test="${test.lab_test}">
              View
            </button>
          </td>
        `;

        tbody.appendChild(row);
      });

      // Add click event listeners for View buttons
      tbody.querySelectorAll('.view-lab-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const patientId = this.dataset.patientId;
          const patientName = this.dataset.patientName;
          const labTest = this.dataset.labTest;
          
          // Determine the test type from the lab test string
          const testType = determineTestType(labTest);
          
          console.log('Dashboard View clicked:', { patientId, patientName, labTest, testType });
          
          try {
            // Fetch the lab request details
            const response = await fetch(`http://localhost:3001/api/lab_requests/${patientId}`);
            const labData = await response.json();
            
            if (labData && labData.patient_id) {
              // Prepare lab object for modal
              const labForModal = {
                id: labData.id,
                patient_id: patientId,
                patient_name: patientName,
                request_date: labData.request_date || new Date().toISOString().split('T')[0],
                selectedTests: [testType],
                readOnly: true // Mark as read-only
              };
              
              console.log('Opening modal with lab data:', labForModal);
              openLabOverlay(labForModal);
            } else {
              console.error('No lab data found for patient:', patientId);
              alert('Lab test data not found');
            }
          } catch (error) {
            console.error('Error fetching lab data:', error);
            alert('Error loading lab test data');
          }
        });
      });
    })
    .catch(err => {
      console.error("Error loading lab test results:", err);
      const tbody = document.getElementById('labTestResultsBody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">Error loading lab results</td></tr>';
      }
    });
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function isToday(dateString) {
  if (!dateString) return false;
  
  const testDate = new Date(dateString);
  const today = new Date();
  
  return testDate.getFullYear() === today.getFullYear() &&
         testDate.getMonth() === today.getMonth() &&
         testDate.getDate() === today.getDate();
}

function determineTestType(labTestString) {
  if (!labTestString) return 'fbs'; // default fallback
  
  const testString = labTestString.toLowerCase();
  
  // Map test names to form types
  if (testString.includes('urinalysis')) return 'urinalysis';
  if (testString.includes('fecalysis')) return 'fecalysis';
  if (testString.includes('cbc') || testString.includes('platelet')) return 'cbc_with_platelet';
  if (testString.includes('hepa b')) return 'hepa_b_screening';
  if (testString.includes('hepa a')) return 'hepa_a_screening';
  if (testString.includes('hepatitis')) return 'hepatitis_profile';
  if (testString.includes('vdrl') || testString.includes('rpr')) return 'vdrl_rpr';
  if (testString.includes('dengue')) return 'dengue_ns1';
  if (testString.includes('ca 125') || testString.includes('cea') || testString.includes('psa')) return 'ca_125_cea_psa';
  
  // Blood chemistry tests (most common, so check these last)
  if (testString.includes('fbs') || testString.includes('bun') || testString.includes('creatinine') || 
      testString.includes('uric acid') || testString.includes('lipid') || testString.includes('sgot') || 
      testString.includes('sgpt') || testString.includes('alp') || testString.includes('sodium') || 
      testString.includes('potassium') || testString.includes('hba1c')) {
    return 'fbs';
  }
  
  return 'fbs'; // default fallback to blood chemistry
}

// ===== LAB MODAL FUNCTIONALITY =====

// Initialize modal event listeners when DOM is loaded
function initializeLabModal() {
  const closeOverlayBtn = document.getElementById("closeOverlayBtn");
  const overlay = document.getElementById("labOverlay");

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener("click", closeLabOverlay);
  }

  // Close overlay when clicking outside the modal
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeLabOverlay();
      }
    });
  }

  // Close overlay with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("show")) {
      closeLabOverlay();
    }
  });
}

// Open lab overlay modal (similar to laboratory.js openLabOverlay function)
function openLabOverlay(lab) {
  console.log('Opening lab overlay for lab:', lab);
  
  const iframe = document.getElementById("labIframe");
  const overlay = document.getElementById("labOverlay");

  if (!iframe || !overlay) {
    console.error('Modal elements not found');
    return;
  }

  // Map test fields to form files (same mapping as laboratory.js)
  const formMap = {
    // ROUTINE
    urinalysis: "urinalysis.html",
    fecalysis: "fecalysis.html",

    // BLOOD CHEMISTRY
    fbs: "blood-chemistry.html", 

    // SEROLOGY
    hepa_b_screening: "serology-immunology.html",
    hepa_a_screening: "serology-immunology.html",
    hepatitis_profile: "serology-immunology.html",
    vdrl_rpr: "serology-immunology.html",
    dengue_ns1: "serology-immunology.html",
    ca_125_cea_psa: "serology-immunology.html",

    // HEMATOLOGY (e.g., CBC)
    cbc_with_platelet: "hematology.html"
  };

  // Determine which form to load based on first test field key
  const selectedKey = (lab.selectedTests && lab.selectedTests.length > 0) 
    ? lab.selectedTests[0] 
    : "fbs"; // default fallback
  const targetForm = formMap[selectedKey] || "blood-chemistry.html"; // fallback

  console.log('Loading form:', targetForm, 'for test:', selectedKey);

  overlay.classList.add("show");
  iframe.src = targetForm;

  iframe.onload = () => {
    setTimeout(() => {
      console.log('Sending postMessage to iframe:', lab);
      iframe.contentWindow.postMessage({
        type: "openLabForm",
        ...lab
      }, "*");
    }, 100);
  };
}

// Close lab overlay modal
function closeLabOverlay() {
  const overlay = document.getElementById("labOverlay");
  const iframe = document.getElementById("labIframe");
  
  if (overlay) {
    overlay.classList.remove("show");
  }
  if (iframe) {
    iframe.src = ""; // Clear iframe source
  }
}
