const inputs = document.querySelectorAll('input');
const submitBtn = document.querySelector('.form__submit-btn');
const fromContainer = document.querySelector('.container');
const passwordLock = document.querySelectorAll('.field__icon');

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
      regex: /^(?=.{1,100}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]{2,}.[A-Za-z]{2,}$/,
      pattern: 'Must match the pattern: xxx@xxx.xx',
      required: true,
      errMessage: '',
   },
   { name: 'name', max: 150, required: true, errMessage: '' },
   {
      name: 'password',
      min: 8,
      max: 30,
      regex: /^(?=.*\W).+$/,
      pattern: 'Must contant at least 1 non-word character',
      required: true,
      errMessage: '',
   },
   { name: 'confirmPassword', required: true, errMessage: '' },
   { name: 'confirmSignup', required: true, errMessage: '' },
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
   const errText = formField.errMessage;

   if (errText && formField.name !== 'confirmSignup') {
      inputs[index].classList.add('input--error');
   } else {
      inputs[index].classList.remove('input--error');
   }
};

const checkRegex = (options) => {
   const { formField, value, index } = options;
   const { regex, pattern } = formField;
   const lengthOk = checkLength(options);

   if (lengthOk && !regex.test(value)) {
      form[index].errMessage = pattern;
   }
};

const checkLength = (options) => {
   const { formField, value, index } = options;
   const { min, max, required } = formField;
   let err = '';

   if (required && !value.length) {
      err = "Can't be blank";
   } else if (min && value.length < min) {
      err = `Must be greater than ${min}`;
   } else if (max && value.length > max) {
      err = `Must be less than ${max}`;
   }

   form[index].errMessage = err;

   return err ? false : true;
};

const checkConfirm = (options) => {
   const { key, value, index } = options;
   let err = '';
  
   if (key === 'confirmSignup' && !user.confirmSignup) {
      err = 'You must agree to sign up';
   } else if (key === 'confirmPassword' && value !== user.password) {
      err = 'Passwords must match';
   } else if (key === 'confirmPassword' && !value.length) {
      err = "Can't be blank";
   } 

   form[index].errMessage = err;
};

const creatErrorMessage = (index) => {
   const formField = inputs[index];
   const err = form[index].errMessage;
   const existingError = formField.closest('.form__field').querySelector('.field__error');

   if (existingError && err) {
      existingError.textContent = err;
   } else if (!existingError && err) {
      const error = document.createElement('span');

      error.classList.add('field__error');
      error.textContent = err;

      formField.closest('.form__field').appendChild(error);
   } else if (existingError && !err) {
      formField.closest('.form__field').removeChild(existingError);
   }
};

// update error messages based on inputs' values
const handleErrMessage = (entry, index) => {
   const [key, value] = entry;
   const formField = form[index];
   const options = {
      formField,
      value,
      index,
      key,
   };

   switch (formField.name) {
      case 'email':
      case 'password':
         checkLength(options);
         checkRegex(options);
         break;
      case 'name':
         checkLength(options);
         break;
      case 'confirmPassword':
      case 'confirmSignup':
         checkConfirm(options);
         break;
   }

   creatErrorMessage(index);
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

// enable dynamic validation on every input event
const handleInput = (event) => {
   const { name, value } = event.target;
   const index = findIndex(inputs, name);

   setTimeout(() => {
      handleErrMessage([name, value], index);
   }, 0);
};

// return true if there are no err messages
const checkForm = () => {
   Object.entries(user).forEach((entry, index) => handleErrMessage(entry, index));
   return !form.some((field) => field.errMessage.length);
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
