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

  const addPrescriptionBtn = document.getElementById("addPrescriptionBtn");
  const actionsHeader = document.getElementById("actionsHeader");
  const actionsCells = document.querySelectorAll(".actionsCell");
  if (role && role.toLowerCase() !== "doctor") {
    if (addPrescriptionBtn) addPrescriptionBtn.style.display = "none";
    if (actionsHeader) actionsHeader.style.display = "none";
    actionsCells.forEach(cell => cell.style.display = "none");
  } else if (addPrescriptionBtn) {
    // Only for doctor: keep Add Prescription button visible, but disable its function
    addPrescriptionBtn.addEventListener("click", () => {
      // Do nothing (form will not open)
    });
    // Remove addPrescriptionToTable exposure
    window.addPrescriptionToTable = undefined;
  }

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

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("prescriptionsTableBody");

  if (searchInput && tableBody) {
    searchInput.addEventListener("input", function() {
      const searchTerm = this.value.toLowerCase();
      const rows = tableBody.getElementsByTagName("tr");

      Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? "" : "none";
      });
    });
  }


  // Add Prescription Overlay
  const addPrescriptionOverlay = document.getElementById("addPrescriptionOverlay");
  const addPrescriptionIframe = document.getElementById("addPrescriptionIframe");
  const closeAddPrescription = document.getElementById("closeAddPrescription");

  // Remove overlay open logic for Add Prescription button

  if (closeAddPrescription && addPrescriptionOverlay) {
    closeAddPrescription.addEventListener("click", () => {
      addPrescriptionOverlay.style.display = "none";
      if (addPrescriptionIframe) {
        addPrescriptionIframe.src = "";
      }
    });
  }

  // Action buttons functionality
  const actionButtons = document.querySelectorAll(".action-btn");
  actionButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      const action = this.classList.contains("view-btn") ? "view" : 
                    this.classList.contains("edit-btn") ? "edit" : "delete";
      const row = this.closest("tr");
      const prescriptionId = row.cells[0].textContent;

      switch(action) {
        case "view":
          showToast(`Viewing prescription ${prescriptionId}`, "info");
          break;
        case "edit":
          showToast(`Editing prescription ${prescriptionId}`, "info");
          break;
        case "delete":
          showConfirmationModal(`Are you sure you want to delete prescription ${prescriptionId}?`, () => {
            // Delete logic here
            row.remove();
            showToast(`Prescription ${prescriptionId} deleted successfully!`, "success");
          });
          break;
      }
    });
  });

  // Confirmation Modal
  const confirmationModal = document.getElementById("confirmationModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  let confirmCallback = null;

  function showConfirmationModal(message, callback) {
    const confirmationText = document.getElementById("confirmationText");
    if (confirmationText) {
      confirmationText.textContent = message;
    }
    confirmationModal.classList.remove("hidden");
    confirmCallback = callback;
  }

  if (confirmYes) {
    confirmYes.addEventListener("click", () => {
      confirmationModal.classList.add("hidden");
      if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
      }
    });
  }

  if (confirmNo) {
    confirmNo.addEventListener("click", () => {
      confirmationModal.classList.add("hidden");
      confirmCallback = null;
    });
  }

  // Toast notification
  function showToast(message, type = "success") {
    const toast = document.getElementById("toastNotification");
    const toastMessage = document.getElementById("toastMessage");
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.remove("hidden", "error");
      
      if (type === "error") {
        toast.classList.add("error");
      }
      
      setTimeout(() => {
        toast.classList.add("hidden");
      }, 3000);
    }
  }

  // Close overlay when clicking outside
  if (addPrescriptionOverlay) {
    addPrescriptionOverlay.addEventListener("click", function(e) {
      if (e.target === addPrescriptionOverlay) {
        addPrescriptionOverlay.style.display = "none";
        if (addPrescriptionIframe) {
          addPrescriptionIframe.src = "";
        }
      }
    });
  }

  // Close modal when clicking outside
  if (confirmationModal) {
    confirmationModal.addEventListener("click", function(e) {
      if (e.target === confirmationModal) {
        confirmationModal.classList.add("hidden");
        confirmCallback = null;
      }
    });
  }

  // Inject Accounts button for admin if not present
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
