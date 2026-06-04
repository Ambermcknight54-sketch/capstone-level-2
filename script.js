// Target the form element from your HTML page using its unique ID
const apiForm = document.getElementById("apiForm");

// STORAGE REQUIREMENT: 3) & 4) Load and use values when the page loads
if (apiForm) {
  // get a value from storage
  const savedSmiley = localStorage.getItem("savedUserSmiley");
  const savedFood = localStorage.getItem("savedUserFood");

  if (savedSmiley !== null) {
    apiForm.elements["smileys-and-people"].value = savedSmiley;
  }
  if (savedFood !== null) {
    apiForm.elements["food-and-drink"].value = savedFood;
  }
  apiForm.addEventListener("submit", function (event) {
    event.preventDefault();
    getEmojiCategory();
  });
}
// FUNCTIONS REQUIREMENT: One function that accepts parameters using {}
/**
 * LOOPS: Traverses an array, displays values, and renders elements into layout.
 * @param {Array} serverDataArray - The list of categories from the API.
 */
const renderCategoryItemsList = (serverDataArray) => {
  const outputTag = document.getElementById("category");

  // LOOPS REQUIREMENT: 1) Traverse an array using .forEach()
  serverDataArray.forEach((currentCategory) => {
    const categoryName = currentCategory.name;

    let displayEmoji = "";

    // CONDITIONALS: Pure string checks that assign an emoji directly
    if (categoryName === "smileys-and-people") {
      displayEmoji = "😀";
    } else if (categoryName === "food-and-drink") {
      displayEmoji = "🍔";
    } else {
      displayEmoji = "❓";
    }
    // LOOPS REQUIREMENT: 2) Display array values & 3) Render into website
    if (outputTag) {
      outputTag.textContent += displayEmoji + "  ";
    }
  });
};
//GET method
async function getEmojiCategory() {
  const outputTag = document.getElementById("category");

  if (outputTag) {
    outputTag.innerText = "⏳";
  }
  // Pause in debugger when this function runs (useful for breakpoints)
  debugger;
  const response = await fetch("https://emojihub.yurace.pro/api/categories");
  const isResponseGood = response.ok;
  if (isResponseGood === false) {
    if (outputTag) {
      outputTag.innerText = "❌ Connection failed!";
    }
  } else {
    // Parse the incoming data stream into a readable JavaScript array
    const categoriesArray = await response.json();

    // Read exactly what text the user typed into the input boxes using form.elements
    let userSmileyText = apiForm.elements["smileys-and-people"].value;
    let userFoodText = apiForm.elements["food-and-drink"].value;

    const submissionDataObject = {
      userFaces: userSmileyText,
      userBeverages: userFoodText,
    };
    // CONDITIONALS REQUIREMENT: 1) Create another Boolean variable matching criteria
    const isFormFilled =
      submissionDataObject.userFaces !== "" &&
      submissionDataObject.userBeverages !== "";
    // CONDITIONALS REQUIREMENT: 2) Prevent empty form entries with an if/else check
    if (isFormFilled === false) {
      if (outputTag) {
        // CONDITIONALS REQUIREMENT: 4) Display feedback warning for empty forms
        outputTag.innerText = "❌ Please fill out both fields!";
      }
    } else {
      // STORAGE REQUIREMENT: 1) & 2) Save values to localStorage on success
      localStorage.setItem("savedUserSmiley", submissionDataObject.userFaces);
      localStorage.setItem("savedUserFood", submissionDataObject.userBeverages);

      if (outputTag) {
        outputTag.innerText = "";
      }
      // FUNCTION REQUIREMENT: Called function
      renderCategoryItemsList(categoriesArray);
    }
  }
}
