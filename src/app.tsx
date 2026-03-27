import SignupProgress from './features/signup-progress/signup-progress';
import ProgressStep from './features/signup-progress/progress-step';
import SignupForm from './features/signup-form/signup-form';
import YourInfo from './features/signup-form/your-info/your-info';
import SelectPlan from './features/signup-form/select-plan/select-plan';
import AddOns from './features/signup-form/add-ons/add-ons';
import Summary from './features/signup-form/summary/summary';
import ConfirmationMessage from './features/confirmation/confirmation-message';
import InfoInput, { type InfoInputProps } from './features/signup-form/your-info/info-input';
import { none } from './utils';
import type { BillingOptionProps } from './features/signup-form/select-plan/billing-option';
import BillingOption from './features/signup-form/select-plan/billing-option';
import type { SubscriptionOptionProps } from './features/signup-form/select-plan/subscription-option';
import SubscriptionOption from './features/signup-form/select-plan/subscription-option';

export default function App() {
  const infoInputConfigs: InfoInputProps[] = [
    {
      labelText: 'Name',
      name: 'name',
      placeholder: 'Stephen King',
      inputType: { kind: 'text', autoComplete: 'name' },
      required: true,
      value: '',
      onInput: () => {},
      validationStatus: none(),
    },

    {
      labelText: 'Email Address',
      name: 'email',
      placeholder: 'stephenking@lorem.com',
      inputType: { kind: 'email', autoComplete: 'email' },
      required: true,
      value: '',
      onInput: () => {},
      validationStatus: none(),
    },

    {
      labelText: 'Phone Number',
      name: 'phone',
      placeholder: '+1 234 567 890',
      inputType: { kind: 'tel', autoComplete: 'tel' },
      required: true,
      value: '',
      onInput: () => {},
      validationStatus: none(),
    },
  ];

  const billingOptionConfigs: BillingOptionProps[] = [
    {
      value: 'monthly',
      labelText: 'Monthly',
      required: true,
      checked: true,
      onChange: () => {},
    },

    {
      value: 'yearly',
      labelText: 'Yearly',
      required: true,
      checked: false,
      onChange: () => {},
    },
  ];

  const subscriptionOptionConfigs: SubscriptionOptionProps[] = [
    {
      value: 'arcade',
      required: true,
      labelText: 'Arcade',
      description: {
        billingPeriod: 'Yearly',
        price: 90,
        bonuses: ['2 months free'],
      },
      onChange: () => {},
      checked: true,
    },

    {
      value: 'advanced',
      required: true,
      labelText: 'Advanced',
      description: {
        billingPeriod: 'Yearly',
        price: 120,
        bonuses: ['3 months free'],
      },
      onChange: () => {},
      checked: false,
    },

    {
      value: 'pro',
      required: true,
      labelText: 'Pro',
      description: {
        billingPeriod: 'Yearly',
        price: 150,
        bonuses: ['4 months free'],
      },
      onChange: () => {},
      checked: false,
    },
  ];

  return (
    <div className="grid min-h-dvh place-content-center gap-4 p-2">
      <header>
        <h1 className="text-center text-2xl font-medium">Signup</h1>
      </header>

      <SignupProgress>
        <ProgressStep status={{ kind: 'Completed', description: 'Completed' }} title="Your info" />
        <ProgressStep
          status={{ kind: 'Current', description: 'Current step' }}
          title="Select plan"
        />
        <ProgressStep status={{ kind: 'NotStarted', description: 'Not started' }} title="Add-ons" />
        <ProgressStep status={{ kind: 'NotStarted', description: 'Not started' }} title="Summary" />
      </SignupProgress>

      <main>
        <SignupForm>
          <YourInfo
            inputs={
              <>
                {infoInputConfigs.map(function (config) {
                  const key = `input-${config.name}`;
                  return <InfoInput key={key} {...config} />;
                })}
              </>
            }
            footer={
              <div className="flex items-center justify-end">
                <button type="button" className="btn-primary">
                  Next Step
                </button>
              </div>
            }
          />

          <SelectPlan
            billingOptions={
              <>
                {billingOptionConfigs.map(function (config) {
                  const key = `billing-${config.value}`;
                  return <BillingOption key={key} {...config} />;
                })}
              </>
            }
            subscriptionOptions={
              <>
                {subscriptionOptionConfigs.map(function (config) {
                  const key = `subscription-${config.value}`;
                  return <SubscriptionOption key={key} {...config} />;
                })}
              </>
            }
            footer={
              <div className="flex items-center justify-between">
                <button type="button" className="btn-ghost">
                  Go Back
                </button>
                <button type="button" className="btn-primary">
                  Next Step
                </button>
              </div>
            }
          />

          <AddOns />

          <Summary
            subscription={{ name: 'Arcade', billingPeriod: 'Yearly', price: 90 }}
            addOns={[
              { name: 'Online service', price: 10 },
              { name: 'Larger storage', price: 20 },
            ]}
            onSubscriptionChange={() => {}}
          />
        </SignupForm>

        <ConfirmationMessage />
      </main>
    </div>
  );
}
