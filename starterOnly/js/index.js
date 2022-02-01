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
const closeModalBtn = document.querySelectorAll(".close-modal")
const modalBtn = document.querySelectorAll(".modal-btn");

// Hide/Reveal modal
const launchModal = () => {
  modalbg.style.display = "block";
}
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

const closeModal = () => {
  modalbg.style.display= "none";
  validationMessage.style.display = "none";
}
closeModalBtn.forEach(closeModalBtn => closeModalBtn.addEventListener("click", closeModal));


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
  name: /^(?=.{2,50}$)[a-zÀ-ÿ]+(?:['-\s][a-zÀ-ÿ]+)*$/gi, //Min 2 chars. Accents, ' and - allowed and insensitive case
  mailRegex: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  dateRegex: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
  quantityRegex: /^(0?[0-9]|[1-9][0-9])$/
}

//Validation functions
const notEmpty = v => !!v;
const errors ={};
//Remove error message from errorsForm
const removeFromErrorsForm = input => {
  delete errorsForm[input.name];
}

//****************************SINGLE TESTS****************************//
//Test if is empty
const isNotEmpty = (input) => {
  return !!input.value;
}

//Test regex
const matchRegex = (input, inputRegex, errorMessage) => {
  const regex = new RegExp(inputRegex);
  if(!regex.test(input.value)){
    const error = {};
    error[input.name] = errorMessage;
    return error;
  }
  return null;
}

//Test range date
const dateRange = input => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();

  //Age must be lower than 100years and higher than 5 years
  if(new Date(input.value) <= new Date(year - 100, month, day + 1) || new Date(input.value) > new Date(year - 5, month, day + 1)){
    const error = {}
    error[input.name] = errorMessages.dateRange;
    return error;
  } 
  return null;
}
//*********************************************************************//



//****************************INPUTS TESTS****************************//

//Validation text input = not empty + has min length
const validateInputText = input => {
  if (!isNotEmpty(input)) {
    const error = {};
    error[input.name] = errorMessages.isRequired;
    return error;
  }
  return matchRegex(input,validationRules.name, errorMessages.minLength);
}

//Validation mail = not empty + valid mail
const validateMail = input => {
  if (!isNotEmpty(input)) {
    const error = {};
    error[input.name] = errorMessages.isRequired;
    return error;
  }
  return matchRegex(input, validationRules.mailRegex, errorMessages.invalidMail);
}

//Validation birthdate = not empty and in range
const validateBirthdate = input => {
  if (!isNotEmpty(input)) {
    const error = {};
    error[input.name] = errorMessages.isRequired;
    return error;
  }
  return dateRange(input);
}

//Validate quantity = not empty and in range
const validateQuantity = input => {
  if (!isNotEmpty(input)) {
    const error = {};
    error[input.name] = errorMessages.isRequired;
    return error;
  }
  return matchRegex(input, validationRules.quantityRegex, errorMessages.invalidQuantity)
}

//Validate tournoi
const validateRadio = input => {
  if(!Object.values(input).some(element => element.checked)){
    const error = {};
    error[input[0].name] = errorMessages.optionRequired;
    return error;
  } 
  return null;
}

//Validate CGU
const validateCheckbox = input => {
  if(!input.checked){
    const error = {};
    error[input.name] = errorMessages[input.name + "Unchecked"];
    return error;
  } 
  return null;
} 
//*********************************************************************//


//ERRORS*******************************************************************
  //Create error element
  const createErrorElement = (inputName, errorMessage) => {
  //Create p tag with error-message class
  const errorDOMElement = document.createElement("p");
  errorDOMElement.className = "error-message";

  const message = document.createTextNode(errorMessage); //Create messsage and append to errorElement
  errorDOMElement.appendChild(message);

  const targetFormData = document.querySelector("." + inputName + "-formData"); // Target right formData and append errorElement
  targetFormData.appendChild(errorDOMElement);
}

//Remove all errors
const cleanAllFormErrors = () => {
  const errorsDisplayed = document.querySelectorAll(".error-message");
  errorsDisplayed?.forEach(element => element.remove());
}

//Manage error. Map on all error and send to createErrorElement
const manageErrorMessage = (errors) => {
  errors.map(error => createErrorElement(Object.keys(error), error[Object.keys(error)]));
}

const validationMessage = document.querySelector(".form-validation-message");
const submitForm = () => {
  reserveForm.reset();
  if(Object.keys(errorsForm).length === 0) {
    validationMessage.style.display = "flex"
  } 
}

//Form listener***************************************************************************
const reserveForm = document.getElementById("reserve");
const formSubmit = document.querySelector("input[type='submit']");
//DOM Inputs
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const mail = document.getElementById("mail");
const birthDate = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const tournois = document.querySelectorAll("input[type=radio]");
const cgu = document.getElementById("cgu");

formSubmit.addEventListener("click", function(e) {
  e.preventDefault();

  cleanAllFormErrors();

  const errors = [
    validateInputText(firstName),
    validateInputText(lastName),
    validateMail(mail),
    validateBirthdate(birthDate),
    validateQuantity(quantity),
    validateRadio(tournois),
    validateCheckbox(cgu)
  ].filter(notEmpty);

  if(errors.length > 0) {
    // Form not valid
    manageErrorMessage(errors);
    return;
  }

 submitForm();

}, false);
