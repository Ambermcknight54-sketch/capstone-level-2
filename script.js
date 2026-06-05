// 1. TARGET ELEMENTS & SETUP SUBMIT HANDLER
const apiForm = document.getElementById("queryForm");
apiForm.onsubmit = handleSubmit;

const cap1 = document.getElementById("cap1");
const cap2 = document.getElementById("cap2");
const cap3 = document.getElementById("cap3");
// 2. MAIN FORM HANDLER
function handleSubmit(event) {
  event.preventDefault();
  // Triggers the main async engine function
  getEmojiCategory();
}
// 3. LOCAL STORAGE: LOAD SAVED VALUES ON PAGE LOAD
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
// 4. LOOPS & RENDER VISUAL LAYOUT
// =========================================================================
/**
 * This function takes a single "Gift Box" holding all our information.
 * It opens the box, looks at the API data and the text inputs,
 * and drops the matching emojis right onto the webpage!
 */
const renderCategoryItemsList = function (giftBox) {
  const outputTag = document.getElementById("category");
  outputTag.innerText = "";

  const textItemsList = [];

  // BRACKET METHOD: We grab the values out of the giftBox using square brackets []
  const currentServerData = giftBox["serverDataArray"];
  const currentFaces = giftBox["userFaces"];
  const currentBeverages = giftBox["userBeverages"];

  // STEP 1: THE TRAVERSAL (Looking at each category card in our deck one-by-one)
  currentServerData.forEach(function (category) {
    // STEP 2: THE CONDITIONAL (Checking the folder label to see if it matches what we want)
    // We can use the bracket method on the category object too!
    if (category["name"] === "smileys-and-people") {
      // STEP 3: ELEMENT PARSE (Reading the text box value and turning it into an emoji)
      if (currentFaces === "Smile" || currentFaces === "smile") {
        textItemsList.push("😀");
      } else if (currentFaces !== "") {
        textItemsList.push(currentFaces);
      } else {
        textItemsList.push("😀");
      }
    }
    // STEP 2 AGAIN: THE CONDITIONAL (Checking for our second folder label match)
    if (category["name"] === "food-and-drink") {
      // STEP 3 AGAIN: ELEMENT PARSE (Reading the text box value and turning it into an emoji)
      if (currentBeverages === "Apple" || currentBeverages === "apple") {
        textItemsList.push("🍏");
      } else if (currentBeverages !== "") {
        textItemsList.push(currentBeverages);
      } else {
        textItemsList.push("🍏");
      }
    }
  });
  // STEP 4: ARRAY TO STRING (Taking the bucket of items and get sentence)
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

  outputTag.innerText = finalOutputText;
};
// 5. ASYNC FETCH & DATA STORAGE ENGINE
async function getEmojiCategory() {
  const outputTag = document.getElementById("category");
  outputTag.innerText = "⏳";

  const response = await fetch("https://emojihub.yurace.pro/api/categories");
  const isResponseGood = response.ok;

  if (isResponseGood) {
    const categoriesArray = await response.json();

    // Read exactly what text the user typed using form.elements bracket style
    const userSmileyText = apiForm.elements["smileys-and-people"].value;
    const userFoodText = apiForm.elements["food-and-drink"].value;

    // Create our submission tracking data object
    const submissionDataObject = {
      userFaces: userSmileyText,
      userBeverages: userFoodText,
    };

    // Boolean check looking for data presence
    const isFormFilled =
      submissionDataObject["userFaces"] !== "" &&
      submissionDataObject["userBeverages"] !== "";

    // Prevent empty entries with an if/else check
    if (!isFormFilled) {
      outputTag.innerText = "❌ Please fill out both fields!";
    } else {
      // Save valid text inputs into localStorage on success
      localStorage.setItem(
        "savedUserSmiley",
        submissionDataObject["userFaces"],
      );
      localStorage.setItem(
        "savedUserFood",
        submissionDataObject["userBeverages"],
      );

      // Create the single "Gift Box" object to send to our function
      const boxToSend = {
        serverDataArray: categoriesArray,
        userFaces: submissionDataObject["userFaces"],
        userBeverages: submissionDataObject["userBeverages"],
      };

      // Call our visual render function by passing the whole boxToSend object
      renderCategoryItemsList(boxToSend);
    }
  } else {
    outputTag.innerText = "❌ Connection failed!";
  }
}
