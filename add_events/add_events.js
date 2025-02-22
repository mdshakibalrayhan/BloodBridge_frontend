// This will ensure your code runs after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
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
    window.location.href = "/index.html";
  }

  if (logout_tab) {
    logout_tab.addEventListener("click", () => {
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
          alert("Logged out successfully!");
          window.location.href = "/home_page/home.html"; // Redirect to login
        })
        .catch((err) => console.error("Error logging out:", err));
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      addEvent(); // Call function to handle the event
    });
  }
});

const addEvent = () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("blood_group", document.getElementById("blood_group").value);
  formData.append("event-date", document.getElementById("event-date").value);
  formData.append("status", document.getElementById("status").value);

  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  fetch(`https://bloodbridge-backend-31a2.onrender.com/event/add_event/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Event adding response:", data);
      alert("Event added successfully!");
    })
    .catch((err) => console.error("Error adding event:", err));
};
