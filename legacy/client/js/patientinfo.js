// patientinfo.js (fully updated with UI-matched lab requests)

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const patientId = urlParams.get("patient_id");

  if (!patientId) {
    alert("No Patient # provided!");
    return;
  }

  try {
    const response = await fetch(`https://capstone-legacy.up.railway.app/patients/${patientId}`);
    const data = await response.json();

    if (response.ok) {
      document.getElementById("patientID").textContent = data.PatientID || "N/A";
      document.getElementById("fullName").textContent = formatName(`${data.FirstName || ""} ${data.MiddleName || ""} ${data.LastName || ""}`);
      document.getElementById("gender").textContent = formatWord(data.Gender || "N/A");
      document.getElementById("age").textContent = data.Age || "N/A";
      document.getElementById("dob").textContent = formatDate(data.DateOfBirth) || "N/A";
      document.getElementById("contact").textContent = data.ContactNumber || "N/A";
      document.getElementById("address").textContent = formatAddressDisplay(formatSentence(data.Address)) || "N/A";

      document.getElementById("guardianFullName").textContent = formatName(data.GuardianName) || "N/A";
      document.getElementById("guardianGender").textContent = formatWord(data.GuardianGender || "N/A");
      document.getElementById("guardianRelationship").textContent = formatWord(data.GuardianRelationship || "N/A");
      document.getElementById("guardianContact").textContent = data.GuardianContactNumber || "N/A";
      document.getElementById("guardianAddress").textContent = formatAddressDisplay(formatSentence(data.GuardianAddress)) || "N/A";
    } else {
      alert("Error: " + (data.error || "Failed to fetch patient data"));
    }
  } catch (error) {
    console.error("Error fetching patient data:", error);
    alert("An error occurred while retrieving patient details.");
  }

  const patientInfoTab = document.getElementById("patientInfoTab");
  const medicalTab = document.getElementById("medicalTab");
  const appointmentTab = document.getElementById("appointmentTab");
  const prescriptionTab = document.getElementById("prescriptionTab");
  const laboratoryTab = document.getElementById("laboratoryTab");

  const patientInfoContent = document.getElementById("patientInfoContent");
  const medicalContent = document.getElementById("medicalContent");
  const appointmentContent = document.getElementById("appointmentContent");

  patientInfoTab.addEventListener("click", () => {
    hideTabs();
    patientInfoTab.classList.add("active");
    patientInfoContent.style.display = "block";
  });

  medicalTab.addEventListener("click", () => {
    hideTabs();
    medicalTab.classList.add("active");
    medicalContent.style.display = "block";
  });

  appointmentTab.addEventListener("click", () => {
    hideTabs();
    appointmentTab.classList.add("active");
    appointmentContent.style.display = "block";
    loadAppointmentsForPatient();
  });

  prescriptionTab.addEventListener("click", () => {
    hideTabs();
    prescriptionTab.classList.add("active");
  });

  laboratoryTab.addEventListener("click", () => {
    hideTabs();
    laboratoryTab.classList.add("active");
    renderLabTestsForPatient(patientId);
  });

  function hideTabs() {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    const patientInfoContent = document.getElementById("patientInfoContent");
    if (patientInfoContent) patientInfoContent.style.display = "none";
    if (medicalContent) medicalContent.style.display = "none";
    if (appointmentContent) appointmentContent.style.display = "none";
    const labContainer = document.getElementById("labResultContainer");
    if (labContainer) labContainer.remove();
  }

  function loadAppointmentsForPatient() {
    const tbody = document.getElementById("appointmentListBody");
    tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

    fetch(`https://capstone-legacy.up.railway.app/appointments/patient/${patientId}`)
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = "";

        if (!data.length) {
          tbody.innerHTML = `<tr><td colspan="6">No appointments found.</td></tr>`;
          return;
        }

        data.forEach(app => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${formatDate(app.appointment_date)}</td>
            <td>${formatTime(app.appointment_time)}</td>
            <td>${app.reason_for_visit}</td>
            <td>${app.lab_tests_done || 'N/A'}</td>
            <td>${app.prescriptions || 'N/A'}</td>
            <td>${app.status}</td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => {
        console.error("Failed to fetch appointments:", err);
        tbody.innerHTML = `<tr><td colspan="6" style="color:red;">Error loading data</td></tr>`;
      });
  }

  function renderLabTestsForPatient(patientId) {
    fetch("https://capstone-legacy.up.railway.app/api/lab_requests")
      .then(res => res.json())
      .then(data => {
        const labData = data.filter(lab => String(lab.patient_id) === String(patientId));
        const container = document.createElement("div");
        container.id = "labResultContainer";
        container.classList.add("tab-content");
        container.innerHTML = `
          <h3>Laboratory Requests</h3>
          <table class="appointment-table">
            <thead><tr><th>Test</th><th>Date</th><th>Status</th></tr></thead>
            <tbody id="labResultsTableBody"></tbody>
          </table>
        `;
        document.querySelector(".right-actions-container").appendChild(container);

        const tbody = document.getElementById("labResultsTableBody");

        if (!labData.length) {
          tbody.innerHTML = `<tr><td colspan="3">No lab requests found.</td></tr>`;
          return;
        }

        labData.forEach(req => {
          const date = req.request_date || req.date;
          const formattedDate = formatDate(date);
          const testNames = [];

          Object.entries(req).forEach(([key, val]) => {
            if (val === "yes") testNames.push(key.replace(/_/g, " ").toUpperCase());
          });

          tbody.innerHTML += `
            <tr>
              <td>${testNames.join(", ")}</td>
              <td>${formattedDate}</td>
              <td>${req.status || "Pending"}</td>
            </tr>
          `;
        });
      });
  }
});

