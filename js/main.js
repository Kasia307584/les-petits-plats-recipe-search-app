import { recipes } from "./recipes.js";

// global variables
const result = document.querySelector(".cards");
const searchInputGlobal = document.getElementById("search-global-input");
const divListAppliance = document.querySelector(".search-tag-list__appliance");
const divListUstensils = document.querySelector(".search-tag-list__ustensils");
const divListIngredients = document.querySelector(
  ".search-tag-list__ingredients"
);
const inputAppliance = document.getElementById("search-tag-input__appliance");
const inputUstensil = document.getElementById("search-tag-input__ustensil");
const inputIngredient = document.getElementById("search-tag-input__ingredient");
const chevronApplianceDown = document.querySelector(
  ".search-tag-button__appliance i.fa-chevron-down"
);
const chevronApplianceUp = document.querySelector(
  ".search-tag-button__appliance i.fa-chevron-up"
);
const chevronUstensilsDown = document.querySelector(
  ".search-tag-button__ustensils i.fa-chevron-down"
);
const chevronUstensilsUp = document.querySelector(
  ".search-tag-button__ustensils i.fa-chevron-up"
);
const chevronIngredientsDown = document.querySelector(
  ".search-tag-button__ingredients i.fa-chevron-down"
);
const chevronIngredientsUp = document.querySelector(
  ".search-tag-button__ingredients i.fa-chevron-up"
);
let divListApplianceLi = null;
let divListUstensilsLi = null;
let divListIngredientsLi = null;
const divFilteredList = document.querySelector(
  ".selected-tags .selected-wrapper ul"
);

let idsDisplayedRecipe = [];
const selectedApplianceTags = [];
const selectedUstensilsTags = [];
const selectedIngredientsTags = [];

// function which creates recipe's HTML
const createRecipeElem = (recipe) => {
  let recipeHtml = document.createElement("div");
  recipeHtml.classList.add("recipe");

  let pIngredients = "";

  // loop through ingredients
  for (let ingredient of recipe.ingredients) {
    pIngredients += `<div class="ingredient"><span class="ingredient__name">${
      ingredient.ingredient
    }:</span> ${ingredient.quantity ? ingredient.quantity : ""} ${
      ingredient.unit ? ingredient.unit : ""
    }</div>`;
  }

  recipeHtml.innerHTML = `<div class="image"></div>
                          <div class="text">
                            <div class="recipe-header">
                              <h2>${recipe.name}</h2>
                              <div class="time"><i class="far fa-clock"></i><h2>${recipe.time} min</h2></div>
                            </div>
                            <div class="recipe-core">
                              <div class="ingredients">${pIngredients}</div>
                              <div class="description-wrapper">
                                <p>${recipe.description}</p>
                              </div>
                            </div>
                          </div>`;

  result.appendChild(recipeHtml);
};

// display recipes and stock ids of displayed recipes
recipes.forEach((recipe) => {
  createRecipeElem(recipe);
  idsDisplayedRecipe.push(recipe.id);
});

// function which checks the validity of the input value
const isInputValid = (input) => {
  if (input.validity.valid) {
    return true;
  }
};

// function which displays a message if no correcpondig recipe
const message = (arrayOfBooleans) => {
  if (!arrayOfBooleans.some((item) => item === true)) {
    result.innerHTML = `<p class="no-result-message">Aucune recette ne correspond à votre critère… vous pouvez
      chercher « tarte aux pommes », « poisson », etc.</p>`;
  }
};

// function which retrieves value from the global input and displays corresponding recipes
const globalInputSearch = () => {
  // get the user's input value
  const inputGlobalValue = searchInputGlobal.value.toLowerCase();

  // empty the gallery and the global variable
  result.innerHTML = "";
  idsDisplayedRecipe = [];

  // initialise booleans
  let isIncluded = false;
  let isAnyIncluded = []; // list of booleans true if value included in the recipe

  // loop through recipes
  recipes.forEach((recipe) => {
    let arrayOfBooleans = []; // booleans true/false depending if value included in ingredients

    // loop through ingredients
    recipe.ingredients.forEach((ingredient) => {
      arrayOfBooleans.push(
        ingredient.ingredient.toLowerCase().includes(inputGlobalValue)
      );
    });

    // check that the input text is included in recipes
    isIncluded =
      recipe.name.toLowerCase().includes(inputGlobalValue) ||
      recipe.description.toLowerCase().includes(inputGlobalValue) ||
      arrayOfBooleans.some((item) => item === true);

    // display the targeted recipes and stock ids of displayed recipes
    if (isIncluded) {
      createRecipeElem(recipe);
      isAnyIncluded.push(isIncluded);
      idsDisplayedRecipe.push(recipe.id);
    }
  });
  // display a message when there isn't any recipe which includes the input value
  message(isAnyIncluded);
};

