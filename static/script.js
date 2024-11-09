const questForm = document.getElementById("questForm");
const requirementsList = document.getElementById("requirementsList");
let requirements = [];  // Array to store requirements

// Function to add requirement
function addRequirement() {
  const requirementInput = document.getElementById("requirementInput");
  const requirementText = requirementInput.value.trim();

  if (requirementText) {
    requirements.push(requirementText);

    // Add requirement to the displayed list
    const listItem = document.createElement("li");
    listItem.textContent = requirementText;
    requirementsList.appendChild(listItem);

    // Clear input field
    requirementInput.value = "";
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value,
    detail: document.getElementById("detail").value,
    location: document.getElementById("location").value,
    category: document.getElementById("category").value,
    price: document.getElementById("price").value,
    timestamp: new Date().toISOString(),
    requirements: requirements  // Include requirements array
  };

  if (!formData.name || !formData.detail || !formData.location || !formData.category) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/submit-quest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      alert("Quest saved successfully!");
      questForm.reset();
      requirements = [];  // Reset requirements array
      requirementsList.innerHTML = "";  // Clear displayed list
    } else {
      alert("Failed to save quest: " + result.error);
    }
  } catch (error) {
    console.error("Error saving quest:", error);
    alert("Failed to save quest. Please try again.");
  }
}

let leafletMap, leafletMarker;

function openLeafletMap() {
  document.getElementById("leaflet-map-modal").classList.add("active");

  if (!leafletMap) {
    leafletMap = L.map("leaflet-map").setView([13.6525, 100.4942], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(leafletMap);

    leafletMap.on("click", function (e) {
      if (leafletMarker) {
        leafletMap.removeLayer(leafletMarker);
      }
      leafletMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(leafletMap);
      document.getElementById("location").value =
        "Lat: " + e.latlng.lat.toFixed(5) + ", Lng: " + e.latlng.lng.toFixed(5);
    });
  }
}

function confirmLeafletLocation() {
  document.getElementById("leaflet-map-modal").classList.remove("active");
}

function cancelLeafletLocation() {
  document.getElementById("leaflet-map-modal").classList.remove("active");
}
