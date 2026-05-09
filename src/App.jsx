import { useState } from 'react';
import { usePageTitle, useSignupProgressActor } from './hooks';
import { DATA } from './data';
import { SignupProgress } from './components/signup-progress';
import { SignupFormStepYourInfo } from './components/signup-form-step/your-info';
import { SignupFormStepSelectPlan } from './components/signup-form-step/select-plan';
import { SignupFormStepAddOns } from './components/signup-form-step/add-ons';

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
