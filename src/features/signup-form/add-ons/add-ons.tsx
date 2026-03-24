import AddOnsOption from './add-ons-option';

export default function AddOns() {
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Pick add-ons</legend>
        <p className="text-black/45">Add-ons help enhance your gaming experience.</p>
      </div>

      <ul className="grid gap-2">
        <AddOnsOption
          value="online-service"
          checked={false}
          onChange={() => {}}
          labelText="Online service"
          description="Access to multiplayer games"
          price={{ billingPeriod: 'Monthly', amount: 1 }}
        />

        <AddOnsOption
          value="larger-storage"
          checked={false}
          onChange={() => {}}
          labelText="Larger storage"
          description="Extra 1TB of cloud save"
          price={{ billingPeriod: 'Monthly', amount: 2 }}
        />

        <AddOnsOption
          value="customizable-profile"
          checked={false}
          onChange={() => {}}
          labelText="Customizable Profile"
          description="Custom theme on your profile"
          price={{ billingPeriod: 'Monthly', amount: 2 }}
        />
      </ul>

      <div className="flex items-center justify-between">
        <button type="button" className="btn-ghost">
          Go Back
        </button>
        <button type="button" className="btn-primary">
          Next Step
        </button>
      </div>
    </fieldset>
  );
}
