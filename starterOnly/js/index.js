// *********************  BURGER MENU **********************
const header = document.getElementsByTagName("header")[0];

const burgerDisplay = () => {
  if (header.className === "topnav") {
    header.className += " responsive";
  } else {

    header.className = "topnav";
  }
} 
//*********************************************************



//*********************RESERVATION FORM***********************************
const modalbg = document.querySelector(".bground");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalBtn = document.querySelectorAll(".modal-btn");

// Hide/Reveal modal
const launchModal = () => {
  modalbg.style.display = "block";
}
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

const closeModal = () => {
  modalbg.style.display= "none";
}
closeModalBtn.addEventListener("click", closeModal);


//VALIDATION RESERVATION FORM
let errorsForm = [];

const errorMessages = {
  isRequired: "Ce champs est requis",
  minLength: "Veuillez entrez au moins 2 caractères pour ce champs",
  invalidMail: "Veuillez entrez une adresse mail valide",
  dateRange: "Les tournois sont ouverts aux personnes agés de 5 à 99 ans",
  invalidQuantity: "Veuillez entrer une valeur entre 0 et 99",
  optionRequired: "Veuillez choisir une option",
  cguUnchecked: "Vous devez acceptez les conditions d'utilisation pour continuer"

}

const validationRules = {
  length: 2,
  mailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  dateRegex: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
  quantityRegex: /^(0?[0-9]|[1-9][0-9])$/
}

//Validation functions

//Remove error message from errorsForm
const removeFromErrorsForm = input => {
  delete errorsForm[input.name];
}

//****************************SINGLE TESTS****************************//
//Test if is empty
const isNotEmpty = (input) => {
  if(!input.value){
    errorsForm[input.name] = errorMessages.isRequired; 
    console.log(errorsForm)
  } else {
    removeFromErrorsForm(input);
  }
  return !!input.value;
}

//Test if text has min length
const hasMinLength = input => {
  if(input.value.length < validationRules.length) {
    errorsForm[input.name] = errorMessages.minLength;
  } else {
    removeFromErrorsForm(input);
  }
}

//Test regex
const matchRegex = (input, inputRegex, errorMessage) => {
  const regex = new RegExp(inputRegex);
  if(!regex.test(input.value)){
    errorsForm[input.name] = errorMessage;
  }
  else {
    removeFromErrorsForm(input);
  }
}

//Test range date
const dateRange = input => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();

  //Age must be lower than 100years and higher than 5 years
  if(new Date(input.value) <= new Date(year - 100, month, day + 1) || new Date(input.value) > new Date(year - 5, month, day + 1)){
    errorsForm[input.name] = errorMessages.dateRange;
  } else {
    removeFromErrorsForm(input);
  }
}
//*********************************************************************//



//****************************INPUTS TESTS****************************//

//Validation text input = not empty + has min length
const validateInputText = input => {
  if(!isNotEmpty(input)){
    return false;
  }
  hasMinLength(input);
}

//Validation mail = not empty + valid mail
const validateMail = input => {
  if(!isNotEmpty(input)){
    return false;
  }
  matchRegex(input, validationRules.mailRegex, errorMessages.invalidMail);
}

//Validation birthdate = not empty and in range
const validateBirthdate = input => {
  if(!isNotEmpty(input)) {
    return false;
  }
  dateRange(input);
}

//Validate quantity = not empty and in range
const validateQuantity = input => {
  if(!isNotEmpty(input)){
    return false;
  }
  matchRegex(input, validationRules.quantityRegex, errorMessages.invalidQuantity)
}

//Validate tournoi
const validateRadio = input => {
  if(!Object.values(input).some(element => element.checked)){
    errorsForm[input[0].name] = errorMessages.optionRequired; 
  } else {
    removeFromErrorsForm(input[0]);
  }
}

//Validate CGU
const validateCheckbox = input => {
  if(!input.checked){
    errorsForm[input.name] = errorMessages[input.name + "Unchecked"];
  } else {
    removeFromErrorsForm(input);
  }  
} 
//*********************************************************************//


//DOM Inputs
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const mail = document.getElementById("mail");
const birthDate = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const tournois = document.querySelectorAll("input[type=radio]");
const cgu = document.getElementById("cgu");

// Validations functions
const validationForm = () => {
  validateInputText(firstName);

  validateInputText(lastName);

  validateMail(mail)

  validateBirthdate(birthDate);

  validateQuantity(quantity);

  validateRadio(tournois);

  validateCheckbox(cgu);
}

//Errors display/hide
const formData = document.querySelectorAll(".formData");

const createErrorElement = (inputName) => {
  //Create p tag with error-message class
  const errorDOMElement = document.createElement("p");
  errorDOMElement.className = "error-message";

  //Append error message 
  const message = document.createTextNode(errorsForm[inputName]);

  const targetFormData = document.querySelector("." + inputName + "-formData");
  errorDOMElement.appendChild(message);

  targetFormData.appendChild(errorDOMElement);

}

const manageErrorMessage = () => {
  const errorsDisplayed = document.querySelectorAll(".error-message");
  errorsDisplayed.forEach(element => element.remove());

  for(const inputName in errorsForm){
    createErrorElement(inputName);
  }
}

const submitForm = () => {
  console.log("errors count:  " + Object.keys(errorsForm).length);
  if(Object.keys(errorsForm).length === 0) {
    reserveForm.submit();
  } 
}

//Submit form  fields are valid
const reserveForm = document.getElementById("reserve");
const formSubmit = document.querySelector("input[type='submit']");





formSubmit.addEventListener("click", function(e) {
  e.preventDefault();

  //Run validation functions
 validationForm();

 //Display/Hide error message
 manageErrorMessage();

 submitForm();
}, false);
