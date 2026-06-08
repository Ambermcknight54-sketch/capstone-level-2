function normalizeCategoryInput(text) {
  return text.trim().toLowerCase().replace(/\s+/g, "-");
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const outputTag = document.getElementById("category");
  const catFaceTag = document.getElementById("category-faces");
  const catBevTag = document.getElementById("category-beverages");

  if (outputTag) {
    outputTag.innerText = "⏳ please wait";
  }

  try {
    const response = await fetch("https://emojihub.yurace.pro/api/categories");

    if (!response.ok) {
      if (outputTag) {
        outputTag.innerText = "❌ Could not fetch categories.";
      }
      return;
    }

    const categoriesArray = await response.json();
    const userSmileyText = normalizeCategoryInput(
      form.elements["smileys-and-people"].value,
    );
    const userFoodText = normalizeCategoryInput(
      form.elements["food-and-drink"].value,
    );

    sessionStorage.setItem("userSmileyText", userSmileyText);
    sessionStorage.setItem("userFoodText", userFoodText);

    let matchedName = "No match found.";
    let textItemsList = [];

    for (let i = 0; i < categoriesArray.length; i++) {
      const currentCategory = categoriesArray[i];
      const currentName = currentCategory.toLowerCase();
      let emojiIcon = "❓";

      if (currentName === userSmileyText || currentName === userFoodText) {
        matchedName = currentCategory;

        if (currentName === "smileys-and-people") {
          emojiIcon = "😀";
          if (catFaceTag) {
            catFaceTag.innerText = emojiIcon;
          }
        } else if (currentName === "food-and-drink") {
          emojiIcon = "🍔";
          if (catBevTag) {
            catBevTag.innerText = emojiIcon;
          }
        }

        textItemsList.push(matchedName);
      }
    }

    const totalItems = textItemsList.length;
    let finalOutputText = matchedName;

    if (totalItems === 0) {
      finalOutputText = "No matching categories found.";
    } else if (totalItems === 2) {
      finalOutputText = `${textItemsList[0]} and ${textItemsList[1]}`;
    } else if (totalItems > 2) {
      finalOutputText = `${textItemsList.slice(0, 2).join(", ")} and ${textItemsList[2]}`;
    }

    if (outputTag) {
      outputTag.innerText = finalOutputText;
    }
  } catch (error) {
    if (outputTag) {
      outputTag.innerText = "❌ An error occurred.";
    }
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const formTag = document.getElementById("queryForm");
  if (!formTag) {
    return;
  }

  formTag.addEventListener("submit", handleSubmit);
});
