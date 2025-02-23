document.addEventListener("DOMContentLoaded", () => {
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
          window.location.href = "../index.html"; // Redirect to login
        })
        .catch((err) => console.error("Error logging out:", err));
    });
  }
});

const loadAllEvent = () => {
  fetch("https://bloodbridge-backend-31a2.onrender.com/event/all_events/")
    .then((res) => res.json())
    .then((data) => displayEventsHome(data));
};
//global
let AllEvents = [];
const displayEventsHome = (events) => {
  AllEvents = events;
  const EventContainer = document.getElementById("event-container");
  // Using forEach to loop over events
  events.forEach((event) => {
    const div = document.createElement("div");
    div.classList.add("col-md-6", "col-lg-3", "mt-3");

    div.innerHTML = `
        <div class="card p-3">
          <div class="card-body text-center">
            <h5 class="card-title">Event</h5>
            <small>Title: ${event.title}</small><br>
            <small>Blood group: ${event.blood_group}</small><br>
            <small>Date: ${event.time}</small><br>
            <a onclick='modalDetails(${JSON.stringify(event)})' 
            type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
      data-bs-target="#exampleModal"  >details</a>
            <a id="donate-btn" onclick="makeDonationRequest(${
              event.id
            })" class="btn btn-warning mt-3 donate-button">donate</a>
          </div>
        </div>
      `;

    EventContainer.appendChild(div);
  });

  const token = localStorage.getItem("token");
  if (!token) {
    document.querySelectorAll(".donate-btn").forEach((button) => {
      button.style.display = "none";
    });
  }
};
const modalDetails = (event) => {
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

const Filter = (blood_group) => {
  console.log(AllEvents);
  const filteredEvents = AllEvents.filter(
    (event) => event.blood_group === blood_group
  );
  console.log(filteredEvents);

  const eventContainer = document.getElementById("event-container");
  eventContainer.innerHTML = "";
  if (filteredEvents.length != 0) {
    filteredEvents.forEach((event) => {
      const div = document.createElement("div");
      div.classList.add("col-md-6", "col-lg-3", "mt-3");
      console.log(event.title, event.blood_group);

      div.innerHTML = `
          <div class="card p-3">
            <div class="card-body text-center">
              <h5 class="card-title">Event</h5>
              <small>Title: ${event.title}</small><br>
              <small>Blood group: ${event.blood_group}</small><br>
              <small>Date: ${event.time}</small><br>
              <a onclick='modalDetails(${JSON.stringify(event)})' 
              type="button" class="btn btn-primary mt-3" data-bs-toggle="modal"
        data-bs-target="#exampleModal"  >details</a>
              <a  class="btn donate-btn btn-warning mt-3">donate</a>
            </div>
          </div>
        `;

      eventContainer.appendChild(div);
    });

    const token = localStorage.getItem("token");
    if (!token) {
      document.querySelectorAll(".donate-btn").forEach((button) => {
        button.style.display = "none";
      });
    }
  } else {
    const div = document.createElement("div");
    div.innerHTML = `
    <div>
      <h1 class="text-center text-white">Opps...</h1>
      <h4 class="text-center text-white">No results found!!</h4>
    </div>
    `;
    console.log("else e asche kintu append korche na");
    eventContainer.appendChild(div);
  }
};

//donation request hanler
const makeDonationRequest = async (eventID) => {
  console.log("Event ID:", eventID);

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to make request!!");
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
