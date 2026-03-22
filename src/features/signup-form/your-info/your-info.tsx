import { none } from '../../../utils';
import InfoInput from './info-input';

export default function YourInfo() {
  return (
    <fieldset className="space-y-4">
      <div className="space-y-2">
        <legend className="text-xl">Personal info</legend>
        <p className="text-black/45">Please provide your name, email address, and phone number.</p>
      </div>

      <div className="space-y-2">
        <InfoInput
          labelText="Name"
          name="name"
          placeholder="Stephen King"
          inputType={{ kind: 'text', autoComplete: 'name' }}
          required
          value=""
          onInput={() => {}}
          validationStatus={none()}
        />

        <InfoInput
          labelText="Email Address"
          name="email"
          placeholder="stephenking@lorem.com"
          inputType={{ kind: 'email', autoComplete: 'email' }}
          required
          value=""
          onInput={() => {}}
          validationStatus={none()}
        />

        <InfoInput
          labelText="Phone Number"
          name="phone"
          placeholder="+1 234 567 890"
          inputType={{ kind: 'tel', autoComplete: 'tel' }}
          required
          value=""
          onInput={() => {}}
          validationStatus={none()}
        />
      </div>

      <div className="flex items-center justify-end">
        <button type="button" className="btn-primary">
          Next Step
        </button>
      </div>
    </fieldset>
  );
}
