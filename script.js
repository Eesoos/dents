'use strict';

function debounce(callback, delay) {
  let timeout;

  return (argument) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(argument), delay);
  };
}

function toggleError(isValid, input) {
  if (isValid) {
    input.parentElement.parentElement.classList.remove('error');
  } else {
    input.parentElement.parentElement.classList.add('error');
  }
}

function maskPhone(e) {
  const value = inputPhone.value.replace(/\D+/g, '');
  const numberLength = 11;

  let result = '';

  for (let i = 0; i < value.length && i < numberLength; i++) {
    switch (i) {
      case 0:
        result += '+';
        break;
      case 1:
        result += ' (';
        break;
      case 4:
        result += ') ';
        break;
      case 7:
        result += '-';
        break;
      case 9:
        result += '-';
        break;
      default:
        break;
    }
    result += value[i];
  }

  inputPhone.value = result;
}

function validateName(name) {
  let isValid = name.length;

  toggleError(isValid, inputName);
  return isValid;
}

function validateMessage(message) {
  let isValid = message.length;

  toggleError(isValid, inputMessage);
  return isValid;
}

function validateEmail(email) {
  const regexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  let isValid = regexp.test(email);
  toggleError(isValid, inputEmail);
  return isValid;
}

function validatePhone(phone) {
  const regexp = /\D+/g;

  let number = phone.replace(regexp, '');
  let isValid = number.length === 11;

  toggleError(isValid, inputPhone);
  return isValid;
}

const container = document.querySelector('.container');

const form = document.getElementById('form');
const button = document.querySelector('.form__button');

const inputName = document.querySelector('.js-input-name');
const inputPhone = document.querySelector('.js-input-phone');
const inputEmail = document.querySelector('.js-input-email');
const inputMessage = document.querySelector('.js-input-message');

const inputs = document.querySelectorAll('.js-input');

inputs.forEach((input) => {
  input.addEventListener('blur', (e) => {
    if (e.target.value) {
      input.classList.add('not-empty');
    } else {
      input.classList.remove('not-empty');
      input.parentElement.parentElement.classList.remove('error');
    }
  });
});

inputName.addEventListener('input', (e) => {
  validateName(inputName.value);
});

inputMessage.addEventListener('input', (e) => {
  validateMessage(inputMessage.value);
});

inputPhone.addEventListener('input', (e) => {
  maskPhone(e);
  validatePhone(inputPhone.value);
});

inputEmail.addEventListener(
  'input',
  debounce(() => {
    validateEmail(inputEmail.value);
  }, 100)
);

async function formSend(e) {
  e.preventDefault();

  const formData = new FormData(form);
  formData.append('image', formImage.files[0]);

  const response = await fetch('sendmail.php', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const result = await response.json();
  }
}

form.addEventListener('submit', (e) => {
  let arr = [
    validateName(inputName.value),
    validateMessage(inputMessage.value),
    validateEmail(inputEmail.value),
    validatePhone(inputPhone.value),
  ];

  if (arr.every((el) => el)) {
    form.parentElement.classList.add('js-sending');
    formSend(e);
  } else {
    return;
  }
});

const formImage = document.querySelector('.js-input-image');
const formPreview = document.querySelector('.js-form-preview');

formImage.addEventListener('change', () => {
  if (
    !['image/jpeg', 'image/png', 'image/gif'].includes[formImage.files[0].type]
  ) {
    alert('Files must be .jpg, .png or .gif ');
    formImage.value = '';

    return;
  }

  let reader = new FileReader();

  reader.onload = (e) => {
    formPreview.innerHTML = `<img src="${e.target.result}" alt="Photo">`;
  };
  reader.onerror = () => {
    alert('Error');
  };
  reader.readAsDataURL(formImage.files[0].type);
});
