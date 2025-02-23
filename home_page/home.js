// This will ensure your code runs after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadAvailableDonors();
  loadAllEvent();
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
          window.location.href = "./index.html";
        })
        .catch((err) => console.error("Error logging out:", err));
    });
  }
});

const loadAvailableDonors = () => {
  fetch(
    "https://bloodbridge-backend-31a2.onrender.com/profile/available/donors/"
  )
    .then((res) => res.json())
    .then((data) => displayDonorsHome(data));
};

const displayDonorsHome = (donors) => {
  const donorContainer = document.getElementById("donors-container");

  for (let i = 0; i < 4; i++) {
    const div = document.createElement("div");
    div.classList.add("col-md-6", "col-lg-3", "mt-3");
    const cloudName = "dfurwt0cv"; // Replace with your actual Cloudinary cloud name

    let fullUrl = "";
    if (donors[i].image) {
      fullUrl = `https://res.cloudinary.com/${cloudName}/${donors[i].image}`;
    } else {
      fullUrl = "/home_page/images/demo_profile.png";
    }

    div.innerHTML = `
    <div class="card p-3">
  <img src="${fullUrl}" class="card-img-top m-auto " alt="...">
  <div class="card-body text-center">
    <h5 class="card-title ">Donor</h5>
    <small>Name : ${donors[i].first_name}</small></br>
    <small>Blood group : ${donors[i].blood_group}</small></br>
    <a onclick='modalDetails(${JSON.stringify(
      donors[i]
    )})' type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
      data-bs-target="#exampleModal">Details</a>
  </div>
</div>
    `;
    donorContainer.appendChild(div);
  }
  const token = localStorage.getItem("token");
  if (!token) {
    document.querySelectorAll(".request-button").forEach((button) => {
      button.style.display = "none";
    });
  }

  const See_all_button = document.createElement("div");
  See_all_button.classList.add("col-12");
  See_all_button.innerHTML = `
    <a class='btn btn-outline-dark fw-bold mt-5 p-4' href="./all_donors/all_donors.html">See all available donors</a>
    `;
  donorContainer.appendChild(See_all_button);
};

const loadAllEvent = () => {
  fetch("https://bloodbridge-backend-31a2.onrender.com/event/all_events/")
    .then((res) => res.json())
    .then((data) => displayEventsHome(data));
};

const displayEventsHome = (events) => {
  console.log(events);
  const EventContainer = document.getElementById("event-container");

  for (let i = 0; i < 4; i++) {
    const div = document.createElement("div");
    div.classList.add("col-md-6", "col-lg-3", "mt-3");

    div.innerHTML = `
    <div class="card p-3">
  <div class="card-body text-center">
    <h5 class="card-title ">Event</h5>
    <small>Title : ${events[i].title}</small></br>
    <small>Blood group : ${events[i].blood_group}</small></br>
    <small>Date : ${events[i].time}</small></br>
    <a onclick='modalEventDetails(${JSON.stringify(events[i])})' 
            type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
      data-bs-target="#exampleModal"  >details</a>
    <a id="donate-btn" onclick="makeDonationRequest(${
      events[i].id
    })" class="btn btn-warning mt-3 donate-button">donate</a>
  </div>
</div>
    `;
    EventContainer.appendChild(div);
  }
  const See_all_button = document.createElement("div");
  See_all_button.classList.add("col-12");
  See_all_button.innerHTML = `
    <a class='btn btn-outline-light fw-bold mt-5 mb-5 p-4' href="./all_events/all_events.html">See all events</a>
    `;
  EventContainer.appendChild(See_all_button);
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
const modalEventDetails = (event) => {
  const container = document.getElementById("modal-container");
  const containerText = document.getElementById("modal-container");
  containerText.innerHTML = "";
  const div = document.createElement("div");
  div.innerHTML = `
      <h5 class="mt-5">Event Title : ${event.title}</h5>
      <h4>Creator : ${event.creator}</h4>
      <p>Event Description : ${event.description}</p>
      <h4>Blood Group : ${event.blood_group}</h4>
      <h5>Location : ${event.location}</h5>
      <h5>Time : ${event.time}</h5>
      <strong>Status : ${event.status}</strong>
    `;
  container.appendChild(div);
};

//donation request hanler
const makeDonationRequest = async (eventID) => {
  console.log("Event ID:", eventID);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in first for making reqeust!!");
    return;
  }

  try {
    // Fetch user profile data
    const response = await fetch(
      "https://bloodbridge-backend-31a2.onrender.com/profile/user_profile/",
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const User = await response.json(); // Wait for response JSON

    // Ensure blood_group exists
    if (!User.blood_group) {
      console.error("User blood group is missing!");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("event", eventID);
    formData.append("blood_group", User.blood_group); // ✅ No more undefined

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Now send the donation request (Example API URL)
    const donateResponse = await fetch(
      "https://bloodbridge-backend-31a2.onrender.com/donation/donate_blood/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      }
    );

    if (!donateResponse.ok) {
      const errorData = await donateResponse.json();
      console.error("Donation failed:", errorData);
      alert("your blood group doesn't match with the event blood group");
    } else {
      console.log("Donation successful!");
      alert(
        "you requst was successfull, you will get a messege soon if your request is accepted"
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
