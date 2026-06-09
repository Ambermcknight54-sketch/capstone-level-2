const formTag = document.getElementById("queryForm");

// 2. Define the main execution handler
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  let outputTag = document.getElementById("category");
  let catFaceTag = document.getElementById("category-faces");
  let catBevTag = document.getElementById("category-beverages");

  // Update the UI directly with a simple loading symbol
  outputTag.innerText = "⏳";

  // 3) Handle errors with conditionals and try/catch
  try {
    // Use fetch() to request data from the API
    const response = await fetch("https://emojihub.yurace.pro/api/categories");

    // Check if the network request failed
    if (!response.ok) {
      throw new Error(`API Network error! Status: ${response.status}`);
    }

    // Parse the raw incoming response into a readable JavaScript array
    const categoriesArray = await response.json();

    // Read exactly what text the user typed into the input boxes right now
    // Safely grabbing them from form.elements using the HTML 'name' attribute
    const userSmileyText =
      form.elements["smileys-and-people"].value.toLowerCase();
    const userFoodText = form.elements["food-and-drink"].value.toLowerCase();

    // 1) Create a Boolean variable (Starts with a question word for Capstone code quality)
    let isMatchFound = false;
    let textItemsList = [];

    // 4. Look through the list one by one using a standard loop
    for (let i = 0; i < categoriesArray.length; i++) {
      let currentCategory = categoriesArray[i];
      let currentName = currentCategory.toLowerCase().trim();

      // Check if the current API item matches what the user typed in either box
      if (currentName === userSmileyText || currentName === userFoodText) {
        isMatchFound = true; // Update our Boolean variable

        // Give it a special emoji depending on which group it matches!
        if (
          currentName === "smileys and people" &&
          textItemsList.indexOf("😀") === -1
        ) {
          let emojiIcon = "😀";
          catFaceTag.innerText = emojiIcon;
          textItemsList.push(emojiIcon);
        } else if (
          currentName === "food and drink" &&
          textItemsList.indexOf("🍔") === -1
        ) {
          let emojiIcon = "🍔";
          catBevTag.innerText = emojiIcon;
          textItemsList.push(emojiIcon);
        }
      }
    }

    // 2) Use the Boolean variable as a condition
    // 4) Display proper feedback with conditionals based on success/failure
    if (isMatchFound) {
      const totalItems = textItemsList.length;
      let finalOutputText = "";

      if (totalItems === 1) {
        finalOutputText = `Found Category: ${textItemsList[0]}`;
      } else if (totalItems === 2) {
        finalOutputText = `Found Categories: ${textItemsList[0]} and ${textItemsList[1]}`;
      }

      outputTag.innerText = finalOutputText;
    } else {
      // 4) Proper feedback when the boolean condition is false (no category matched)
      catFaceTag.innerText = "❓";
      catBevTag.innerText = "❓";
      outputTag.innerText =
        "❌ No matching official categories found. Please check your spelling and try again!";
    }
  } catch (error) {
    // 3) Catch block to handle any errors thrown during execution
    console.error("Application Error:", error);

    // 4) Display proper error feedback to the user via the UI
    catFaceTag.innerText = "⚠️";
    catBevTag.innerText = "⚠️";
    outputTag.innerText = `Error: Unable to load categories. (${error.message})`;
  }
}

// Ensure the listener sits completely outside the function block!
formTag.addEventListener("submit", handleSubmit);
