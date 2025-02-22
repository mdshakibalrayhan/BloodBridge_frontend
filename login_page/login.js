document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const register_tab = document.getElementById("register");
  const login_tab = document.getElementById("login");

  if (token) {
    register_tab.style.display = "none";
    login_tab.style.display = "none";
  } else {
    register_tab.style.display = "block";
    login_tab.style.display = "block";
  }

  if (form) {
    form.addEventListener("submit", logInHandler);
  } else {
    console.error("Form not found!");
  }
});

const logInHandler = (event) => {
  event.preventDefault();

  const userData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  console.log(userData);
  fetch("https://bloodbridge-backend-31a2.onrender.com/account/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData), // ✅ Now it's a valid JSON object
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "/index.html";
      } else {
        alert("Login failed! Check your credentials.");
      }
    })

    .catch((err) => console.error("Error:", err));
};