// register keyup event on the global search input -> display corresponding recipes
searchInputGlobal.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (!isInputValid(searchInputGlobal)) {
    return;
  } else {
    globalInputSearch();
  }
});

// function which creates tag's list HTML and register event on each tag
const createLiTags = (tagList, parentElem) => {
  parentElem.innerHTML = "";

  let liTags = "";
  tagList.forEach((tag) => {
    liTags += `<li>${tag}</li>`;
  });

  parentElem.innerHTML = `<ul>${liTags}</ul>`;

  divListApplianceLi = document.querySelectorAll(
    "div.search-tag-list__appliance ul li"
  );
  divListUstensilsLi = document.querySelectorAll(
    "div.search-tag-list__ustensils ul li"
  );
  divListIngredientsLi = document.querySelectorAll(
    "div.search-tag-list__ingredients ul li"
  );

  // register click event on each tag -> display corresponding recipes and tag list, create selected tag's HTML
  divListApplianceLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e, "appliance");
      createLiTags(extractIncludedTags("appliance"), divListAppliance);
      removeTagList(divListAppliance);
      createSelectedElem(e.target.textContent, divFilteredList, "appliance");
      selectedApplianceTags.push(e.target.textContent);
      unformatPlaceholder(inputAppliance, "Appareil");
      chevronToRemove(chevronApplianceUp);
      chevronToDisplay(chevronApplianceDown);
    });
  });

  divListUstensilsLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e, "ustensils");
      createLiTags(extractIncludedTags("ustensils"), divListUstensils);
      removeTagList(divListUstensils);
      createSelectedElem(e.target.textContent, divFilteredList, "ustensils");
      selectedUstensilsTags.push(e.target.textContent);
      unformatPlaceholder(inputUstensil, "Ustensiles");
      chevronToRemove(chevronUstensilsUp);
      chevronToDisplay(chevronUstensilsDown);
    });
  });

  divListIngredientsLi.forEach((li) => {
    li.addEventListener("click", (e) => {
      filterByTag(e, "ingredients");
      createLiTags(extractIncludedTags("ingredients"), divListIngredients);
      removeTagList(divListIngredients);
      createSelectedElem(e.target.textContent, divFilteredList, "ingredients");
      selectedIngredientsTags.push(e.target.textContent);
      unformatPlaceholder(inputIngredient, "Ingrédients");
      chevronToRemove(chevronIngredientsUp);
      chevronToDisplay(chevronIngredientsDown);
    });
  });
};

