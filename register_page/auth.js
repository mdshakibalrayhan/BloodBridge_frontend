document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form"); // Select the form
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
    form.addEventListener("submit", registrationHandler); // Attach event listener
  } else {
    console.error("Form not found!");
  }
});

const registrationHandler = (event) => {
  event.preventDefault();

  console.log("hello");

  const formData = new FormData();
  formData.append("username", document.getElementById("username").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("first_name", document.getElementById("first_name").value);
  formData.append("last_name", document.getElementById("last_name").value);
  formData.append("password", document.getElementById("password").value);
  formData.append(
    "confirm_password",
    document.getElementById("confirm_password").value
  );
  formData.append("phone_number", document.getElementById("phone").value);
  formData.append("address", document.getElementById("address").value);
  formData.append("gender", document.getElementById("gender").value);
  formData.append("blood_group", document.getElementById("blood_group").value);
  formData.append("age", document.getElementById("age").value);
  formData.append("birth_date", document.getElementById("birth_date").value);
  formData.append(
    "available_for_donation",
    document.getElementById("available").checked
  );

  const image = document.getElementById("image");
  if (image.files.length > 0) {
    formData.append("image", image.files[0]);
  }

  console.log(formData);

  fetch("https://bloodbridge-backend-31a2.onrender.com/account/register/", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => console.log("Server response:", data))
    .catch((err) => console.error("Error:", err));

  alert(
    "Form submitted successfully,please check your email to verify it's you!!"
  );
};
