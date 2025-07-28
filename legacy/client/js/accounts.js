document.addEventListener('DOMContentLoaded', function() {
  const role = localStorage.getItem('loggedInRole');
  const username = localStorage.getItem('loggedInUsername');

  // Display role and username
  if (role) {
    const roleDisplay = document.getElementById('roleDisplay');
    if (roleDisplay) roleDisplay.textContent = role.toUpperCase();
  }
  if (username) {
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) usernameDisplay.textContent = username;
  }

  // Profile avatar
  const profileAvatar = document.getElementById('profileAvatar');
  if (username && profileAvatar) {
    const firstLetter = username.charAt(0).toUpperCase();
    profileAvatar.textContent = firstLetter;
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#10AC84', '#EE5A6F', '#0ABDE3', '#006BA6', '#F79F1F',
      '#A3CB38', '#FDA7DF', '#12CBC4', '#ED4C67', '#F79F1F'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colorIndex = Math.abs(hash) % colors.length;
    profileAvatar.style.backgroundColor = colors[colorIndex];
  }

  // Profile dropdown
  const profileDropdown = document.getElementById('profileDropdown');
  const settingsOption = document.getElementById('settingsOption');
  const logoutOption = document.getElementById('logoutOption');
  if (profileAvatar && profileDropdown) {
    profileAvatar.addEventListener('click', function(e) {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });
  }
  document.addEventListener('click', function() {
    if (profileDropdown && !profileDropdown.classList.contains('hidden')) {
      profileDropdown.classList.add('hidden');
    }
  });
  if (settingsOption) {
    settingsOption.addEventListener('click', function() {
      profileDropdown.classList.add('hidden');
      alert('Settings functionality coming soon!');
    });
  }
  if (logoutOption) {
    logoutOption.addEventListener('click', function() {
      profileDropdown.classList.add('hidden');
      localStorage.removeItem('loggedInRole');
      localStorage.removeItem('loggedInUsername');
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'login.html';
    });
  }

  // Sidebar navigation
  const buttons = {
    patientbtn: 'patients.html',
    dashboardbtn: 'index.html',
    appointmentbtn: 'appointments.html',
    laboratorybtn: 'laboratory.html',
    prescriptionbtn: 'prescriptions.html',
    schedulebtn: 'doctor-schedule.html',
    accountsbtn: 'accounts.html'
  };
  Object.entries(buttons).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        window.location.href = url;
      });
    }
  });

  // Fetch and render users
  fetch('https://capstone-legacy.up.railway.app/users')
    .then(res => res.json())
    .then(users => {
      const tbody = document.getElementById('accountsTableBody');
      tbody.innerHTML = '';
      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user.full_name}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn btn-sm btn-primary change-password-btn" data-id="${user.id}" data-username="${user.username || ''}"><i class="fas fa-key"></i> Change Password</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      // Attach change password modal logic
      document.querySelectorAll('.change-password-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const userId = this.getAttribute('data-id');
          const username = this.getAttribute('data-username');
          openChangePasswordModal(userId, username);
        });
      });
    })
    .catch(err => {
      const tbody = document.getElementById('accountsTableBody');
      tbody.innerHTML = '<tr><td colspan="3">Failed to load users.</td></tr>';
    });

  // Modal logic for Create Account
  const createBtn = document.getElementById('createAccountBtn');
  const modal = document.getElementById('createAccountModal');
  const closeModal = document.getElementById('closeCreateAccountModal');
  const form = document.getElementById('createAccountForm');
  const errorDiv = document.getElementById('createAccountError');

  if (createBtn && modal) {
    createBtn.onclick = () => { modal.style.display = 'flex'; errorDiv.textContent = ''; };
  }
  if (closeModal && modal) {
    closeModal.onclick = () => { modal.style.display = 'none'; };
  }
  window.onclick = function(event) {
    if (event.target === modal) { modal.style.display = 'none'; }
  };

  function validatePassword(password) {
    // At least 1 uppercase, 1 lowercase, 1 number, 1 symbol, min 8 chars
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  }

  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();
      errorDiv.textContent = '';
      const full_name = document.getElementById('fullNameInput').value.trim();
      const username = document.getElementById('usernameInput').value.trim();
      const password = document.getElementById('passwordInput').value;
      const role = document.getElementById('roleInput').value;
      const email = document.getElementById('emailInput').value.trim();
      const phone = document.getElementById('phoneInput').value.trim();
      // Phone validation: must start with 09 and be 11 digits
      if (!/^09\d{9}$/.test(phone)) {
        errorDiv.textContent = 'Phone number must start with 09 and be exactly 11 digits.';
        return;
      }
      if (!full_name || !username || !password || !role || !email) {
        errorDiv.textContent = 'All fields except phone are required.';
        return;
      }
      if (!validatePassword(password)) {
        errorDiv.textContent = 'Password must be at least 8 characters, contain uppercase, lowercase, number, and symbol.';
        return;
      }
      try {
        const res = await fetch('https://capstone-legacy.up.railway.app/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name, username, password, role, email, phone })
        });
        const data = await res.json();
        if (!res.ok) {
          errorDiv.textContent = data.error || 'Failed to create account.';
        } else {
          modal.style.display = 'none';
          form.reset();
          // Reload users
          location.reload();
        }
      } catch (err) {
        errorDiv.textContent = 'Server error.';
      }
    };
  }

  // Change Password Modal logic
  function openChangePasswordModal(userId, username) {
    let modal = document.getElementById('changePasswordModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'changePasswordModal';
      modal.className = 'overlay';
      modal.style.display = 'flex';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.3)';
      modal.style.zIndex = '2000';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.innerHTML = `
        <div style="background:white; border-radius:16px; padding:32px 24px; min-width:340px; width:370px; box-sizing:border-box; box-shadow:0 8px 32px rgba(0,0,0,0.18); position:relative;">
          <button id="closeChangePasswordModal" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:22px; color:#888; cursor:pointer;"><i class="fas fa-times"></i></button>
          <h3 style="text-align:center; margin-bottom:18px; color:#0b4f6c;">Change Password</h3>
          <form id="changePasswordForm">
            <div class="mb-3">
              <label class="form-label">New Password for <span style="color:#1976d2;">${username || ''}</span></label>
              <input type="password" class="form-control" id="newPasswordInput" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input type="password" class="form-control" id="confirmPasswordInput" required />
            </div>
            <button type="submit" class="add-new-patient-btn" style="width:100%;"><i class="fas fa-key"></i> Change Password</button>
            <div id="changePasswordError" style="color:#d32f2f; margin-top:10px; text-align:center; min-height:22px; word-break:break-word;"></div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.style.display = 'flex';
      modal.querySelector('#changePasswordError').textContent = '';
      modal.querySelector('#newPasswordInput').value = '';
      modal.querySelector('#confirmPasswordInput').value = '';
    }
    // Close modal
    modal.querySelector('#closeChangePasswordModal').onclick = () => { modal.style.display = 'none'; };
    window.onclick = function(event) {
      if (event.target === modal) { modal.style.display = 'none'; }
    };
    // Form submit
    modal.querySelector('#changePasswordForm').onsubmit = async function(e) {
      e.preventDefault();
      const errorDiv = modal.querySelector('#changePasswordError');
      const newPassword = modal.querySelector('#newPasswordInput').value;
      const confirmPassword = modal.querySelector('#confirmPasswordInput').value;
      if (!validatePassword(newPassword)) {
        errorDiv.textContent = 'Password must be at least 8 characters, contain uppercase, lowercase, number, and symbol.';
        return;
      }
      if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        return;
      }
      try {
        const res = await fetch(`https://capstone-legacy.up.railway.app/users/${userId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: newPassword })
        });
        const data = await res.json();
        if (!res.ok) {
          errorDiv.textContent = data.error || 'Failed to change password.';
        } else {
          modal.style.display = 'none';
          alert('Password changed successfully!');
        }
      } catch (err) {
        errorDiv.textContent = 'Server error.';
      }
    };
  }
});