// ========== Utilities ==========

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return "N/A";
  return date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatName(name) {
  return name
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .trim();
}

function formatWord(word) {
  const lower = word.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatSentence(sentence) {
  return sentence
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = ((h + 11) % 12 + 1);
  return `${hour12}:${minute} ${suffix}`;
}

// Function to parse and format address for better display
function formatAddressDisplay(addressString) {
  if (!addressString || addressString === "N/A") {
    return "N/A";
  }
  
  // If address contains commas, assume it's already in the detailed format
  if (addressString.includes(',')) {
    return addressString;
  }
  
  // For existing single-line addresses, just return as is
  return addressString;
}

function goBack() {
  if (document.referrer.includes("patients.html")) {
    window.location.href = "patients.html";
  } else {
    window.history.back();
  }
}

// Navigation buttons
document.getElementById("patientbtn").addEventListener("click", () => {
  window.location.href = "patients.html";
});
document.getElementById("dashboardbtn").addEventListener("click", () => {
  window.location.href = "index.html";
});
document.getElementById("appointmentbtn").addEventListener("click", () => {
  window.location.href = "appointments.html";
});
document.getElementById("laboratorybtn").addEventListener("click", () => {
  window.location.href = "laboratory.html";
});
document.getElementById("prescriptionbtn").addEventListener("click", () => {
  window.location.href = "prescriptions.html";
});
document.getElementById("schedulebtn").addEventListener("click", () => {
  window.location.href = "doctor-schedule.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("loggedInRole");
  const username = localStorage.getItem("loggedInUsername");

  const roleDisplay = document.getElementById("roleDisplay");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const profileAvatar = document.getElementById("profileAvatar");

  if (role && roleDisplay) {
    roleDisplay.textContent = role.toUpperCase();
  }

  if (username && usernameDisplay) {
    usernameDisplay.textContent = username;
  }

  // Profile Avatar Setup
  if (username && profileAvatar) {
    const firstLetter = username.charAt(0).toUpperCase();
    profileAvatar.textContent = firstLetter;
    
    // Generate random color based on username
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A6F', '#0ABDE3', '#006BA6', '#F79F1F',
      '#A3CB38', '#FDA7DF', '#12CBC4', '#ED4C67', '#F79F1F'
    ];
    
    // Use username hash to consistently assign same color
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    profileAvatar.style.backgroundColor = colors[colorIndex];
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
});
