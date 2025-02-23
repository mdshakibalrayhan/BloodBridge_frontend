let UserProfile = {}; // Store user profile globally

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
    window.location.href = "../index.html";
  }

  if (logout_tab) {
    logout_tab.addEventListener("click", () => {
      fetch("https://bloodbridge-backend-31a2.onrender.com/account/logout/", {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Logout response:", data);
          localStorage.removeItem("token");
          alert("Logged out successfully!");
          window.location.href = "../index.html";
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
      ProfileDetails(data);
      UserProfile = data;

      // Fetch user donation history
      return fetch(
        "https://bloodbridge-backend-31a2.onrender.com/donation/donation_history/",
        {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    })
    .then((res) => res.json())
    .then((data) => dispayDonationHistory(data))
    .catch((err) => console.error("Fetch error:", err));

  //fetch users events
  fetch(
    "https://bloodbridge-backend-31a2.onrender.com/event/user_specific_event/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => dispayEventHistory(data))
    .catch((err) => console.error("Error fetching events:", err));

  const form = document.getElementById("form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault(); // Prevent default form submission
      SaveEventData(); // Call function to handle the event
    });
  }
});

const ProfileDetails = (user) => {
  const container = document.getElementById("profile-texts");
  const cloudName = "dfurwt0cv"; // Cloudinary cloud name
  let fullUrl = "";
  if (user.image) {
    fullUrl = `https://res.cloudinary.com/${cloudName}/${user.image}`;
  } else {
    fullUrl = "/profile_page/images/demo_profile.png";
  }

  container.innerHTML = `
    <div class="card mb-3 d-flex bg-dark">
      <div class="row g-0 align-items-stretch">
        <div class="col-md-4">
          <img src="${fullUrl}" class="img-fluid rounded-start h-100 w-100 object-fit-cover" alt="Profile Image">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center">
          <div class="card-body bg-info">
            <h3 class="rounded bg-white d-inline-block mt-3 mb-3 p-3">Your Profile Information</h3>
            <div class="mt-3 mx-5">
              <h5>First Name: ${user.first_name}</h5>
              <h5>Last Name: ${user.last_name}</h5>
              <h5>Age: ${user.age}</h5>
              <h5>Gender: ${user.gender}</h5>
              <h5>Blood Group: ${user.blood_group}</h5>
              <h5>Phone: ${user.phone_number}</h5>
              <h5>Birth Date: ${user.birth_date}</h5>
              <h5>Available for Donation: ${
                user.is_available ? "Yes" : "No"
              }</h5>
              <h5>Address: ${user.address}</h5>
              <div class="mt-5 text-center">
                <a href="../update_profile/update_profile.html" class="btn btn-outline-dark shadow text-white p-3">Update Profile</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

const dispayDonationHistory = (records) => {
  const container = document.getElementById("donation-container");

  if (records.length === 0) {
    container.style.display = "none";
  } else {
    container.classList.add("d-block");

    const div = document.createElement("div");
    div.innerHTML = `
      <table class="table mt-5">
        <thead>
          <tr>
            <th scope="col">Event</th>
            <th scope="col">Blood Group</th>
            <th scope="col">Donation Status</th>
            <th scope="col">Requested On</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>`;

    const tbody = div.querySelector("#tbody");

    records.forEach((record) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
          <td>${record.event_name}</td>
          <td>${record.donated_blood_group}</td>
          <td>${record.request_status ? "Donated" : "Requested"}</td>
          <td>${record.donation_date}</td>
          `;
      tbody.appendChild(tableRow);
    });

    container.appendChild(div);
  }
};

