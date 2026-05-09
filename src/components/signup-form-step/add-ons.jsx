import { DATA } from '../../data';

export function AddOns({
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
