import { useState } from 'react';

export function YourInfo({ model, dispatch }) {
  let [ariaInvalid, setAriaInvalid] = useState({
    name: false,
    email: false,
    telephone: false,
  });

  let [errorMessage, setErrorMessage] = useState({
    name: '',
    email: '',
    telephone: '',
  });

  let [ariaDisabled, setAriaDisabled] = useState(true);

  return (
    <fieldset className="space-y-4" hidden={model.currentStep != 'your-info'}>
      <div>
        <legend className="text-xl font-bold text-blue-900 sm:text-3xl">
          Personal info
        </legend>

        <p className="text-blue-900/70 sm:text-lg">
          Please provide your name, email address, and phone number.
        </p>
      </div>

      <div className="space-y-2">
        <div className="grid">
          <label htmlFor="name" className="text-blue-900 sm:text-lg">
            Name
          </label>

          <input
            id="name"
            className="rounded-md border-2 border-blue-500 focus:ring-0 focus:outline-2 focus:outline-blue-500 aria-invalid:border-red-500 sm:text-lg"
            type="text"
            name="name"
            placeholder="e.g. Stephen King"
            autoComplete="name"
            aria-invalid={ariaInvalid.name}
            aria-describedby="name-error"
            required
            onInput={function (event) {
              setAriaDisabled(!isInfoValid());

              let [isValid, reason] = validateName(event.target.value);

              setErrorMessage((em) => ({
                ...em,
                name: isValid ? '' : reason,
              }));

              setAriaInvalid((ai) => ({
                ...ai,
                name: !isValid,
              }));
            }}
          />

          <span
            id="name-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          >
            {errorMessage.name}
          </span>
        </div>

        <div className="grid">
          <label htmlFor="email" className="text-blue-900 sm:text-lg">
            Email address
          </label>

          <input
            id="email"
            className="rounded-md border-2 border-blue-500 focus:ring-0 focus:outline-2 focus:outline-blue-500 aria-invalid:border-red-500 sm:text-lg"
            type="email"
            name="email"
            placeholder="e.g. stephenKing42@hotmail.com"
            autoComplete="email"
            aria-invalid={ariaInvalid.email}
            aria-describedby="email-error"
            required
            onInput={function () {
              setAriaDisabled(!isInfoValid());

              let [isValid, reason] = validateEmail(event.target.value);

              setErrorMessage((em) => ({
                ...em,
                email: isValid ? '' : reason,
              }));

              setAriaInvalid((ai) => ({
                ...ai,
                email: !isValid,
              }));
            }}
          />

          <span
            id="email-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          >
            {errorMessage.email}
          </span>
        </div>

        <div className="grid">
          <label htmlFor="telephone" className="text-blue-900 sm:text-lg">
            Phone number
          </label>

          <input
            id="telephone"
            className="rounded-md border-2 border-blue-500 focus:ring-0 focus:outline-2 focus:outline-blue-500 aria-invalid:border-red-500 sm:text-lg"
            type="tel"
            name="telephone"
            placeholder="e.g. +1 234 567 890"
            autoComplete="tel"
            aria-invalid={ariaInvalid.telephone}
            aria-describedby="telephone-error"
            required
            onInput={function () {
              setAriaDisabled(!isInfoValid());

              let [isValid, reason] = validateTelephone(event.target.value);

              setErrorMessage((em) => ({
                ...em,
                telephone: isValid ? '' : reason,
              }));

              setAriaInvalid((ai) => ({
                ...ai,
                telephone: !isValid,
              }));
            }}
          />

          <span
            id="telephone-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          >
            {errorMessage.telephone}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          aria-disabled={ariaDisabled}
          onClick={() =>
            dispatch({
              type: 'YOUR_INFO.NEXT',
              isInfoValid: !ariaDisabled,
            })
          }
        >
          Next step
        </button>
      </div>
    </fieldset>
  );
}

function isInfoValid() {
  let signupFormEl = document.getElementById('signup-form');
  let formData = new FormData(signupFormEl);

  let name = formData.get('name');
  let email = formData.get('email');
  let telephone = formData.get('telephone');

  let [isNameValid] = validateName(name);
  let [isEmailValid] = validateEmail(email);
  let [isTelephoneValid] = validateTelephone(telephone);

  return isNameValid && isEmailValid && isTelephoneValid;
}

function validateName(name) {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return [false, 'Name cannot be empty'];
  }

  if (trimmed.length < 3) {
    return [false, 'Name must be at least 3 characters long'];
  }

  if (trimmed.length > 20) {
    return [false, 'Name must be at most 20 characters long'];
  }

  // Only allow letters and spaces
  const validPattern = /^[A-Za-z\s]+$/;
  if (!validPattern.test(trimmed)) {
    return [false, 'Name can only contain letters and spaces'];
  }

  return [true, null];
}

function validateEmail(email) {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return [false, 'Email is required'];
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    return [false, 'Invalid email format'];
  }

  return [true, null];
}

function validateTelephone(telephone) {
  if (typeof telephone !== 'string') {
    return [false, 'Telephone must be a string'];
  }

  const trimmed = telephone.trim();

  if (trimmed.length === 0) {
    return [false, 'Telephone is required'];
  }

  // Allow digits, spaces, dashes, parentheses, and leading +
  const validCharsRegex = /^[\d+\-\s()]+$/;
  if (!validCharsRegex.test(trimmed)) {
    return [false, 'Telephone contains invalid characters'];
  }

  // Remove all non-digit characters for length validation
  const digitsOnly = trimmed.replace(/\D/g, '');

  // Basic sanity check: most phone numbers are between 7 and 15 digits
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return [false, 'Telephone must have between 7 and 15 digits'];
  }

  // Ensure + appears only at the start if present
  if (trimmed.includes('+') && !trimmed.startsWith('+')) {
    return [false, "Invalid '+' placement"];
  }

  return [true, null];
}