//events history
const dispayEventHistory = (records) => {
  const container = document.getElementById("user-event-container");

  if (records.length === 0) {
    container.style.display = "none";
  } else {
    container.classList.add("d-block");

    const div = document.createElement("div");
    div.innerHTML = `
      <table class="table table-striped mt-5">
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Blood Group</th>
            <th scope="col">Time</th>
            <th scope="col">Status</th>
            <th scope="col">Update?</th>
            <th scope="col">All Requests</th>
          </tr>
        </thead>
        <tbody id="tbody"></tbody>
      </table>`;

    const tbody = div.querySelector("#tbody");

    records.forEach((record) => {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
          <td>${record.title}</td>
          <td>${record.blood_group}</td>
          <td>${record.time}</td>
          <td>${record.status}</td>
          <td><a type="button" class="btn btn-info mt-3" data-bs-toggle="modal"
        data-bs-target="#exampleModal" onclick="updateEvent(${record.id})" >update</a></td>
        <td><a class="btn btn-primary  mt-3" data-bs-toggle="modal"
        data-bs-target="#exampleModal1" onclick="AllRequestsOfAnEvent(${record.id})">sell allrequest</a></td>
          `;
      tbody.appendChild(tableRow);
    });

    container.appendChild(div);
  }
};

// Update Event Function
let EventID = 0;

const updateEvent = (eventID) => {
  EventID = eventID; // Ensure EventID is properly set
  const token = localStorage.getItem("token");
  fetch(
    `https://bloodbridge-backend-31a2.onrender.com/event/update_event/${EventID}/`, // Use the correct EventID
    {
      method: "GET",
      headers: { Authorization: `Token ${token}` },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      document.getElementById("title").value = data.title;
      document.getElementById("description").value = data.description;
      document.getElementById("location").value = data.location;
      document.getElementById("blood_group").value = data.blood_group;

      const eventDate = new Date(data.time);
      document.getElementById("event-date").value = eventDate
        .toISOString()
        .slice(0, 16);

      document.getElementById("status").value = data.status;
    })
    .catch((err) => console.error("Fetch error:", err));
};

const SaveEventData = () => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("blood_group", document.getElementById("blood_group").value);
  formData.append("event-date", document.getElementById("event-date").value);
  formData.append("status", document.getElementById("status").value);

  console.log("FormData contents: before submitting: ");
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  fetch(
    `https://bloodbridge-backend-31a2.onrender.com/event/update_event/${EventID}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Update response:", data);
      alert("Event updated successfully!");
    })
    .catch((err) => console.error("Error updating event:", err));
  window.location.href = "./profile.html";
  alert("Event updated successfully!");
};

//all requests
const AllRequestsOfAnEvent = (eventID) => {
  const token = localStorage.getItem("token");
  let allRequests = [];
  fetch(
    `https://bloodbridge-backend-31a2.onrender.com/donation/requests/${eventID}/`,
    {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      allRequests = data;
      if (allRequests.length) {
        const container = document.getElementById("modal-container1");
        container.innerHTML = ""; // Clear any existing content
        const title = document.getElementById("exampleModalLabel1");
        title.innerHTML = "All request of this event";
        // Construct the HTML for the table
        let tableHTML = `
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Donor Name</th>
        <th>Donation Date</th>
        <th>Blood Group</th>
        <th>Request Status</th>
        <th>Action</th>  <!-- Added column for actions -->
      </tr>
    </thead>
    <tbody>`;

        allRequests.forEach((request) => {
          tableHTML += `
      <tr>
        <td>${request.donor_name}</td>
        <td>${new Date(request.donation_date).toLocaleString()}</td>
        <td>${request.donated_blood_group}</td>
        <td><a class="btn ${
          request.request_status ? "btn-success" : "btn-secondary"
        }">${request.request_status ? "Accepted" : "Pending"}</a></td>
        <td>${
          !request.request_status
            ? `<button class="btn btn-primary accept-btn" onclick="acceptRequest(${request.id})">Accept</button>`
            : ""
        }</td>
      </tr>`;
        });

        tableHTML += `
    </tbody>
  </table>`;
        // Set the HTML content for the container
        container.innerHTML = tableHTML;
      } else {
        const title = document.getElementById("exampleModalLabel1");
        title.innerHTML = "All requests of this event";
        const container = document.getElementById("modal-container1");
        container.innerHTML = `
        <h1>There's no Requests yet!</h1>
        `;
      }
    })
    .catch((err) => console.error("Error updating event:", err));
};

//accepting request
const acceptRequest = (eventID) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("request_status", true);
  console.log("accepting : ", eventID);
  fetch(
    `https://bloodbridge-backend-31a2.onrender.com/donation/update_request/${eventID}/`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Update response:", data);
      window.location.href = "./profile.html";
      alert("Request Updaed successfully!");
    })
    .catch((err) => console.error("Error updating event:", err));
};
