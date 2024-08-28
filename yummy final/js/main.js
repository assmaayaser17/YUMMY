/// <reference types="../@types/jquery" />
const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");


$(  function(){
    searchByName("").then(() => {
        $(".loading-screen").fadeOut(500);
        $("body").css("overflow", "visible");
    });
}   )


$('#demo').on('click',function(){

    $('.test').animate(  { width:'toggle' }, 2000 )

})




const openSideNav = () => {
    $(".side-nav-menu").animate({ left: 0 }, 500);
    $(".open-close-icon").removeClass("fa-align-justify").addClass("fa-x");

    $(".links li").each((i, element) => {
        $(element).animate({ top: 0 }, (i + 5) * 100);
    });
};

const closeSideNav = () => {
    const boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");
    $(".links li").animate({ top: 300 }, 500);
};

closeSideNav();



$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") === "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
});

const displayMeals = (arr) => {
    const cartoona = arr.map((meal) => `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meal.idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${meal.strMealThumb}" alt="">
                <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
        </div>`
    ).join("");

    rowData.innerHTML = cartoona;
};

async function fetchData(url) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function getCategories() {
    const data = await fetchData("https://www.themealdb.com/api/json/v1/1/categories.php");
    displayCategories(data.categories);
    $(".inner-loading-screen").fadeOut(300);
}

async function displayCategories(arr) {
    const cartoona = arr.map((category) => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>`
    ).join("");

    rowData.innerHTML = cartoona;
}

async function getArea() {
    const data = await fetchData("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    displayArea(data.meals);
}

async function displayArea(arr) {
    const cartoona = arr.map((area) => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>`
    ).join("");

    rowData.innerHTML = cartoona;
}

async function getIngredients() {
    const data = await fetchData("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
    displayIngredients(data.meals.slice(0, 20));
}

async function displayIngredients(arr) {
    const cartoona = arr.map((ingredient) => `
        <div class="col-md-3">
            <div onclick="getIngredientsMeals('${ingredient.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>`
    ).join("");

    rowData.innerHTML = cartoona;
}

async function getCategoryMeals(category) {
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    displayMeals(data.meals.slice(0, 20));
}

async function getAreaMeals(area) {
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    displayMeals(data.meals.slice(0, 20));
}

async function getIngredientsMeals(ingredients) {
    const data = await fetchData(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    displayMeals(data.meals.slice(0, 20));
}

async function getMealDetails(mealID) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);
    searchContainer.innerHTML = "";

    const response = await fetchData(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    displayMealDetails(response.meals[0]);
    $(".inner-loading-screen").fadeOut(300);
}

function displayMealDetails(meal) {
    searchContainer.innerHTML = "";

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        }
    }

    const tags = meal.strTags ? meal.strTags.split(",") : [];
    const tagsStr = tags.map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("");

    const cartoona = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2>${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients.map((ingredient) => `<li class="alert alert-info m-2 p-1">${ingredient}</li>`).join("")}
        </ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
        </ul>
        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`;

    rowData.innerHTML = cartoona;
}

const showSearchInputs = () => {
    searchContainer.innerHTML = `
    <div class="row py-4">
        <div class="col-md-6">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`;

    rowData.innerHTML = "";
};

async function searchByName(term) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    const response = await fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const meals = response.meals || [];
    displayMeals(meals);
    $(".inner-loading-screen").fadeOut(300);
}

async function searchByFLetter(term) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    term === "" ? term = "a" : "";
    const response = await fetchData(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
    const meals = response.meals || [];
    displayMeals(meals);
    $(".inner-loading-screen").fadeOut(300);
}

const showContacts = () => {
    rowData.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Email not valid *exemple@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid age
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid repassword 
                    </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>`;

    submitBtn = document.getElementById("submitBtn");

    const inputs = ["nameInput", "emailInput", "phoneInput", "ageInput", "passwordInput", "repasswordInput"];
    inputs.forEach((inputId) => {
        document.getElementById(inputId).addEventListener("focus", () => {
            window[inputId + "Touched"] = true;
        });
    });
};

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

const inputsValidation = () => {
    if (nameInputTouched) {
        validateInput("nameInput", "nameAlert", nameValidation());
    }
    if (emailInputTouched) {
        validateInput("emailInput", "emailAlert", emailValidation());
    }
    if (phoneInputTouched) {
        validateInput("phoneInput", "phoneAlert", phoneValidation());
    }
    if (ageInputTouched) {
        validateInput("ageInput", "ageAlert", ageValidation());
    }
    if (passwordInputTouched) {
        validateInput("passwordInput", "passwordAlert", passwordValidation());
    }
    if (repasswordInputTouched) {
        validateInput("repasswordInput", "repasswordAlert", repasswordValidation());
    }

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
        submitBtn.removeAttribute("disabled");
    } else {
        submitBtn.setAttribute("disabled", true);
    }
};

const validateInput = (inputId, alertId, isValid) => {
    if (isValid) {
        document.getElementById(alertId).classList.replace("d-block", "d-none");
    } else {
        document.getElementById(alertId).classList.replace("d-none", "d-block");
    }
};

const nameValidation = () => /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
const emailValidation = () => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value);
const phoneValidation = () => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
const ageValidation = () => /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
const passwordValidation = () => /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
const repasswordValidation = () => document.getElementById("repasswordInput").value === document.getElementById("passwordInput").value;
