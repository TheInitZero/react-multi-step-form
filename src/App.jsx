import { useEffect, useState } from 'react';
import { useSignupProgressActor } from './useSignupProgressActor';
import { DATA } from './data';

export default function App() {
  let [model, dispatch] = useSignupProgressActor();

  let [billingFrequency, setBillingFrequency] = useState('monthly');
  let [subscriptionLevel, setSubscriptionLevel] = useState('arcade');
  let [addOnIds, setAddOnIds] = useState([]);

  useEffect(
    function () {
      const TITLES = {
        'your-info': 'Step 1 of 4: Your info | Signup',
        'select-plan': 'Step 2 of 4: Select plan | Signup',
        'add-ons': 'Step 3 of 4: Add-ons | Signup',
        summary: 'Step 4 of 4: Summary | Signup',
      };

      let titleEl = document.querySelector('title');
      titleEl.innerText = TITLES[model.currentStep];
    },
    [model.currentStep],
  );

  return (
    <div className="container p-6 mx-auto space-y-6">
      <header>
        <h1 className="font-bold text-center text-3xl text-blue-900 sm:text-5xl">
          Signup
        </h1>
      </header>

      <SignupProgress model={model} />

      <main>
        <form
          id="signup-form"
          className="p-6 rounded-2xl bg-blue-100 shadow"
          onSubmit={() => dispatch({ type: 'SUMMARY.CONFIRM' })}
        >
          <SignupFormStepYourInfo model={model} dispatch={dispatch} />

          <SignupFormStepSelectPlan
            billingFrequency={billingFrequency}
            setBillingFrequency={setBillingFrequency}
            subscriptionLevel={subscriptionLevel}
            setSubscriptionLevel={setSubscriptionLevel}
            model={model}
            dispatch={dispatch}
          />

          <SignupFormStepAddOns
            addOnIds={addOnIds}
            setAddOnIds={setAddOnIds}
            billingFrequency={billingFrequency}
            model={model}
            dispatch={dispatch}
          />

          <SignupFormStepSummary
            billingFrequency={billingFrequency}
            subscriptionLevel={subscriptionLevel}
            addOnIds={addOnIds}
            model={model}
            dispatch={dispatch}
          />
        </form>
      </main>
    </div>
  );
}

function SignupProgress({ model }) {
  const TITLES = {
    'your-info': 'Your info',
    'select-plan': 'Select plan',
    'add-ons': 'Add-ons',
    summary: 'Summary',
  };

  const STATUS_DESCRIPTIONS = {
    completed: 'Completed',
    started: 'Started',
    'not-started': 'Not started',
  };

  let steps = Object.entries(TITLES).map(function (entry) {
    let [key, title] = entry;
    let isCurrent = model.currentStep == key;
    let ariaCurrent = isCurrent ? 'step' : null;
    let titleElId = `signup-progress-step-title-${key}`;
    let statusElId = `signup-progress-step-status-${key}`;
    let ariaLabelledBy = `${titleElId} ${statusElId}`;
    let status = model.statuses[key];
    let statusDescription = STATUS_DESCRIPTIONS[status];

    return (
      <li
        className="flex flex-col items-center"
        key={key}
        aria-current={ariaCurrent}
        aria-labelledby={ariaLabelledBy}
        data-status={status}
        data-component="signup-progress-step"
      >
        <p id={titleElId} className="sr-only sm:text-lg sm:not-sr-only">
          {title}
        </p>

        <p id={statusElId} className="sr-only">
          {statusDescription}
        </p>
      </li>
    );
  });

  return (
    <aside
      aria-label="Signup progress"
      className="p-6 rounded-2xl bg-blue-100 shadow"
    >
      <ol
        className="flex items-center justify-center gap-5"
        data-component="signup-progress"
      >
        {steps}
      </ol>
    </aside>
  );
}

