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
    <div>
      <header>
        <h1>Signup</h1>
      </header>

      <SignupProgress model={model} />

      <main>
        <form>
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
        key={key}
        aria-current={ariaCurrent}
        aria-labelledby={ariaLabelledBy}
        data-status={status}
      >
        <p id={titleElId}>{title}</p>

        <p id={statusElId}>{statusDescription}</p>
      </li>
    );
  });

  return (
    <aside aria-label="Signup progress">
      <ol>{steps}</ol>
    </aside>
  );
}

function SignupFormStepYourInfo() {
  return (
    <fieldset>
      <div>
        <legend>Personal info</legend>

        <p>Please provide your name, email address, and phone number.</p>
      </div>

      <div>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g. Stephen King"
            autocomplete="name"
            aria-invalid="false"
            aria-describedby="name-error"
            required
          />

          <span id="name-error" aria-live="assertive"></span>
        </div>

        <div>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. stephenKing42@hotmail.com"
            autocomplete="email"
            aria-invalid="false"
            aria-describedby="email-error"
            required
          />

          <span id="email-error" aria-live="assertive"></span>
        </div>

        <div>
          <label htmlFor="telephone">Phone number</label>

          <input
            id="telephone"
            type="tel"
            name="telephone"
            placeholder="e.g. +1 234 567 890"
            autocomplete="tel"
            aria-invalid="false"
            aria-describedby="telephone-error"
            required
          />

          <span id="telephone-error" aria-live="assertive"></span>
        </div>
      </div>

      <div>
        <button type="button" disabled>
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
        <div key={key}>
          <input
            type="radio"
            name="subscription-level"
            id={key}
            value={key}
            aria-describedby={ariaDescribedBy}
            required
            checked={subscriptionLevel == key}
          />

          <div>
            <label htmlFor={key}>{subscriptionData.name}</label>

            <p id={priceElId}>{price}</p>

            <p id={bonusElId} hidden={billingFrequency == 'monthly'}>
              {subscriptionData.bonus}
            </p>
          </div>
        </div>
      );
    },
  );

  return (
    <fieldset>
      <div>
        <legend>Select your plan</legend>

        <p>You have the option of monthly or yearly billing.</p>
      </div>

      <div>
        <fieldset>
          <legend>Billing frequency</legend>

          <div>
            <div>
              <input
                id="billing-frequency-monthly"
                type="radio"
                name="billing-frequency"
                value="monthly"
                checked={billingFrequency == 'monthly'}
                required
              />

              <label htmlFor="billing-frequency-monthly">Monthly</label>
            </div>

            <div>
              <input
                id="billing-frequency-yearly"
                type="radio"
                name="billing-frequency"
                value="yearly"
                checked={billingFrequency == 'yearly'}
                required
              />

              <label htmlFor="billing-frequency-yearly">Yearly</label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Subscription level</legend>

          <div>{subscriptionLevelInputFields}</div>
        </fieldset>
      </div>

      <div>
        <button type="button">Go back</button>

        <button type="button">Next step</button>
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
      <li key={key}>
        <input
          type="checkbox"
          name="add-ons"
          id={key}
          value={key}
          aria-describedby={ariaDescribedBy}
        />

        <div>
          <label htmlFor={key}>{addOnData.name}</label>

          <p id={priceElId}>{price}</p>

          <p id={detailElId}>{addOnData.detail}</p>
        </div>
      </li>
    );
  });

  return (
    <fieldset>
      <div>
        <legend>Pick add-ons</legend>

        <p>Add-ons help enhance your gaming experience.</p>
      </div>

      <ul>{inputFields}</ul>

      <div>
        <button type="button">Go back</button>

        <button type="button">Next step</button>
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
