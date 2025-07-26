const buttons = {
  patientbtn: "patients.html",
  dashboardbtn: "index.html",
  appointmentbtn: "appointments.html",
  laboratorybtn: "laboratory.html",
  prescriptionbtn: "prescriptions.html",
  schedulebtn: "doctor-schedule.html"
};

document.addEventListener("DOMContentLoaded", function () {
  // Role & Username Display
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

  // Navigation Setup
  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = url;
      });
    }
  });

  // Add Patient Button - Navigate to dedicated page
  const addPatientBtn = document.querySelector(".add-new-patient-btn");
  
  if (addPatientBtn) {
    addPatientBtn.addEventListener("click", () => {
      window.location.href = "add-new-patient.html";
    });
  }

  loadPatients();

  // Inject Accounts button for admin if not present
  // Use the role variable already declared above
  if (role && role.toLowerCase() === 'admin') {
    const sidebar = document.querySelector('.sidebar .nav-list');
    if (sidebar && !document.getElementById('accountsbtn')) {
      const li = document.createElement('li');
      li.className = 'nav-item';
      li.id = 'accountsbtn';
      li.innerHTML = `
        <i class="fas fa-users-cog nav-icon"></i>
        <span class="nav-text">Accounts</span>
      `;
      sidebar.appendChild(li);
      li.addEventListener('click', () => {
        window.location.href = 'accounts.html';
      });
    }
  }
});

let patientsData = [];

function loadPatients() {
  fetch("http://localhost:3001/patients")
    .then((response) => response.json())
    .then((data) => {
      console.log("API Response:", data);
      patientsData = data;
      renderTable(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderTable(data) {
  const tableBody = document.getElementById("patientTableBody");
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align:center;">No patients found.</td>
      </tr>`;
    return;
  }

  data.forEach((patient) => {

    const first = toTitleCase(patient.FirstName || "");
    const middle = toTitleCase(patient.MiddleName || "");
    const last = toTitleCase(patient.LastName || "");
    const fullName = `${first}${middle ? " " + middle : ""} ${last}`.trim();

    const row = `
      <tr>
        <td>${patient.PatientID}</td>
        <td>
          <a href="patientInfo.html?patient_id=${patient.PatientID}" class="patient-link">
            ${fullName}
          </a>
        </td>
      </tr>`;
    tableBody.innerHTML += row;
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  const filteredData = patientsData.filter((patient) => {
    const fullName = `${patient.LastName} ${patient.FirstName} ${patient.MiddleName}`.toLowerCase();
    return (
      patient.PatientID.toLowerCase().includes(searchText) ||
      fullName.includes(searchText)
    );
  });
  renderTable(filteredData);
});