function SignupFormStepYourInfo({ model, dispatch }) {
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

function SignupFormStepSelectPlan({
  billingFrequency,
  setBillingFrequency,
  subscriptionLevel,
  setSubscriptionLevel,
  model,
  dispatch,
}) {
  let subscriptionLevelInputFields = Object.entries(DATA.SUBSCRIPTIONS).map(
    function (entry) {
      let [key, subscriptionData] = entry;
      let priceElId = `${key}-price`;
      let bonusElId = `${key}-bonus`;
      let ariaDescribedBy = `${priceElId} ${bonusElId}`;
      let priceSuffix = billingFrequency == 'monthly' ? 'mo' : 'yr';
      let price = `$${subscriptionData.price[billingFrequency]}/${priceSuffix}`;

      return (
        <div
          key={key}
          className="px-3 py-2 border-2 border-blue-50 rounded-md relative bg-blue-50 shadow has-checked:border-blue-500 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500"
        >
          <input
            id={key}
            className="focus:ring-0"
            type="radio"
            name="subscription-level"
            value={key}
            aria-describedby={ariaDescribedBy}
            required
            checked={subscriptionLevel == key}
            onChange={() => setSubscriptionLevel(key)}
          />

          <div>
            <label
              className="text-blue-900 before:absolute before:inset-0 sm:text-lg"
              htmlFor={key}
            >
              {subscriptionData.name}
            </label>

            <p
              id={priceElId}
              className="mt-1 text-sm font-bold text-blue-900/70 sm:text-base"
            >
              {price}
            </p>

            <p
              id={bonusElId}
              className="text-sm font-bold text-blue-900/70 sm:text-base"
              hidden={billingFrequency == 'monthly'}
            >
              {subscriptionData.bonus}
            </p>
          </div>
        </div>
      );
    },
  );

  return (
    <fieldset className="space-y-4" hidden={model.currentStep != 'select-plan'}>
      <div>
        <legend className="text-xl font-bold text-blue-900 sm:text-3xl">
          Select your plan
        </legend>

        <p className="text-blue-900/70 sm:text-lg">
          You have the option of monthly or yearly billing.
        </p>
      </div>

      <div className="space-y-2">
        <fieldset className="space-y-1">
          <legend className="text-blue-900/70 font-bold sm:text-lg">
            Billing frequency
          </legend>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            <div className="px-3 py-2 border-2 border-blue-50 rounded-md relative flex items-center gap-2 bg-blue-50 shadow has-checked:border-blue-500 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500">
              <input
                id="billing-frequency-monthly"
                className="focus:ring-0"
                type="radio"
                name="billing-frequency"
                value="monthly"
                checked={billingFrequency == 'monthly'}
                required
                onChange={() => setBillingFrequency('monthly')}
              />

              <label
                className="text-blue-900 before:absolute before:inset-0 sm:text-lg"
                htmlFor="billing-frequency-monthly"
              >
                Monthly
              </label>
            </div>

            <div className="px-3 py-2 border-2 border-blue-50 rounded-md relative flex items-center gap-2 bg-blue-50 shadow has-checked:border-blue-500 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500">
              <input
                id="billing-frequency-yearly"
                className="focus:ring-0"
                type="radio"
                name="billing-frequency"
                value="yearly"
                checked={billingFrequency == 'yearly'}
                required
                onChange={() => setBillingFrequency('yearly')}
              />

              <label
                className="text-blue-900 before:absolute before:inset-0 sm:text-lg"
                htmlFor="billing-frequency-yearly"
              >
                Yearly
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-1">
          <legend className="text-blue-900/70 font-bold sm:text-lg">
            Subscription level
          </legend>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {subscriptionLevelInputFields}
          </div>
        </fieldset>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-900 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          onClick={() => dispatch({ type: 'SELECT_PLAN.BACK' })}
        >
          Go back
        </button>

        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          onClick={() => dispatch({ type: 'SELECT_PLAN.NEXT' })}
        >
          Next step
        </button>
      </div>
    </fieldset>
  );
}

function SignupFormStepAddOns({
  addOnIds,
  setAddOnIds,
  billingFrequency,
  model,
  dispatch,
}) {
  let inputFields = Object.entries(DATA.ADD_ONS).map(function (entry) {
    let [key, addOnData] = entry;
    let priceElId = `${key}-price`;
    let detailElId = `${key}-detail`;
    let ariaDescribedBy = `${priceElId} ${detailElId}`;
    let priceSuffix = billingFrequency == 'monthly' ? 'mo' : 'yr';
    let price = `$${addOnData.price[billingFrequency]}/${priceSuffix}`;

    return (
      <li
        key={key}
        className="px-3 py-2 border-2 border-blue-50 rounded-md relative bg-blue-50 shadow has-checked:border-blue-500 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500"
      >
        <input
          id={key}
          className="focus:ring-0"
          type="checkbox"
          name="add-ons"
          value={key}
          checked={addOnIds.includes(key)}
          aria-describedby={ariaDescribedBy}
          onChange={function (event) {
            setAddOnIds((prev) =>
              event.target.checked
                ? [...prev, key]
                : prev.filter((item) => item != key),
            );
          }}
        />

        <div>
          <label
            className="text-blue-900 before:absolute before:inset-0 sm:text-lg"
            htmlFor={key}
          >
            {addOnData.name}
          </label>

          <p
            id={priceElId}
            className="mt-1 text-sm font-bold text-blue-900/70 sm:text-base"
          >
            {price}
          </p>

          <p
            id={detailElId}
            className="text-sm font-bold text-blue-900/70 sm:text-base"
          >
            {addOnData.detail}
          </p>
        </div>
      </li>
    );
  });

  return (
    <fieldset className="space-y-4" hidden={model.currentStep != 'add-ons'}>
      <div>
        <legend className="text-xl font-bold text-blue-900 sm:text-3xl">
          Pick add-ons
        </legend>

        <p className="text-blue-900/70 sm:text-lg">
          Add-ons help enhance your gaming experience.
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">{inputFields}</ul>

      <div className="flex items-center justify-between">
        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-900 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          onClick={() => dispatch({ type: 'ADD_ONS.BACK' })}
        >
          Go back
        </button>

        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          onClick={() => dispatch({ type: 'ADD_ONS.NEXT' })}
        >
          Next step
        </button>
      </div>
    </fieldset>
  );
}

function SignupFormStepSummary({
  billingFrequency,
  subscriptionLevel,
  addOnIds,
  model,
  dispatch,
}) {
  let priceSuffix = billingFrequency == 'monthly' ? 'mo' : 'yr';

  let subscriptionPrice =
    DATA.SUBSCRIPTIONS[subscriptionLevel].price[billingFrequency];

  let subscriptionPriceTag = `$${subscriptionPrice}/${priceSuffix}`;

  let addOnEls = (function () {
    let addOnEls = [];

    for (let id of addOnIds) {
      let addOnData = DATA.ADD_ONS[id];
      let price = addOnData.price[billingFrequency];
      let priceTag = `+$${price}/${priceSuffix}`;

      let el = (
        <li
          key={id}
          className="text-blue-900/70 flex items-center justify-between sm:text-lg"
        >
          <span>{addOnData.name}</span>

          <span className="font-bold">{priceTag}</span>
        </li>
      );

      addOnEls.push(el);
    }

    return addOnEls;
  })();

  let totalPriceTag = (function () {
    let totalPrice = subscriptionPrice;

    for (let id of addOnIds) {
      let addOnData = DATA.ADD_ONS[id];
      let addOnPrice = addOnData.price[billingFrequency];
      totalPrice += addOnPrice;
    }

    return `$${totalPrice}/${priceSuffix}`;
  })();

  return (
    <section className="space-y-4" hidden={model.currentStep != 'summary'}>
      <div>
        <h2 className="text-xl font-bold text-blue-900 sm:text-3xl">
          Finishing up
        </h2>

        <p className="text-blue-900/70 sm:text-lg">
          Double-check everything looks OK before confirming.
        </p>
      </div>

      <div className="p-3 rounded-md space-y-2 bg-blue-50 shadow">
        <section aria-label="Subscription">
          <p className="text-blue-900 flex items-center justify-between sm:text-lg">
            <span>
              {capitalize(subscriptionLevel)} ({capitalize(billingFrequency)})
            </span>

            <span className="font-bold">{subscriptionPriceTag}</span>
          </p>

          <button
            className="text-sm text-blue-900 underline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 sm:text-base"
            type="button"
            onClick={() => dispatch({ type: 'SUMMARY.CHANGE_SUBSCRIPTION' })}
          >
            Change subscription
          </button>
        </section>

        <ul aria-label="Add-ons" hidden={addOnIds.length == 0}>
          {addOnEls}
        </ul>

        <hr className="block h-0.5 bg-blue-900 opacity-25" />

        <p className="text-blue-900 flex items-center justify-between sm:text-lg">
          <span>Total ({capitalize(billingFrequency)})</span>

          <span className="font-bold">{totalPriceTag}</span>
        </p>
      </div>

      <div className="flex items-center justify-between">
        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-900 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          onClick={() => dispatch({ type: 'SUMMARY.BACK' })}
        >
          Go back
        </button>

        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="submit"
        >
          Confirm
        </button>
      </div>
    </section>
  );
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
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
