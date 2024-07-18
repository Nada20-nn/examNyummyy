let mealsContainer = document.getElementById('mealsContainer');
let rowData = document.getElementById('rowData');
const loading = document.querySelector('.loaderContainer');

/////navbar/////

function toggleNav() {
  const sidenav = document.getElementById("sidenav");
  const toggleBtn = document.getElementById("toggleBtn");

  if (sidenav.style.left === "-280px" || sidenav.style.left === "") {
      sidenav.style.left = "0";
      toggleBtn.innerHTML = "&times;";
      $('.sidenav-inner a').each(function (i) {
          $(this).delay(i * 100).animate({ top: '0', opacity: '1' }, 300);
      });
  } else {
      $('.sidenav-inner a').each(function (i) {
          $(this).delay(i * 100).animate({ top: '20px', opacity: '0' }, 300);
      });
      setTimeout(() => {
          sidenav.style.left = "-280px";
          toggleBtn.innerHTML = "&#9776;";
      }, 700);
  }
}

document.querySelectorAll('.sidenav-inner .nav-link').forEach(link => {
  link.addEventListener('click', toggleNav);
});

/********************** Meals part ***********************/

async function getMeals() {
  loading.classList.remove('d-none'); 
  
  try {
    let mealsdata = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    let response = await mealsdata.json();
    displayMeals(response.meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
  } finally {
    loading.classList.add('d-none'); 
  }
}
getMeals();

function displayMeals(meal) {
  let cartona = '';
  for (let i = 0; i < meal.length; i++) {
    cartona += ` 
      <div class="col-lg-3 mealCard col-md-3" data-id="${meal[i].idMeal}">
        <div class="inner position-relative rounded-2 overflow-hidden cursor-pointer">
          <img class="width-100" src="${meal[i].strMealThumb}" >
          <div class="overlay text-center position-absolute d-flex align-items-center p-2">
            <h3 class="fs-2 txt-black">${meal[i].strMeal}</h3> 
          </div>
        </div>
      </div>`;
  }
  mealsContainer.innerHTML = cartona;

  document.querySelectorAll(".mealCard").forEach((card) => {
    card.addEventListener("click", () => {
      const mealId = card.dataset.id;
      getDetails(mealId);
      mealsContainer.classList.add('d-none');
      rowData.classList.remove('d-none');
    });
  });
}


async function getDetails(id) {
  loading.classList.remove('d-none');
  try{
    var res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    var data = await res.json();
    displayMealDetails(data.meals);
  }
  catch(error){
    console.error('Error fetching meals:', error);
  }
  finally{
    loading.classList.add('d-none');
  }
 
}

function displayMealDetails(data) {
  let cartona = '';

  let meal = data[0];
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    }
  }

  let tags = '';
  if (meal.strTags) {
    let tagsArray = meal.strTags.split(',');
    for (let tag of tagsArray) {
      tags += `<li class="alert alert-danger m-2 p-1">${tag}</li>`;
    }
  }

  cartona += ` 
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
        ${ingredients}
      </ul>
      <h3>Tags :</h3>
      <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tags}
      </ul>
      <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
    <button class="btn-close btn-close-white top-20 position-absolute end-20" id="closeBtn"></button>
    `;
  
  rowData.innerHTML = cartona;
  document.getElementById('closeBtn').addEventListener('click', () => {
    rowData.classList.add('d-none');
    mealsContainer.classList.remove('d-none');
  })
  
}

