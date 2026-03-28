import SignupProgress from './features/signup-progress/signup-progress';
import ProgressStep, { type ProgressStepProps } from './features/signup-progress/progress-step';
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
import type { AddOnsOptionProps } from './features/signup-form/add-ons/add-ons-option';
import AddOnsOption from './features/signup-form/add-ons/add-ons-option';

export default function App() {
  const progressStepConfigs: ProgressStepProps[] = [
    { title: 'Your info', status: { kind: 'Completed', description: 'Completed' } },
    { title: 'Select plan', status: { kind: 'Started', description: 'Started' } },
    { title: 'Add-ons', status: { kind: 'NotStarted', description: 'Not started' } },
    { title: 'Summary', status: { kind: 'NotStarted', description: 'Not started' } },
  ];

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

  const addOnsOptionConfigs: AddOnsOptionProps[] = [
    {
      value: 'online-service',
      checked: false,
      onChange: () => {},
      labelText: 'Online service',
      description: 'Access to multiplayer games',
      price: { billingPeriod: 'Monthly', amount: 1 },
    },

    {
      value: 'larger-storage',
      checked: false,
      onChange: () => {},
      labelText: 'Larger storage',
      description: 'Extra 1TB of cloud save',
      price: { billingPeriod: 'Monthly', amount: 2 },
    },

    {
      value: 'customizable-profile',
      checked: false,
      onChange: () => {},
      labelText: 'Customizable Profile',
      description: 'Custom theme on your profile',
      price: { billingPeriod: 'Monthly', amount: 2 },
    },
  ];

  return (
    <div className="grid min-h-dvh place-content-center gap-4 p-2">
      <header>
        <h1 className="text-center text-2xl font-medium">Signup</h1>
      </header>

      <SignupProgress>
        {progressStepConfigs.map(function (config) {
          return <ProgressStep key={config.title} {...config} />;
        })}
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

          <AddOns
            options={
              <>
                {addOnsOptionConfigs.map(function (config) {
                  const key = `add-ons-${config.value}`;
                  return <AddOnsOption key={key} {...config} />;
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

          <Summary
            subscription={{ name: 'Arcade', billingPeriod: 'Yearly', price: 90 }}
            addOns={[
              { name: 'Online service', price: 10 },
              { name: 'Larger storage', price: 20 },
            ]}
            onSubscriptionChange={() => {}}
            footer={
              <div className="flex items-center justify-between">
                <button type="button" className="btn-ghost">
                  Go Back
                </button>
                <button type="submit" className="btn-primary">
                  Confirm
                </button>
              </div>
            }
          />
        </SignupForm>

        <ConfirmationMessage />
      </main>
    </div>
  );
}
