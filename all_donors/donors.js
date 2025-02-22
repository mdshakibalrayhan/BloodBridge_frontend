// This will ensure your code runs after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadAvailableDonors();
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
let AllDonors = {};

const loadAvailableDonors = () => {
  fetch(
    "https://bloodbridge-backend-31a2.onrender.com/profile/available/donors/"
  )
    .then((res) => res.json())
    .then((data) => displayDonorsHome(data));
};
const displayDonorsHome = (donors) => {
  const donorContainer = document.getElementById("donors-container");
  AllDonors = donors;

  donors.forEach((donor) => {
    const div = document.createElement("div");
    div.classList.add("col-md-6", "col-lg-3", "mt-3", "d-flex"); // Ensure proper flex behavior

    const cloudName = "dfurwt0cv"; // Your Cloudinary cloud name
    let fullUrl = "";
    if (donor.image) {
      fullUrl = `https://res.cloudinary.com/${cloudName}/${donor.image}`;
    } else {
      fullUrl = "/home_page/images/demo_profile.png";
    }

    div.innerHTML = `
        <div class="card p-3 w-100 ">
          <img src="${fullUrl}" class="card-img-top m-auto" alt="Donor Image">
          <div class="card-body text-center">
            <h5 class="card-title">Donor</h5>
            <small>Name: ${donor.first_name}</small><br>
            <small>Blood group: ${donor.blood_group}</small><br>
            <a onclick='modalDetails(${JSON.stringify(
              donor
            )})' type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
      data-bs-target="#exampleModal">Details</a>
          </div>
        </div>
      `;

    donorContainer.appendChild(div);
    const token = localStorage.getItem("token");
    if (!token) {
      document.querySelectorAll(".request-button").forEach((button) => {
        button.style.display = "none";
      });
    }
  });
};
const modalDetails = (donor) => {
  clearData();
  const container = document.getElementById("modal-container");
  const div = document.createElement("div");
  const cloudName = "dfurwt0cv"; // Your Cloudinary cloud name
  const fullUrl = `https://res.cloudinary.com/${cloudName}/${donor.image}`;
  div.innerHTML = `
  <div class= "details-img "><img src="${fullUrl}"></div>
    <h5 class="mt-5">First Name : ${donor.first_name}</h5>
    <h5>Last Name : ${donor.last_name}</h5>
    <h4>Blood Group : ${donor.blood_group}</h4>
    <h5>Age : ${donor.age}</h5>
    <h5>Gender : ${donor.gender}</h5>
    <h5>Phone Number : ${donor.phone_number}</h5>
    <strong>Address : ${donor.address}</strong>
  `;
  container.appendChild(div);
};

const clearData = () => {
  const container = document.getElementById("modal-container");
  container.innerHTML = "";
};

const Filter = (blood_group) => {
  console.log(AllDonors);
  const filteredDonors = AllDonors.filter(
    (donor) => donor.blood_group === blood_group
  );
  console.log(filteredDonors);

  const donorContainer = document.getElementById("donors-container");
  donorContainer.innerHTML = "";
  if (filteredDonors.length != 0) {
    filteredDonors.forEach((donor) => {
      console.log(donor.blood_group);
      const div = document.createElement("div");
      div.classList.add("col-md-6", "col-lg-3", "mt-3", "d-flex"); // Ensure proper flex behavior

      const cloudName = "dfurwt0cv"; // Your Cloudinary cloud name
      const fullUrl = `https://res.cloudinary.com/${cloudName}/${donor.image}`;

      div.innerHTML = `
          <div class="card p-3 w-100 ">
            <img src="${fullUrl}" class="card-img-top m-auto" alt="Donor Image">
            <div class="card-body text-center">
              <h5 class="card-title">Donor</h5>
              <small>Name: ${donor.first_name}</small><br>
              <small>Blood group: ${donor.blood_group}</small><br>
              <a onclick='modalDetails(${JSON.stringify(
                donor
              )})' type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
        data-bs-target="#exampleModal">Details</a>
              <a href="#" class="btn btn-warning request-button mt-3" >Request to Donate</a>
            </div>
          </div>
        `;

      donorContainer.appendChild(div);
      const token = localStorage.getItem("token");
      if (!token) {
        document.querySelectorAll(".request-button").forEach((button) => {
          button.style.display = "none";
        });
      }
    });
  } else {
    const div = document.createElement("div");
    div.innerHTML = `
    <div>
      <h1 class="text-center">Opps...</h1>
      <h4 class="text-center">No results found!!</h4>
    </div>
    `;
    console.log("else e asche kintu append korche na");
    donorContainer.appendChild(div);
  }
};
