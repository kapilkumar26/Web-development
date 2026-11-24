const form = document.getElementById("search-form");
const input = document.getElementById("country-input");
const button = form.querySelector("button");
const message = document.getElementById("message");
const results = document.getElementById("results");

// Hipo Labs Universities API (free, no API key needed)
const API_URLS = [
  "https://universities.hipolabs.com/search",
  "http://universities.hipolabs.com/search",
];

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

// Try https first, fall back to http if it fails
async function fetchUniversities(country) {
  let lastError;
  for (const base of API_URLS) {
    try {
      const response = await fetch(`${base}?country=${encodeURIComponent(country)}`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

function displayUniversities(universities) {
  results.innerHTML = "";

  universities.forEach((uni) => {
    const li = document.createElement("li");

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = uni.name;
    li.appendChild(name);

    const website = uni.web_pages && uni.web_pages[0];
    if (website) {
      const link = document.createElement("a");
      link.href = website;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = website;
      li.appendChild(link);
    } else {
      const none = document.createElement("span");
      none.textContent = "No website available";
      li.appendChild(none);
    }

    results.appendChild(li);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const country = input.value.trim();
  results.innerHTML = "";

  if (!country) {
    setMessage("Please enter a country name.", true);
    return;
  }

  setMessage("Loading...");
  button.disabled = true;

  try {
    const universities = await fetchUniversities(country);

    if (universities.length === 0) {
      setMessage(`No universities found for "${country}".`, true);
    } else {
      setMessage(`Found ${universities.length} universities in ${country}.`);
      displayUniversities(universities);
    }
  } catch (error) {
    console.error(error);
    setMessage("Something went wrong while fetching data. Please try again.", true);
  } finally {
    button.disabled = false;
  }
});