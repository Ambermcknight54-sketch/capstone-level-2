// Initialization for ES Users
import { Collapse, Dropdown, initTWE } from "tw-elements";

initTWE({ Collapse, Dropdown });
// Function attached to form's onsubmit handler
function handleFormSubmit(event) {
  event.preventDefault(); // Stop the screen from refreshing

  const emailInput = document.getElementById("email").value;
  const resultBox = document.getElementById("result-box").value;
  if (emailInput != "") {
    let name = emailInput.split("@")[0];
    getGenderData(name);
  }
}

// Global data verification helper
async function getGenderData(customName) {
  const resultBox = document.getElementById("result-box");
  if (!resultBox) return;

  try {
    const dataString = new URLSearchParams({ name: customName }).toString();

    const response = await fetch("https://api.generize.io?" + dataString);
    const result = await response.json();

    const percent = result.probability * 100;
    const gender = result.gender;

    // Output directly to the screen via innerText
    resultBox.innerText =
      customName + " is validated: " + percent + "% " + gender + ".";
  } catch (error) {
    resultBox.innerText = "Error loading verification metrics.";
    console.log("Fetch tracking caught:", error);
  }
}
