const DATA = {
  SUBSCRIPTIONS: {
    arcade: {
      id: 'arcade',
      name: 'Arcade',
      price: {
        monthly: 9,
        yearly: 90,
      },
      bonus: '+ 2 months',
    },

    advanced: {
      id: 'advanced',
      name: 'Advanced',
      price: {
        monthly: 12,
        yearly: 120,
      },
      bonus: '+ 3 months',
    },

    pro: {
      id: 'pro',
      name: 'Pro',
      price: {
        monthly: 15,
        yearly: 150,
      },
      bonus: '+ 4 months',
    },
  },

  ADD_ONS: {
    'online-service': {
      id: 'online-service',
      name: 'Online service',
      price: {
        monthly: 1,
        yearly: 10,
      },
      detail: 'Access to multiplayer games',
    },

    'larger-storage': {
      id: 'larger-storage',
      name: 'Larger storage',
      price: {
        monthly: 2,
        yearly: 20,
      },
      detail: 'Extra 1TB of cloud save',
    },

    'customizable-profile': {
      id: 'customizable-profile',
      name: 'Customizable profile',
      price: {
        monthly: 2,
        yearly: 20,
      },
      detail: 'Custom theme on your profile',
    },
  },
};

export default function App() {
  let model = {
    currentStep: 'your-info',
    statuses: {
      'your-info': 'started',
      'select-plan': 'not-started',
      'add-ons': 'not-started',
      summary: 'not-started',
    },
  };

  let billingFrequency = 'monthly';
  let subscriptionLevel = 'arcade';
  let addOnIds = ['online-service', 'larger-storage'];

  return (
    <div className="container p-6 mx-auto space-y-6">
      <header>
        <h1 className="font-bold text-center text-3xl text-blue-900 sm:text-5xl">
          Signup
        </h1>
      </header>

      <SignupProgress model={model} />

      <main>
        <form className="p-6 rounded-2xl bg-blue-100 shadow">
          <SignupFormStepYourInfo />

          <SignupFormStepSelectPlan
            billingFrequency={billingFrequency}
            subscriptionLevel={subscriptionLevel}
          />

          <SignupFormStepAddOns billingFrequency={billingFrequency} />

          <SignupFormStepSummary
            billingFrequency={billingFrequency}
            subscriptionLevel={subscriptionLevel}
            addOnIds={addOnIds}
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

function SignupFormStepYourInfo() {
  return (
    <fieldset className="space-y-4">
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
            aria-invalid="false"
            aria-describedby="name-error"
            required
          />

          <span
            id="name-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          ></span>
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
            aria-invalid="false"
            aria-describedby="email-error"
            required
          />

          <span
            id="email-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          ></span>
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
            aria-invalid="false"
            aria-describedby="telephone-error"
            required
          />

          <span
            id="telephone-error"
            className="text-sm font-bold text-red-500 sm:text-base"
            aria-live="assertive"
          ></span>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
          aria-disabled="false"
        >
          Next step
        </button>
      </div>
    </fieldset>
  );
}

function SignupFormStepSelectPlan({ billingFrequency, subscriptionLevel }) {
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
    <fieldset className="space-y-4">
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
        >
          Go back
        </button>

        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
        >
          Next step
        </button>
      </div>
    </fieldset>
  );
}

function SignupFormStepAddOns({ billingFrequency }) {
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
          aria-describedby={ariaDescribedBy}
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
    <fieldset className="space-y-4">
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
        >
          Go back
        </button>

        <button
          className="px-3 py-2 border-2 border-blue-600 rounded-md text-blue-50 bg-blue-600 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed sm:text-lg"
          type="button"
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
        <li key={id}>
          <span>{addOnData.name}</span>

          <span>{priceTag}</span>
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
    <section>
      <div>
        <h2>Finishing up</h2>

        <p>Double-check everything looks OK before confirming.</p>
      </div>

      <div>
        <section aria-label="Subscription">
          <p>
            <span>
              {capitalize(subscriptionLevel)} ({capitalize(billingFrequency)})
            </span>

            <span>{subscriptionPriceTag}</span>
          </p>

          <button type="button">Change subscription</button>
        </section>

        <ul aria-label="Add-ons" hidden={addOnIds.length == 0}>
          {addOnEls}
        </ul>

        <hr />

        <p>
          <span>Total ({capitalize(billingFrequency)})</span>

          <span>{totalPriceTag}</span>
        </p>
      </div>

      <div>
        <button type="button">Go back</button>

        <button type="submit">Confirm</button>
      </div>
    </section>
  );
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}
