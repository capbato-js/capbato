// Sidebar role-based button injection for all pages
// Place this script in every page that uses the sidebar

document.addEventListener('DOMContentLoaded', function() {
  const role = localStorage.getItem('loggedInRole');
  const sidebar = document.querySelector('.sidebar .nav-list');
  if (role && sidebar) {
    if (role.toLowerCase() === 'admin' && !document.getElementById('accountsbtn')) {
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
    // Removed Medical Certificate button for doctor
  }
});
