// =========================================================================
// 1. TARGET ELEMENTS & SETUP SUBMIT HANDLER
// =========================================================================
const apiForm = document.getElementById("queryForm");
apiForm.onsubmit = handleSubmit;

const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const cap3 = document.getElementById("cap3");

// =========================================================================
// 2. MAIN FORM HANDLER
// =========================================================================
function handleSubmit(event) {
  event.preventDefault();

  // Triggers the main async engine function
  getEmojiCategory();
}

// =========================================================================
// 3. LOCAL STORAGE: LOAD SAVED VALUES ON PAGE LOAD
// =========================================================================
const savedSmiley = localStorage.getItem("savedUserSmiley");
const savedFood = localStorage.getItem("savedUserFood");

// If saved data exists, put it back into the form fields automatically
if (savedSmiley !== null) {
  apiForm.elements["smileys-and-people"].value = savedSmiley;
}
if (savedFood !== null) {
  apiForm.elements["food-and-drink"].value = savedFood;
}

// =========================================================================
// 4. LOOPS REQUIREMENT: TRAVERSE ARRAY & RENDER VISUAL LAYOUT
// =========================================================================
/**
 * Traverses an array, parses values, and renders elements into layout.
 * @param {Object} options - Configuration object parameter containing data elements.
 * @param {Array} options.serverDataArray - The category data collection from the API.
 * @param {string} options.userFaces - What text the user submitted for smiles.
 * @param {string} options.userBeverages - What text the user submitted for food.
 */
const renderCategoryItemsList = ({
  serverDataArray,
  userFaces,
  userBeverages,
}) => {
  const outputTag = document.getElementById("category");
  outputTag.innerText = ""; // Clear loader text before updating

  const textItemsList = [];

  // LOOPS REQUIREMENT: Traverse array using .forEach()
  serverDataArray.forEach((category) => {
    if (category.name === "smileys-and-people") {
      if (userFaces === "Smile" || userFaces === "smile") {
        textItemsList.push("😀");
      } else if (userFaces !== "") {
        textItemsList.push(userFaces);
      } else {
        textItemsList.push("😀");
      }
    }

    if (category.name === "food-and-drink") {
      if (userBeverages === "Apple" || userBeverages === "apple") {
        textItemsList.push("🍏");
      } else if (userBeverages !== "") {
        textItemsList.push(userBeverages);
      } else {
        textItemsList.push("🍏");
      }
    }
  });

  // EXPANDED STRING BUILDING (Using manual list concatenation logic)
  const totalItems = textItemsList.length;
  let finalOutputText = "";

  if (totalItems === 1) {
    finalOutputText = textItemsList[0];
  } else if (totalItems === 2) {
    finalOutputText = textItemsList[0] + " and " + textItemsList[1];
  } else if (totalItems > 2) {
    finalOutputText =
      textItemsList[0] + ", " + textItemsList[1] + ", and " + textItemsList[2];
  }

  // Render elements directly into website interface text structure
  outputTag.innerText = finalOutputText;
};
// 5. ASYNC FETCH & DATA STORAGE ENGINE
async function getEmojiCategory() {
  const outputTag = document.getElementById("category");
  outputTag.innerText = "⏳";

  const response = await fetch("https://emojihub.yurace.pro/api/categories");
  const isResponseGood = response.ok;

  if (isResponseGood) {
    // Parse raw text string stream into a readable object array
    const categoriesArray = await response.json();

    // Read exactly what text the user typed using form.elements
    const userSmileyText = apiForm.elements["smileys-and-people"].value;
    const userFoodText = apiForm.elements["food-and-drink"].value;

    // DATA OBJECT REQUIREMENT
    const submissionDataObject = {
      userFaces: userSmileyText,
      userBeverages: userFoodText,
    };

    // CONDITIONALS REQUIREMENT 1: Boolean check looking for data presence
    const isFormFilled =
      submissionDataObject.userFaces !== "" &&
      submissionDataObject.userBeverages !== "";

    // CONDITIONALS REQUIREMENT 2: Block empty form entries with if/else check
    if (!isFormFilled) {
      outputTag.innerText = "❌ Please fill out both fields!";
    } else {
      // LOCAL STORAGE: Save valid current states into localStorage on success
      localStorage.setItem("savedUserSmiley", submissionDataObject.userFaces);
      localStorage.setItem("savedUserFood", submissionDataObject.userBeverages);

      // FUNCTIONS REQUIREMENT: Call single function that handles arguments inside matching {}
      renderCategoryItemsList({
        serverDataArray: categoriesArray,
        userFaces: submissionDataObject.userFaces,
        userBeverages: submissionDataObject.userBeverages,
      });
    }
  } else {
    // Error feedback fallback state
    outputTag.innerText = "❌ Connection failed!";
  }
}
