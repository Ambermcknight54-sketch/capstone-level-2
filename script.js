// 1. Find our HTML elements
const nameInput = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitBtn");
const resultBox = document.getElementById("result-box");

// 2. Listen for the button click
submitBtn.addEventListener("click", () => {
  let userInput = nameInput.value.trim();

  if (userInput !== "") {
    // If they typed an email, slice off everything after the '@' symbol
    let name = userInput.split("@")[0];

    // Call our API function
    getGender(name);
  }
});

// 3. Fetch data from the API
async function getGender(customName) {
  try {
    // Put the name into URL format
    const dataString = new URLSearchParams({ name: customName }).toString();

    // Make the request
    const response = await fetch("https://api.generize.io?" + dataString);
    const result = await response.json();

    // Calculate percentage and get gender
    const percent = result.probability * 100;
    const gender = result.gender;

    // Show the final message on screen
    resultBox.innerText = customName + " is " + percent + "% " + gender + ".";
  } catch (error) {
    resultBox.innerText = "Error loading data.";
    console.log(error);
  }
}
