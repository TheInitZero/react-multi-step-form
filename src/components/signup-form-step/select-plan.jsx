import { DATA } from '../../data';

export function SignupFormStepSelectPlan({
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
