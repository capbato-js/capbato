function goToLogin() {
  window.location.href = "login.html";
}

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, fullName, username, email, password }),
      });

      const data = await response.json();
      console.log(data)
      document.getElementById("message").textContent = data.message;

      if (response.ok) {
        setTimeout(() => window.location.href = "login.html", 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("message").textContent = "Something went wrong.";
    }
  });

