import { useState } from 'react';
import { usePageTitle, useSignupProgressActor } from './hooks';
import { DATA } from './data';
import { SignupProgress } from './components/signup-progress';
import { SignupFormStepYourInfo } from './components/signup-form-step/your-info';

export default function App() {
  let [model, dispatch] = useSignupProgressActor();

  let [billingFrequency, setBillingFrequency] = useState('monthly');
  let [subscriptionLevel, setSubscriptionLevel] = useState('arcade');
  let [addOnIds, setAddOnIds] = useState([]);

  usePageTitle(model.currentStep);

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
