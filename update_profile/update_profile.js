let User = {};
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form"); // Select the form
  const token = localStorage.getItem("token");
  const register_tab = document.getElementById("register");
  const login_tab = document.getElementById("login");
  const profile_tab = document.getElementById("profile");
  const logout_tab = document.getElementById("logout");

  if (token) {
    register_tab.style.display = "none";
    login_tab.style.display = "none";
    logout_tab.style.display = "block";
    profile_tab.style.display = "block";
  } else {
    register_tab.style.display = "block";
    login_tab.style.display = "block";
    logout_tab.style.display = "none";
    profile_tab.style.display = "none";
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
  // Fetch user profile
  fetch("https://bloodbridge-backend-31a2.onrender.com/profile/user_profile/", {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      initialValues(data);
      User = data;
    });

  if (form) {
    form.addEventListener("submit", registrationHandler); // Attach event listener
  } else {
    console.error("Form not found!");
  }
});

//seting initial values
const initialValues = (user) => {
  console.log(user);
  document.getElementById("first_name").value = user.first_name;
  document.getElementById("last_name").value = user.last_name;
  document.getElementById("phone").value = user.phone_number;
  document.getElementById("address").value = user.address;
  document.getElementById("gender").value = user.gender;
  document.getElementById("blood_group").value = user.blood_group;
  document.getElementById("age").value = user.age;
  document.getElementById("birth_date").value = user.birth_date;
  document.getElementById("available").checked = user.is_available;
};
const registrationHandler = (event) => {
  event.preventDefault();

  console.log("Form submission started...");
  const form = document.getElementById("form");
  if (!form) {
    console.error("Form element not found!");
    return;
  }

  const formData = new FormData();

  formData.append("first_name", document.getElementById("first_name").value);
  formData.append("last_name", document.getElementById("last_name").value);
  formData.append("phone_number", document.getElementById("phone").value);
  formData.append("address", document.getElementById("address").value);
  formData.append("gender", document.getElementById("gender").value);
  formData.append("blood_group", document.getElementById("blood_group").value);
  formData.append("age", document.getElementById("age").value);
  formData.append("birth_date", document.getElementById("birth_date").value);
  formData.append(
    "available_for_donation",
    document.getElementById("available").checked ? "true" : "false"
  );

  const image = document.getElementById("image");
  if (image && image.files.length > 0) {
    formData.append("image", image.files[0]);
  }

  console.log("FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const token = localStorage.getItem("token");
  fetch(
    "https://bloodbridge-backend-31a2.onrender.com/profile/update_profile/",
    {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
      alert("Form submitted successfully!");
    })
    .catch((err) => console.error("Error:", err));
  window.location.href = "/profile_page/profile.html";
  alert("Profile Informations updated successfully!");
};