// function which filter recipes by clicked tag
const filterByTag = (event, recipeElemType) => {
  let tempIds = [];
  let clickedTag = event.target.textContent;
  result.innerHTML = "";

  recipes.forEach((recipe) => {
    let ingredients = [];
    let normalised = [];

    if (recipe[recipeElemType] === recipe.ingredients) {
      recipe[recipeElemType].forEach((elem) => {
        ingredients.push(elem.ingredient);
      });
    }
    if (recipe[recipeElemType] === recipe.ustensils) {
      recipe[recipeElemType].forEach((elem) => {
        normalised.push(normalise(elem));
      });
    }
    if (
      idsDisplayedRecipe.includes(recipe.id) &&
      (recipe[recipeElemType] === clickedTag ||
        normalised.includes(clickedTag) ||
        ingredients.includes(clickedTag))
    ) {
      createRecipeElem(recipe);
      tempIds.push(recipe.id);
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which normalise the format of a tag
const normalise = (elem) => elem[0].toUpperCase() + elem.slice(1).toLowerCase();

// function which extracts tags (included in currently displayed recipes) into an array; returns the array
const extractIncludedTags = (recipeElemType) => {
  let includedTags = [];
  recipes.forEach((recipe) => {
    if (idsDisplayedRecipe.includes(recipe.id)) {
      if (recipe[recipeElemType] === recipe.ingredients) {
        recipe[recipeElemType].forEach((elem) => {
          includedTags.push(elem.ingredient);
        });
      } else if (recipe[recipeElemType] === recipe.ustensils) {
        let normalised = [];
        recipe[recipeElemType].forEach((elem) => {
          normalised.push(normalise(elem));
        });
        includedTags = includedTags.concat(normalised);
      } else {
        includedTags.push(recipe[recipeElemType]);
      }
    }
  });
  let includedTagsUnique = [...new Set(includedTags)];

  return includedTagsUnique;
};

// function which removes tag list
const removeTagList = (parentElem) => {
  parentElem.innerHTML = "";
};

// function which creates selected tag's HTML and register event on each closing icon
const createSelectedElem = (selectedTag, parentElem, categoryOfTag) => {
  const liElem = document.createElement("li");
  liElem.classList.add("selected-tag");
  liElem.innerHTML += `${selectedTag}<i class="far fa-times-circle"></i>`;
  if (categoryOfTag === "appliance") {
    liElem.classList.add("category-appliance");
  } else if (categoryOfTag === "ustensils") {
    liElem.classList.add("category-ustensils");
  } else {
    liElem.classList.add("category-ingredients");
  }
  // remove empty spaces from the tag name so it becomes a valid ID name
  selectedTag = selectedTag.replaceAll(" ", "-");
  liElem.setAttribute("id", `${selectedTag}`);

  parentElem.appendChild(liElem);

  const closeFiltred = document.querySelector(
    `li#${selectedTag} i.fa-times-circle`
  );

  // register click event on closing icon -> remove closed tag's HTML, re-fiter recipes and tag list
  closeFiltred.addEventListener("click", (e) => {
    // find the parent of the clicked icon
    const liTarget = e.target.closest("li");
    // remove the tag's HTML from the DOM tree
    liTarget.remove();
    // retrieve the text content from the tag
    let liTargetContent = e.target.closest("li").textContent;

    // check if the tag is ingredients/ustensils/appliance tag
    if (selectedIngredientsTags.includes(liTargetContent)) {
      // find the index of the closed tag in the array of tags
      const ingredientsIndex = selectedIngredientsTags.indexOf(liTargetContent);
      // remove the targeted tag form the array
      selectedIngredientsTags.splice(ingredientsIndex, 1);
    } else if (selectedUstensilsTags.includes(liTargetContent)) {
      const ustensilsIndex = selectedUstensilsTags.indexOf(liTargetContent);
      selectedUstensilsTags.splice(ustensilsIndex, 1);
    } else {
      const applianceIndex = selectedApplianceTags.indexOf(liTargetContent);
      selectedApplianceTags.splice(applianceIndex, 1);
    }

    // update recipes
    filterByGlobalInput();
    if (selectedApplianceTags.length !== 0) {
      filterBySelectedApplianceTags();
    }
    if (selectedUstensilsTags.length !== 0) {
      filterBySelectedUstensilsTags();
    }
    if (selectedIngredientsTags.length !== 0) {
      filterBySelectedIngredientsTags();
    }

    // update tag list
    createLiTags(extractIncludedTags("appliance"), divListAppliance);
    createLiTags(extractIncludedTags("ustensils"), divListUstensils);
    createLiTags(extractIncludedTags("ingredients"), divListIngredients);

    removeTagList(divListAppliance);
    removeTagList(divListUstensils);
    removeTagList(divListIngredients);
  });
};

// function which conditions the update of recipes depending on the global input
const filterByGlobalInput = () => {
  if (searchInputGlobal.value === "") {
    idsDisplayedRecipe = [];
    recipes.forEach((recipe) => {
      createRecipeElem(recipe);
      idsDisplayedRecipe.push(recipe.id);
    });
  } else {
    globalInputSearch();
  }
};

// function which filter recipes by selected appliance tags
const filterBySelectedApplianceTags = () => {
  let tempIds = [];
  result.innerHTML = "";

  recipes.forEach((recipe) => {
    for (let tag of selectedApplianceTags) {
      if (
        tag === recipe.appliance &&
        idsDisplayedRecipe.includes(recipe.id) &&
        !tempIds.includes(recipe.id)
      ) {
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
      }
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which filter recipes by selected ustensils tags
const filterBySelectedUstensilsTags = () => {
  let tempIds = [];
  result.innerHTML = "";

  recipes.forEach((recipe) => {
    let normalised = [];
    recipe.ustensils.forEach((elem) => {
      normalised.push(normalise(elem));
    });
    for (let tag of selectedUstensilsTags) {
      if (
        normalised.includes(tag) &&
        idsDisplayedRecipe.includes(recipe.id) &&
        !tempIds.includes(recipe.id)
      ) {
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
      }
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which filter recipes by selected ustensils tags
const filterBySelectedIngredientsTags = () => {
  let tempIds = [];
  result.innerHTML = "";

  recipes.forEach((recipe) => {
    let ingredients = [];
    recipe.ingredients.forEach((elem) => {
      ingredients.push(elem.ingredient);
    });
    for (let tag of selectedIngredientsTags) {
      if (
        ingredients.includes(tag) &&
        idsDisplayedRecipe.includes(recipe.id) &&
        !tempIds.includes(recipe.id)
      ) {
        createRecipeElem(recipe);
        tempIds.push(recipe.id);
      }
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which changes the format of the input placeholder
const formatPlaceholder = (inputCategory, placeholderValue) => {
  inputCategory.classList.add("new-format-placeholder");
  inputCategory.value = "";
  inputCategory.placeholder = placeholderValue;
};
// function which brings back the format of the input placeholder
const unformatPlaceholder = (inputCategory, placeholderValue) => {
  inputCategory.classList.remove("new-format-placeholder");
  inputCategory.value = "";
  inputCategory.placeholder = placeholderValue;
};
// function which displays a chevron
const chevronToDisplay = (chevronCategory) => {
  chevronCategory.style.display = "block";
};
// function which removes a chevron
const chevronToRemove = (chevronCategory) => {
  chevronCategory.style.display = "none";
};

// register click event on the appliance search input -> display appliance tags (included in currently displayed recipes)
inputAppliance.addEventListener("click", (e) => {
  formatPlaceholder(inputAppliance, "Rechercher un appareil");
  unformatPlaceholder(inputUstensil, "Ustensiles");
  unformatPlaceholder(inputIngredient, "Ingrédients");
  if (chevronUstensilsUp) {
    chevronToRemove(chevronUstensilsUp);
    chevronToDisplay(chevronUstensilsDown);
  }
  if (chevronIngredientsUp) {
    chevronToRemove(chevronIngredientsUp);
    chevronToDisplay(chevronIngredientsDown);
  }
  createLiTags(extractIncludedTags("appliance"), divListAppliance);
  removeTagList(divListUstensils);
  removeTagList(divListIngredients);
});

// register click event on the ustensils search input -> display ustensils tags (included in currently displayed recipes)
inputUstensil.addEventListener("click", (e) => {
  formatPlaceholder(inputUstensil, "Rechercher un ustensile");
  unformatPlaceholder(inputAppliance, "Appareil");
  unformatPlaceholder(inputIngredient, "Ingrédients");
  if (chevronApplianceUp) {
    chevronToRemove(chevronApplianceUp);
    chevronToDisplay(chevronApplianceDown);
  }
  if (chevronIngredientsUp) {
    chevronToRemove(chevronIngredientsUp);
    chevronToDisplay(chevronIngredientsDown);
  }
  createLiTags(extractIncludedTags("ustensils"), divListUstensils);
  removeTagList(divListAppliance);
  removeTagList(divListIngredients);
});

// register click event on the ingredients search input -> display ingredients tags (included in currently displayed recipes)
inputIngredient.addEventListener("click", (e) => {
  formatPlaceholder(inputIngredient, "Rechercher un ingrédient");
  unformatPlaceholder(inputAppliance, "Appareil");
  unformatPlaceholder(inputUstensil, "Ustensiles");
  if (chevronApplianceUp) {
    chevronToRemove(chevronApplianceUp);
    chevronToDisplay(chevronApplianceDown);
  }
  if (chevronUstensilsUp) {
    chevronToRemove(chevronUstensilsUp);
    chevronToDisplay(chevronUstensilsDown);
  }
  createLiTags(extractIncludedTags("ingredients"), divListIngredients);
  removeTagList(divListAppliance);
  removeTagList(divListUstensils);
});

// register click event on the appliance chevron icon -> display appliance tags (included in currently displayed recipes)
chevronApplianceDown.addEventListener("click", (e) => {
  chevronToDisplay(chevronApplianceUp);
  chevronToRemove(chevronApplianceDown);
  if (chevronUstensilsUp) {
    chevronToRemove(chevronUstensilsUp);
    chevronToDisplay(chevronUstensilsDown);
  }
  if (chevronIngredientsUp) {
    chevronToRemove(chevronIngredientsUp);
    chevronToDisplay(chevronIngredientsDown);
  }
  formatPlaceholder(inputAppliance, "Rechercher un appareil");
  unformatPlaceholder(inputUstensil, "Ustensiles");
  unformatPlaceholder(inputIngredient, "Ingrédients");
  createLiTags(extractIncludedTags("appliance"), divListAppliance);
  removeTagList(divListUstensils);
  removeTagList(divListIngredients);
});
// register click event on the ustensils chevron icon -> display ustensils tags (included in currently displayed recipes)
chevronUstensilsDown.addEventListener("click", (e) => {
  chevronToDisplay(chevronUstensilsUp);
  chevronToRemove(chevronUstensilsDown);
  if (chevronApplianceUp) {
    chevronToRemove(chevronApplianceUp);
    chevronToDisplay(chevronApplianceDown);
  }
  if (chevronIngredientsUp) {
    chevronToRemove(chevronIngredientsUp);
    chevronToDisplay(chevronIngredientsDown);
  }
  formatPlaceholder(inputUstensil, "Rechercher un ustensile");
  unformatPlaceholder(inputAppliance, "Appareil");
  unformatPlaceholder(inputIngredient, "Ingrédients");
  createLiTags(extractIncludedTags("ustensils"), divListUstensils);
  removeTagList(divListAppliance);
  removeTagList(divListIngredients);
});
// register click event on the ingredients chevron icon -> display ingredients tags (included in currently displayed recipes)
chevronIngredientsDown.addEventListener("click", (e) => {
  chevronToDisplay(chevronIngredientsUp);
  chevronToRemove(chevronIngredientsDown);
  if (chevronApplianceUp) {
    chevronToRemove(chevronApplianceUp);
    chevronToDisplay(chevronApplianceDown);
  }
  if (chevronUstensilsUp) {
    chevronToRemove(chevronUstensilsUp);
    chevronToDisplay(chevronUstensilsDown);
  }
  formatPlaceholder(inputIngredient, "Rechercher un ingrédient");
  unformatPlaceholder(inputAppliance, "Appareil");
  unformatPlaceholder(inputUstensil, "Ustensiles");
  createLiTags(extractIncludedTags("ingredients"), divListIngredients);
  removeTagList(divListAppliance);
  removeTagList(divListUstensils);
});
// register click event on the appliance chevron up icon -> remove tag list
chevronApplianceUp.addEventListener("click", (e) => {
  chevronToDisplay(chevronApplianceDown);
  chevronToRemove(chevronApplianceUp);
  unformatPlaceholder(inputAppliance, "Appareil");
  removeTagList(divListAppliance);
});
// register click event on the ustensils chevron up icon -> remove tag list
chevronUstensilsUp.addEventListener("click", (e) => {
  chevronToDisplay(chevronUstensilsDown);
  chevronToRemove(chevronUstensilsUp);
  unformatPlaceholder(inputUstensil, "Ustensiles");
  removeTagList(divListUstensils);
});
// register click event on the ingredients chevron up icon -> remove tag list
chevronIngredientsUp.addEventListener("click", (e) => {
  chevronToDisplay(chevronIngredientsDown);
  chevronToRemove(chevronIngredientsUp);
  unformatPlaceholder(inputIngredient, "Ingrédients");
  removeTagList(divListIngredients);
});

// function which filter recipes according to the input value (appliance)
const filterRecipesA = (recipeElemType, input, array) => {
  // empty the gallery
  result.innerHTML = "";
  // initialise variables
  let tempIds = []; // temporary variable
  let isApplianceIncluded = false;
  // loop through recipes
  recipes.forEach((recipe) => {
    isApplianceIncluded = recipe[recipeElemType].toLowerCase().includes(input);

    // display the targeted recipe and stock ids of displayed recipes
    if (isApplianceIncluded && idsDisplayedRecipe.includes(recipe.id)) {
      createRecipeElem(recipe);
      tempIds.push(recipe.id);
      array.push(idsDisplayedRecipe.includes(recipe.id));
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which filter recipes according to the input value (ingredients and ustensils)
const filterRecipesIU = (recipeElemType, input, array) => {
  // empty the gallery
  result.innerHTML = "";
  // initialise variables
  let tempIds = []; // temporary variable
  // loop through recipes
  recipes.forEach((recipe) => {
    let isAny = []; // booleans true/false depending if value inculded in ingredient
    // fill in the array with boolean values
    recipe[recipeElemType].forEach((elem) => {
      if (recipe[recipeElemType] === recipe.ingredients) {
        isAny.push(elem.ingredient.toLowerCase().includes(input));
      } else {
        isAny.push(elem.toLowerCase().includes(input));
      }
    });
    // display the targeted recipe and stock ids of displayed recipes
    if (
      isAny.some((item) => item === true) &&
      idsDisplayedRecipe.includes(recipe.id)
    ) {
      createRecipeElem(recipe);
      tempIds.push(recipe.id);
      array.push(idsDisplayedRecipe.includes(recipe.id));
    }
  });
  idsDisplayedRecipe = tempIds;
};

// function which extracts tags based on the input value into an array; returns the array
const extractIncludedValue = (recipeElemType, inputValue) => {
  let includedTags = [];
  recipes.forEach((recipe) => {
    if (idsDisplayedRecipe.includes(recipe.id)) {
      if (recipe[recipeElemType] === recipe.ingredients) {
        recipe[recipeElemType].forEach((elem) => {
          if (elem.ingredient.toLowerCase().includes(inputValue)) {
            includedTags.push(elem.ingredient);
          }
        });
      } else if (recipe[recipeElemType] === recipe.ustensils) {
        let normalised = [];
        recipe[recipeElemType].forEach((elem) => {
          if (elem.toLowerCase().includes(inputValue)) {
            normalised.push(normalise(elem));
          }
        });
        includedTags = includedTags.concat(normalised);
      } else {
        includedTags.push(recipe[recipeElemType]);
      }
    }
  });
  let includedTagsUnique = [...new Set(includedTags)];

  return includedTagsUnique;
};

// register keyup event on the appliance search input -> display corresponding recipes and filtered tags
inputAppliance.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (!isInputValid(inputAppliance)) {
    return;
  } else {
    // get the user's input value
    const inputApplianceValue = inputAppliance.value.toLowerCase();
    let isAnyApplianceIncluded = []; // booleans true if value included in the recipe
    // display the targeted recipes
    filterRecipesA("appliance", inputApplianceValue, isAnyApplianceIncluded);
    // display the targeted tags
    createLiTags(
      extractIncludedValue("appliance", inputApplianceValue),
      divListAppliance
    );
    // if there isn't any recipe which includes the input value then display the message
    message(isAnyApplianceIncluded);
  }
});

// register keyup event on the ustensil search input -> display corresponding recipes and filtered tags
inputUstensil.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (!isInputValid(inputUstensil)) {
    return;
  } else {
    // get the user's input value
    const inputUstensilValue = inputUstensil.value.toLowerCase(); // get the user's input value
    let isAnyUstensilIncluded = []; // booleans true if value included in the recipe
    // display the targeted recipes
    filterRecipesIU("ustensils", inputUstensilValue, isAnyUstensilIncluded);
    // display the targeted tags
    createLiTags(
      extractIncludedValue("ustensils", inputUstensilValue),
      divListUstensils
    );
    // if there isn't any recipe which includes the input value then display the message
    message(isAnyUstensilIncluded);
  }
});

// register keyup event on the ingredient search input -> display corresponding recipes and filtered tags
inputIngredient.addEventListener("keyup", (e) => {
  // check that at least 3 characters have been entred in the input field
  if (!isInputValid(inputIngredient)) {
    return;
  } else {
    // get the user's input value
    const inputIngredientValue = inputIngredient.value.toLowerCase(); // get the user's input value
    let isAnyIngredientIncluded = []; // booleans true if value included in the recipe
    // display the targeted recipes
    filterRecipesIU(
      "ingredients",
      inputIngredientValue,
      isAnyIngredientIncluded
    );
    // display the targeted tags
    createLiTags(
      extractIncludedValue("ingredients", inputIngredientValue),
      divListIngredients
    );
    // display the message when there isn't any recipe corresponding to the input value
    message(isAnyIngredientIncluded);
  }
});
