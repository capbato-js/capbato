document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://capstone-legacy.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        document.getElementById("message").textContent = data.message || "Login failed.";
        return;
      }

      const role = data.role;
      localStorage.setItem("loggedInRole", role);
      localStorage.setItem("loggedInUsername", username);

      // Redirect based on role
      if (role === "admin") {
        window.location.href = "index.html";
      } else if (role === "receptionist") {
        window.location.href = "index.html";
      } else if (role === "doctor") {
        window.location.href = "prescriptions.html";
      } else {
        document.getElementById("message").textContent = "Unknown role.";
      }
    } catch (error) {
      console.error("Login Error:", error);
      document.getElementById("message").textContent = "Login failed.";
    }
  });
});