async function getCategories() {
  loading.classList.remove('d-none');
  try{
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let categoryData = await res.json();
    displayCategories(categoryData.categories);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
  
}

function displayCategories(meal) {
  let cartona = '';
  for (let i = 0; i < meal.length; i++) {
    cartona += ` 
      <div class="col-lg-3 categoryCard col-md-3" data-category="${meal[i].strCategory}">
        <div class="inner position-relative rounded-2 overflow-hidden cursor-pointer">
          <img class="width-100" src="${meal[i].strCategoryThumb}" >
          <div class="overlay text-center position-absolute d-flex align-items-center flex-column justify-content-center p-2">
            <h3 class="fs-2 txt-black">${meal[i].strCategory}</h3> 
            <p class="txt-black">${meal[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
          </div>
        </div>
      </div>`;
  }
  mealsContainer.innerHTML = cartona;

  document.querySelectorAll(".categoryCard").forEach((card) => {
    card.addEventListener("click", () => {
      const categoryName = card.dataset.category;
      getCategoryDetails(categoryName);
      mealsContainer.classList.remove('d-none');
    });
  });
}

async function getCategoryDetails(categoryName) {
  loading.classList.remove('d-none');
  try{
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
    let data = await res.json();
    displayMeals(data.meals);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
  
  
}

//*******************Area part************************

async function getArea() {
  loading.classList.remove('d-none');
  try{
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await res.json();
    displayArea(data.meals);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
  
}

function displayArea(meal) {
  let cartona = '';
  for (let i = 0; i < meal.length; i++) {
    cartona += `<div class="col-md-3 areaCard" data-area ="${meal[i].strArea}">
  <div class=" text-center cursor-pointer">
     <i class=" fa-solid fa-house-laptop fa-4x"></i>  
     <h3>${meal[i].strArea}</h3>
  </div>
</div>`;
  }
  mealsContainer.innerHTML = cartona;

  document.querySelectorAll(".areaCard").forEach((card) => {
    card.addEventListener("click", () => {
      const areaName = card.dataset.area;
      getAreaDetails(areaName);
      mealsContainer.classList.remove('d-none');
    });
  });
}

async function getAreaDetails(areaName) {
  loading.classList.remove('d-none');
  try{
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}
      `);
        let data = await res.json();
        displayMeals(data.meals);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
 
}

//********************Ingredients part*********************************

async function getIngredients() {
  loading.classList.remove('d-none');
  try{
    let res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    let data = await res.json();
    displayIngredients(data.meals);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
 
}

function displayIngredients(meal) {
  let cartona = '';
  for (let i = 0; i < 20; i++) {
    cartona += `<div class="col-lg-3 col-md-4 ingredientsCard" data-ingredient="${meal[i].strIngredient}">
                <div onclick="" class="cursor-pointer text-center">
                    <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                    <h3>${meal[i].strIngredient}</h3>
                    <p>${meal[i].strDescription ? meal[i].strDescription.split(" ").slice(0, 20).join(" ") : ''}</p>
                </div>
            </div>`;
  }
  mealsContainer.innerHTML = cartona;

  document.querySelectorAll(".ingredientsCard").forEach((card) => {
    card.addEventListener("click", () => {
      const ingredientName = card.dataset.ingredient;
      fetchMealsByIngredient(ingredientName);
      mealsContainer.classList.remove('d-none');
    });
  });
}

async function fetchMealsByIngredient(ingredientName) {
  loading.classList.remove('d-none');
  try{
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName}`);
    let data = await res.json();
    displayMeals(data.meals);
  }
  catch(err){
    console.log(err);
  }
  finally{
    loading.classList.add('d-none');
  }
 
}


//*************************Search part*****************************

function displaySearchInputs() {
  mealsContainer.innerHTML = `
  <div class="row py-4 ">
      <div class="col-md-6 ">
          <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
  </div>`

  rowData.innerHTML = ""
}

async function searchByName(value) {
  loading.classList.remove('d-none');
  try{
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`)
    response = await response.json()
    displayMeals(response.meals)
  }
  catch(err){
    console.log(err)
  }
  finally{
    loading.classList.add('d-none');
  }
  
}

async function searchByFLetter(value) {
    loading.classList.remove('d-none');
    try{
      let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${value}`)
      response = await response.json()
      displayMeals(response.meals)
    }
    catch(err){
      console.log(err)
    }
    finally{
      loading.classList.add('d-none');
    }
    
}




