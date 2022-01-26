function editNav() {
  var nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
    nav.className += " responsive";
    //TODO add iverscroll hidden on body to prevent double scroll bar
  } else {
    nav.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");
const formData = document.querySelectorAll(".formData");
const closeModalBtn = document.getElementById("close-modal-btn");
const reserveForm = document.getElementById("reserve");
const formSubmit = document.querySelector("input[type='submit']");

// Form elements
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const mail = document.getElementById("mail");
const birthDate = document.getElementById("birthdate");
const quantity = document.getElementById("quantity");
const tournois = document.querySelectorAll("input[type=radio]");
const cgu = document.getElementById("cgu");


// Hide/Reveal modal
const launchModal = () => {
  modalbg.style.display = "block";
}
const closeModal = () => {
  modalbg.style.display= "none";
}

// Modal events
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
closeModalBtn.addEventListener("click", closeModal);


//Validation Form
class Validation {
  static errorMessages =  {
    isRequired: "Ce champs est requis",
    minLength: "Veuillez entrez au moins 2 caractères pour ce champs",
    invalidMail: "Veuillez entrez une adresse mail valide",
    isInteger: "La valeur doit être un entier positif",
    isOptionRequired: "Veuillez choisir une option",
    cgu: "Vous evez acceptez les conditions d'utilisation pour continuer"
  };

  constructor(field, rule) {
    this.field = field;
    this.rule = rule;
  }

  static createMessage (field, rule, name) {
    //Check if an error message already exits
    if(!document.querySelector(`.${field.name}-${rule}`)){
      //Select wher append message
      const formData = document.querySelector(`.${field.name}-formData`);

      //Create message element and add class
      const errorElement = document.createElement("p");
      errorElement.className = field.name + "-" + rule + " error-message";

      //Get error message and append to element
      let message = document.createTextNode(this.errorMessages[name ?? rule]);
      errorElement.appendChild(message);
  
      //Insert message element
      formData.appendChild(errorElement);
    }
  }

  static removeMessage (field, rule) {
    //Check if message exists before remove it
    if(document.querySelector(`.${field.name}-${rule}`)){
      document.querySelector(`.${field.name}-${rule}`).remove();
    }
  }

  static canSubmitField (input)  {
    fieldsToValidate[input.name] = "passed";
  }

  static canSubmitForm () {
    let fieldsPassedCount = 0;
    for( const field in fieldsToValidate) {
      if(fieldsToValidate[field] === "passed"){
        fieldsPassedCount++;
      }
    }
    
    if (fieldsPassedCount === Object.keys(fieldsToValidate).length){
      reserveForm.submit();
    }
  }

}


const mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const quantityRegex = /^[0-9]+$/;

let fieldsToValidate =  {
    firstname: "failed",
    lastname: "failed",
    mail: "failed",
    birthdate: "failed",
    quantity: "failed",
    location: "failed",
    cgu: "failed"
};

 
// Validations functions

const isRequired = input => {
  if(!input.value) {  
    Validation.createMessage(input, "isRequired");
    return false;
  }

  Validation.removeMessage(input, "isRequired");
  return true;
}

const hasMinLength = input => {
  if(input.value && input.value.length < 2) { 
    Validation.createMessage(input, "minLength");
    return false;
  }

  Validation.removeMessage(input, "minLength");
  return true;
}

const isTextValid = input => {
 if(!isRequired(input) || !hasMinLength(input)){
   return false;
 }

  Validation.canSubmitField(input);
}

const matchRegex = (input, regex, rule) => {
  if(input.value && !regex.test(input.value)){
    Validation.createMessage(input, rule);
    return false;
  }

  Validation.removeMessage(input, rule);
  return true;
}

const isValidBirthdate = input => {
  if(isRequired(input)){
    Validation.canSubmitField(input);
  }
}
const isValidMail = input => {
  if(!isRequired(input) || !matchRegex(input, mailRegex, "invalidMail")){
    return false;
  }

  Validation.canSubmitField(input);
}

const isValidQuantity = input => {
  if(!isRequired(input) || !matchRegex(input, quantityRegex, "isInteger")){
    return true;
  }

  Validation.canSubmitField(input);
}

const isOptionRequired = (group) => {
  for(let option of group) {
    if(option.checked){
      Validation.removeMessage(group[0], "isOptionRequired");
      Validation.canSubmitField(group[0]);
      return true;
    }
  }

  Validation.createMessage(group[0], "isOptionRequired");
  return false;
}

const isChecked = input  => {
  if(!input.checked) {
    Validation.createMessage(input, "isChecked", "cgu");
    return false;
  }

  Validation.removeMessage(input, "isChecked");
  Validation.canSubmitField(input);
  return true;
}


formSubmit.addEventListener("click", function(e) {
  e.preventDefault();

  //Run validation functions
  isTextValid(firstName);
  isTextValid(lastName);
  isValidMail(mail);
  isValidBirthdate(birthDate);
  isValidQuantity(quantity); 
  isOptionRequired(tournois);
  isChecked(cgu);

  //Submit form if it's valid
  Validation.canSubmitForm();
}, false);
