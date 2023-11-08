const inputs = document.querySelectorAll('input');
const submitBtn = document.querySelector('.form__submit-btn');
const fromContainer = document.querySelector('.container');
const passwordLock = document.querySelectorAll('.field__icon');
const errors = document.querySelectorAll('.field__error');

const user = {
   email: '',
   name: '',
   password: '',
   confirmPassword: '',
   confirmSignup: false,
};

const form = [
   {
      name: 'email',
      max: 100,
      regex: /^(?=.{1,100}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{3}.[A-Za-z]{2}$/,
      pattern: 'Must match the pattern: xxx@xxx.xx',
      errMessage: '',
   },
   { name: 'name', max: 150, errMessage: '' },
   {
      name: 'password',
      min: 8,
      max: 30,
      regex: /^(?=.*\W).{8,30}$/,
      pattern: 'Must contain at least 1 non-word character',
      errMessage: '',
   },
   { name: 'confirmPassword', errMessage: '' },
   { name: 'confirmSignup', errMessage: '' },
];

// make labels appear/dissapear based on focus and focusout events
const handleFocus = (event) => {
   const eventType = event.type;
   const { value } = event.target;

   if (value && eventType === 'focusout') {
      return;
   }

   if (eventType === 'focus') {
      event.target.placeholder = '';
      event.target.labels[0].style.visibility = 'visible';
   } else {
      event.target.placeholder = labels[0].textContent;
      event.target.labels[0].style.visibility = 'hidden';
   }
};

// add error text to UI and toggle red error class
const handleErrClass = (index) => {
   const formField = form[index];
   const errText = errors[index].textContent;

   if (errText && formField.name === 'confirmSignup') {
      errors[index].classList.remove('hidden');
   } else if (errText && formField.name !== 'confirmSignup') {
      inputs[index].classList.add('input--error');
      errors[index].classList.remove('hidden');
   } else {
      inputs[index].classList.remove('input--error');
      errors[index].classList.add('hidden');
   }
};

// update error messages based on inputs' values
const handleErrMessage = (entry, index) => {
   const [key, value] = entry;
   const formField = form[index];

   if (key === 'confirmSignup' && !user.confirmSignup) {
      errors[index].textContent = 'You should agree to sign up';
   } else if (!value && typeof value === 'string') {
      errors[index].textContent = "Can't be blank";
   } else if (value.length < formField.min) {
      errors[index].textContent = `Must be greater than ${formField.min}`;
   } else if (value.length > formField.max) {
      errors[index].textContent = `Must be less than ${formField.max}`;
   } else if (key === 'confirmPassword' && value !== user.password) {
      errors[index].textContent = 'Passwords must match';
   } else if (formField.regex && !formField.regex.test(value)) {
      errors[index].textContent = formField.pattern;
   } else {
      errors[index].textContent = '';
   }

   handleErrClass(index);
};

// helper function
const findIndex = (items, name) => {
   return Array.from(items).findIndex((item) => item.name === name);
};

// save inputs' values to the user object
const handleChange = (event) => {
   const { name, value, type, checked } = event.target;
   user[name] = type === 'checkbox' ? checked : value.trim();
};

// delete error message as a user types in and enable dynamic validation
const handleInput = (event) => {
   const { name, value } = event.target;
   const index = findIndex(inputs, name);
   handleDynamicValidation([name, value], index);
};

// return true if there are no err messages
const checkForm = () => {
   Object.entries(user).forEach((entry, index) => handleErrMessage(entry, index));
   return Array.from(errors).every((error) => !error.textContent.length);
};

// waits for a second before validation fires off
const handleDynamicValidation = (entry, index) => {
   setTimeout(() => {
      handleErrMessage(entry, index);
   }, 0);
};

const togglePassword = (event) => {
   let { previousElementSibling, classList } = event.target;

   classList.toggle('fa-unlock');

   if (classList.contains('fa-unlock')) {
      previousElementSibling.type = 'text';
   } else {
      previousElementSibling.type = 'password';
   }
};

const showSuccessMessage = () => {
   Swal.fire({
      title: '',
      text: 'Signed up successfully!',
      icon: 'success',
      confirmButtonText: 'Cool',
   });
};

const handleSubmit = (event) => {
   event.preventDefault();

   if (checkForm()) {
      localStorage.setItem('userData', JSON.stringify(user));
      fromContainer.style.display = 'none';
      showSuccessMessage();
   } else {
      throw new Error('Double check the form fields');
   }
};

inputs.forEach((input) => {
   input.addEventListener('focus', handleFocus);
   input.addEventListener('focusout', handleFocus);
   input.addEventListener('change', handleChange);
   input.addEventListener('input', handleInput);
});

passwordLock.forEach((lock) => lock.addEventListener('click', togglePassword));

submitBtn.addEventListener('click', handleSubmit);
