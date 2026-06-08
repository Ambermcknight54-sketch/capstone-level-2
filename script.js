const formTag = document.getElementById("queryForm");

// 2. Define the main execution handler
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  let outputTag = document.getElementById("category");
  let catFaceTag = document.getElementById("category-faces");
  let catBevTag = document.getElementById("category-beverages");

  // Update the UI directly with a simple loading symbol
  outputTag.innerText = "⏳ please wait";

  // Use fetch() to request data from the API
  const response = await fetch("https://emojihub.yurace.pro/api/categories");

  if (response.ok) {
    // Parse the raw incoming response into a readable JavaScript array
    const categoriesArray = await response.json();

    // Read exactly what text the user typed into the input boxes right now
    const userSmileyText = form.elements["smileys-and-people"].value;
    const userFoodText = form.elements["food-and-drink"].value;
    const storedCatData = localStorage.getItem("userInfo");
    const userInfo = JSON.parse(storedCatData);
    const myValue = userSmileyText;

    let matchedName = "None Matched";
    let isValid = "False";
    let emojiIcon = "❓"; // Default emoji if nothing matches
    let textItemsList = [];

    // 4. Look through the list one by one using a standard loop
    for (let i = 0; i < categoriesArray.length; i++) {
      //"smileys and people",
      //console.log(categoriesArray[i]);
      let currentCategory = categoriesArray[i];
      let currentName = currentCategory.toLowerCase();
      let emojiIcon = "❓"; // Default emoji if nothing matches
      // Loop through the categories instead of mapping them
      // If what the user typed matches an official category name, save it!
      if (currentName === userSmileyText || currentName === userFoodText) {
        matchedName = currentCategory;
        isValid = "True";

        // Give it a special emoji depending on which group it matches!
        if (currentName === "smileys and people") {
          emojiIcon = "😀";
          catFaceTag.innerText = emojiIcon;
        } else if (currentName === "food and drink") {
          emojiIcon = "🍔";
          catBevTag.innerText = emojiIcon;
        } else {
          catFaceTag.innerText = "❓";
          catBevTag.innerText = "❓";
        }
      }
      // if (category.name === "smileys-and-people") {
      //   if (userSmileyText === "Smile" || userSmileyText === "smile") {
      //     textItemsList.push("😀");
      //   } else if (userSmileyText !== "") {
      //     textItemsList.push(userSmileyText);
      //   } else {
      //     textItemsList.push("😀");
      //   }
      // }

      // if (category.name === "food-and-drink") {
      //   if (userFoodText === "Apple" || userFoodText === "apple") {
      //     textItemsList.push("🍏");
      //   } else if (userFoodText !== "") {
      //     textItemsList.push(userFoodText);
      //   } else {
      //     textItemsList.push("🍏");
      //   }
      // }
    }
    const totalItems = textItemsList.length;
    let finalOutputText = "";

    if (totalItems === 1) {
      // If there's only one item, just use it directly
      finalOutputText = textItemsList[0];
    } else if (totalItems === 2) {
      // If there are exactly two items, combine them manually with "and"
      finalOutputText = textItemsList[0] + " and " + textItemsList[1];
    } else if (totalItems > 2) {
      // For three or more items, separate them with commas and add the final "and"
      finalOutputText =
        textItemsList[0] +
        ", " +
        textItemsList[1] +
        ", and " +
        textItemsList[2];
    }

    // Display that text string variable directly inside our HTML output tag
    outputTag.innerText = finalOutputText;
  } else {
    // This block runs if response.ok is false
    outputTag.innerText = "❌";
  }
}

formTag.addEventListener("submit", handleSubmit);
