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
const body = document.querySelector("body");

// Hide/Reveal modal
const launchModal = () => {
  modalbg.style.display = "block";
  body.style.overflowY = "hidden"; // Prevent double scroll when modal launch
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
  text: "Veuillez entrez au moins 2 caractères pour ce champs.(chiffres non acceptés, un seul espace entre les mots).",
  invalidMail: "Veuillez entrez une adresse mail valide",
  dateRange: "Les tournois sont ouverts aux personnes agés de 5 à 99 ans",
  invalidQuantity: "Veuillez entrer une valeur entre 0 et 99",
  optionRequired: "Veuillez choisir une option",
  cguUnchecked: "Vous devez acceptez les conditions d'utilisation pour continuer"
}

const validationRules = {
  name: /^(?=.{2,50}$)[a-zÀ-ÿ]+(?:['-\s][a-zÀ-ÿ]+)*$/gi, //Min 2 chars. Accents, ' , -  are allowed and insensitive case
  mailRegex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  dateRegex: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
  quantityRegex: /^(0?[0-9]|[1-9][0-9])$/
}


//****************************TESTS FUNCTIONS****************************//
//Test if is empty
const notEmpty = v => !!v;

/**
 * Create an object
 * @param {string} inputName
 * @param {string} errorMessage
 * @returns {object}
 */
const createKeyValueObject = (inputName, errorMessage) => {
  const error = {};
  error[inputName] = errorMessage;
  return error;
}

/**
 *  Test if input value match regex
 * @param {object} input 
 * @param {string} inputRegex 
 * @param {string} errorMessage 
 * @returns {object|null} Object error or null
 */
const matchRegex = (input, inputRegex, errorMessage) => {
  const regex = new RegExp(inputRegex);
  if(!regex.test(input.value)){
    return createKeyValueObject(input.name, errorMessage);
  }
  return null;
}

/**
 * Test if date is in range
 * @param {object} input 
 * @returns {object|null} Object error or null
 */
const dateRange = input => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();

  //Age must be lower than 100 years and higher than 5 years
  if(new Date(input.value) <= new Date(year - 100, month, day + 1) || new Date(input.value) > new Date(year - 5, month, day + 1)){
    return createKeyValueObject(input.name, errorMessages.dateRange);
  } 
  return null;
}

/**
 * Test input text = not empty and match regex
 * @param {object} input 
 * @returns {object|null} Object error or null
 */
const validateInputText = input => {
  if (!notEmpty(input.value)) {
    return createKeyValueObject(input.name, errorMessages.isRequired);
  }
  return matchRegex(input, validationRules.name, errorMessages.text);
}

/** Test input mail = not empty + valid mail
 *  @param {object} input
 *  @returns {object|null} Error Object or null 
 */
const validateMail = input => {
  if (!notEmpty(input.value)) {
    return createKeyValueObject(input.name, errorMessages.isRequired);
  }
  return matchRegex(input, validationRules.mailRegex, errorMessages.invalidMail);
}

/**
 * Test input birthDate = not empty + date in range
 * @param {object} input 
 * @returns {object|null} Error Object or null
 */
const validateBirthdate = input => {
  if (!notEmpty(input.value)) {
    return createKeyValueObject(input.name, errorMessages.isRequired);
  }
  return dateRange(input);
}

/**
 * Test input number
 * @param {object} input 
 * @returns {object|null} Error Object or null
 */
//Validate quantity = not empty and in range
const validateQuantity = input => {
  if (!notEmpty(input.value)) {
    return createKeyValueObject(input.name, errorMessages.isRequired);
  }
  return matchRegex(input, validationRules.quantityRegex, errorMessages.invalidQuantity)
}

/**
 * Test if one radio is checked
 * @param {object} inputGroup 
 * @returns {object|null} Error Object or null
 */
const validateRadio = inputGroup => {
  if(!Object.values(inputGroup).some(element => element.checked)){
    return createKeyValueObject(inputGroup[0].name, errorMessages.optionRequired);
  } 
  return null;
}

/**
 * Test checkbox
 * @param {object} input 
 * @returns {object|null} Error Object or null
 */
const validateCheckbox = input => {
  if(!input.checked){
    return createKeyValueObject(input.name, errorMessages[input.name + "Unchecked"]);
  } 
  return null;
} 


//*****************************ERRORS**************************************
/**
 * Create error element and append in DOM
 * @param {string} inputName 
 * @param {string} errorMessage 
 */
const createErrorElement = (inputName, errorMessage) => {
  //Create p tag with error-message class
  const errorDOMElement = document.createElement("p");
  errorDOMElement.className = "error-message";

  const message = document.createTextNode(errorMessage); //Create messsage and append to errorElement
  errorDOMElement.appendChild(message);

  const targetFormData = document.querySelector("." + inputName + "-formData"); // Target right formData and append errorElement
  targetFormData.appendChild(errorDOMElement);
}

/** Remove all errors messages in DOM */
const cleanAllFormErrors = () => {
  const errorsDisplayed = document.querySelectorAll(".error-message");
  errorsDisplayed?.forEach(element => element.remove());
}

/**
 * Loop on errors and send each error to createErrorElement
 * @param {Array} errors 
 */
const manageErrorMessage = (errors) => {
  errors.map(error => createErrorElement(Object.keys(error), error[Object.keys(error)]));
}

const validationMessage = document.querySelector(".form-validation-message");
/**
 * On submit = submit form and display confirmation message
 */
const submitForm = () => {
  reserveForm.reset(); //submit when backend for datas
  validationMessage.style.display = "flex"; 
}

//*******************************Form listener********************************************
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

/**
 * Validation process on submit
 * @param {event} e
 */
const validateForm = (e) => {
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
  console.log(errors)

  if(errors.length > 0) {
    // Form not valid
    manageErrorMessage(errors);
    return;
  }

  submitForm();
}
formSubmit.addEventListener("click", event => validateForm(event), false);