//*****************************contact part*************************
function showContacts() {
  mealsContainer.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
      <div class="container w-75 text-center">
        <div class="row g-4">
          <div class="col-md-6">
            <input id="nameInput" onkeyup="validateName()" type="text" class="form-control" placeholder="Enter Your Name">
            <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
              Special characters and numbers not allowed
            </div>
          </div>
          <div class="col-md-6">
            <input id="emailInput" onkeyup="validateEmail()" type="email" class="form-control " placeholder="Enter Your Email">
            <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
              Email not valid *example@yyy.zzz
            </div>
          </div>
          <div class="col-md-6">
            <input id="phoneInput" onkeyup="validatePhone()" type="text" class="form-control " placeholder="Enter Your Phone">
            <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid Phone Number
            </div>
          </div>
          <div class="col-md-6">
            <input id="ageInput" onkeyup="validateAge()" type="number" class="form-control " placeholder="Enter Your Age">
            <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid age
            </div>
          </div>
          <div class="col-md-6">
            <input id="passwordInput" onkeyup="validatePassword()" type="password" class="form-control " placeholder="Enter Your Password">
            <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
              Enter valid password *Minimum eight characters, at least one letter and one number*
            </div>
          </div>
          <div class="col-md-6">
            <input id="repasswordInput" onkeyup="validatePassword()" type="password" class="form-control " placeholder="Re-enter Password">
            <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
              Passwords do not match
            </div>
          </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3" onclick="clearInputs()">Submit</button>
      </div>
    </div>
  `;
  
  submitBtn = document.getElementById("submitBtn");
}
function validateName() {
  var nameInput = document.getElementById("nameInput");
  var nameAlert = document.getElementById("nameAlert");
  var isValidName = /^[a-zA-Z ]+$/.test(nameInput.value);
  
  updateValidationState(nameInput, isValidName, nameAlert);
  validateForm();
}

function validateEmail() {
  var emailInput = document.getElementById("emailInput");
  var emailAlert = document.getElementById("emailAlert");
  var isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
  
  updateValidationState(emailInput, isValidEmail, emailAlert);
  validateForm();
}

function validatePhone() {
  var phoneInput = document.getElementById("phoneInput");
  var phoneAlert = document.getElementById("phoneAlert");
  var isValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
  
  updateValidationState(phoneInput, isValidPhone, phoneAlert);
  validateForm();
}

function validateAge() {
  var ageInput = document.getElementById("ageInput");
  var ageAlert = document.getElementById("ageAlert");
  var isValidAge = /^[0-9]+$/.test(ageInput.value);
  
  updateValidationState(ageInput, isValidAge, ageAlert);
  validateForm();
}

function validatePassword() {
  var passwordInput = document.getElementById("passwordInput");
  var repasswordInput = document.getElementById("repasswordInput");
  var passwordAlert = document.getElementById("passwordAlert");
  var repasswordAlert = document.getElementById("repasswordAlert");
  
  var isValidPassword = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(passwordInput.value);
  if (!isValidPassword) {
    passwordInput.classList.add("is-invalid");
    passwordInput.classList.remove("is-valid");
    passwordAlert.classList.remove("d-none");
    passwordAlert.classList.add("d-block");
  } else {
    passwordInput.classList.remove("is-invalid");
    passwordInput.classList.add("is-valid");
    passwordAlert.classList.remove("d-block");
    passwordAlert.classList.add("d-none");
  }
  
  if (repasswordInput.value !== passwordInput.value) {
    repasswordInput.classList.add("is-invalid");
    repasswordInput.classList.remove("is-valid");
    repasswordAlert.classList.remove("d-none");
    repasswordAlert.classList.add("d-block");
  } else {
    repasswordInput.classList.remove("is-invalid");
    repasswordInput.classList.add("is-valid");
    repasswordAlert.classList.remove("d-block");
    repasswordAlert.classList.add("d-none");
  }
  
  validateForm();
}

function updateValidationState(inputElement, isValid, alertElement) {
  if (isValid) {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid");
    alertElement.classList.remove("d-block");
    alertElement.classList.add("d-none");
  } else {
    inputElement.classList.remove("is-valid");
    inputElement.classList.add("is-invalid");
    alertElement.classList.remove("d-none");
    alertElement.classList.add("d-block");
  }
}

function validateForm() {
  var nameInput = document.getElementById("nameInput");
  var emailInput = document.getElementById("emailInput");
  var phoneInput = document.getElementById("phoneInput");
  var ageInput = document.getElementById("ageInput");
  
  var passwordInput = document.getElementById("passwordInput");
  var repasswordInput = document.getElementById("repasswordInput");
  
  var isValidName = /^[a-zA-Z ]+$/.test(nameInput.value);
  var isValidEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(emailInput.value);
  var isValidPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phoneInput.value);
  var isValidAge = /^[0-9]+$/.test(ageInput.value);
  
  var isValidPassword = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(passwordInput.value);
  var passwordsMatch = (repasswordInput.value === passwordInput.value);

  var isValidForm = isValidName && isValidEmail && isValidPhone && isValidAge && isValidPassword && passwordsMatch;
  
  submitBtn.disabled = !isValidForm;
}

function clearInputs() {
  nameInput.value = '';
  nameInput.classList.remove("is-valid")
  emailInput.value = '';
  emailInput.classList.remove("is-valid")
  phoneInput.value = '';
  phoneInput.classList.remove("is-valid")
  ageInput.value = '';
  ageInput.classList.remove("is-valid")
  passwordInput.value = '';
  passwordInput.classList.remove("is-valid")
  repasswordInput.value = ''
  repasswordInput.classList.remove("is-valid")
}


