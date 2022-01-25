function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
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

const formValidation = () => {
  console.log('submit');
  }


// Form validation
//TODO factoriser la fonction required
const isTextValid = input => {
  if(!input.value) {  //Si le champs est vide
    console.log("champs requis");
    return false;
  }
  else if(input.value.length < 2) { // Si il n'est pas vide mais trop court
      console.log("trop court");
      return false;
  }

  return true;
}

const isValidMail = (input) => {
  if(!input.value) {  //Si le champs est vide
    console.log("champs requis");
    return false;
  }
  else {
    const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if(!regex.test(input.value)){
      console.log('mail invalide');
      return false;
    }
  }

  return true;
}

const isValidBirthdate = input => {
  if(!input.value) {  //Si le champs est vide
    console.log("champs requis");
    return false;
  }

  return true;
}

const isNumeric = (input) => {
  if(!input.value) {  //Si le champs est vide
    console.log("requis");
    return false;
  }
  else { 
    if(isNaN(input.value)) {
      console.log("valeur numérique attendue");
      return false;
    }
    else {
      const value = Number(input.value);
      if( value < 0 || !Number.isInteger(value)) {
        console.log("pas négatif et entier");
        return false;
      }
    }
  }

  return true;
}

const isCheckedRadio = (radiosArray) => {
  for(let radio of radiosArray) {
    if(radio.checked){
      return true;
    }
  }
  
  console.log("Vous devez selectionner un tournoi");
  return false;
}

const isChecked = input => {
  if(!input.checked) {
    console.log("Vous devez accepter");
    return false;
  }

  return true;
}


formSubmit.addEventListener("click", function(e) {
  e.preventDefault();

  //On vérifie que les champs sont valides
  isTextValid(firstName);

  isTextValid(lastName);

  isValidMail(mail); 

  isValidBirthdate(birthDate);

  isNumeric(quantity);

  isCheckedRadio(tournois);

  isChecked(cgu);

  //Si tout est valid on sibmit le form
  if(isTextValid(firstName) && isTextValid(lastName) && isValidMail(mail) && isValidBirthdate(birthDate) && isNumeric(quantity) && isCheckedLocation() && isChecked(cgu) ){
    console.log("valid");
    reserveForm.submit();
  }

});
