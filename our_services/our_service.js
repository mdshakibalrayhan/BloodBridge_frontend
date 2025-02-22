// This will ensure your code runs after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const register_tab = document.getElementById("register");
  const login_tab = document.getElementById("login");
  const profile_tab = document.getElementById("profile");
  const logout_tab = document.getElementById("logout");
  const add_event = document.getElementById("add-event");
  if (token) {
    register_tab.style.display = "none";
    login_tab.style.display = "none";
    logout_tab.style.display = "block";
    profile_tab.style.display = "block";
    add_event.style.display = "block";
  } else {
    register_tab.style.display = "block";
    login_tab.style.display = "block";
    logout_tab.style.display = "none";
    profile_tab.style.display = "none";
    add_event.style.display = "none";
  }

  if (logout_tab) {
    logout_tab.addEventListener("click", () => {
      const token = localStorage.getItem("token");

      fetch("https://bloodbridge-backend-31a2.onrender.com/account/logout/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Logout response:", data);
          localStorage.removeItem("token");
          console.log(localStorage.getItem("token"));
          alert("Logged out successfully!");
          window.location.href = "/index.html"; // Redirect to login
        })
        .catch((err) => console.error("Error logging out:", err));
    });
  }
});
