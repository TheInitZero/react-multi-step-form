import SignupProgress from './features/signup-progress/signup-progress';
import ProgressStep, { type ProgressStepProps } from './features/signup-progress/progress-step';
import SignupForm from './features/signup-form/signup-form';
import YourInfo from './features/signup-form/your-info/your-info';
import SelectPlan from './features/signup-form/select-plan/select-plan';
import AddOns from './features/signup-form/add-ons/add-ons';
import Summary, { type SummaryProps } from './features/signup-form/summary/summary';
import ConfirmationMessage from './features/confirmation/confirmation-message';
import InfoInput, { type InfoInputProps } from './features/signup-form/your-info/info-input';
import { none } from './utils';
import type { BillingOptionProps } from './features/signup-form/select-plan/billing-option';
import BillingOption from './features/signup-form/select-plan/billing-option';
import type { SubscriptionOptionProps } from './features/signup-form/select-plan/subscription-option';
import SubscriptionOption from './features/signup-form/select-plan/subscription-option';
import type { AddOnsOptionProps } from './features/signup-form/add-ons/add-ons-option';
import AddOnsOption from './features/signup-form/add-ons/add-ons-option';
import { formSteps, formStepStatusDescriptions } from './features/state/form-progress-state';
import { useFormProgressMachine } from './features/hooks/use-form-progress-machine';
import { useInputStateMachine } from './features/hooks/use-input-state-machine';
import { addOns, subscriptions } from './features/state/input-state';

export default function App() {
  const formProgressActor = useFormProgressMachine();
  const inputActor = useInputStateMachine();

  const progressStepConfigs: ProgressStepProps[] = (function () {
    const { statusRecord } = formProgressActor.snapshot.context;
    const statusEntries = Object.entries(statusRecord);

    return statusEntries.map(function (entry) {
      const [stepId, stepStatus] = entry;
      const title = formSteps[stepId].title;
      const description = formStepStatusDescriptions[stepStatus];
      const status = { kind: stepStatus, description };

      return { title, status };
    });
  })();

  const infoInputConfigs: InfoInputProps[] = (function () {
    const { name, email, telephone } = inputActor.snapshot.context;

    const nameInputConfig: InfoInputProps = (function () {
      const inputType: InfoInputProps['inputType'] = { kind: 'text', autoComplete: 'name' };
      const validationStatus = none();

      const onInput: InfoInputProps['onInput'] = function (value) {
        inputActor.send({ type: 'SET_NAME', name: value });
      };

      return {
        value: name,
        labelText: 'Name',
        name: 'name',
        placeholder: 'Stephen King',
        required: true,
        inputType,
        validationStatus,
        onInput,
      };
    })();

    const emailInputConfig: InfoInputProps = (function () {
      const inputType: InfoInputProps['inputType'] = { kind: 'email', autoComplete: 'email' };
      const validationStatus = none();

      const onInput: InfoInputProps['onInput'] = function (value) {
        inputActor.send({ type: 'SET_EMAIL', email: value });
      };

      return {
        value: email,
        labelText: 'Email Address',
        name: 'email',
        placeholder: 'stephenking@lorem.com',
        required: true,
        inputType,
        validationStatus,
        onInput,
      };
    })();

    const telephoneInputConfig: InfoInputProps = (function () {
      const inputType: InfoInputProps['inputType'] = { kind: 'tel', autoComplete: 'tel' };
      const validationStatus = none();

      const onInput: InfoInputProps['onInput'] = function (value) {
        inputActor.send({ type: 'SET_TELEPHONE', telephone: value });
      };

      return {
        value: telephone,
        labelText: 'Phone Number',
        name: 'phone',
        placeholder: '+1 234 567 890',
        required: true,
        inputType,
        validationStatus,
        onInput,
      };
    })();

    return [nameInputConfig, emailInputConfig, telephoneInputConfig];
  })();

  const billingOptionConfigs: BillingOptionProps[] = (function () {
    const { billingPeriod } = inputActor.snapshot.context;

    const monthlyOptionConfig = (function () {
      const checked = billingPeriod === 'Monthly';

      function onChange() {
        inputActor.send({ type: 'SET_BILLING_PERIOD', billingPeriod: 'Monthly' });
      }

      return {
        value: 'monthly',
        labelText: 'Monthly',
        required: true,
        checked,
        onChange,
      };
    })();

    const yearlyOptionConfig = (function () {
      const checked = billingPeriod === 'Yearly';

      function onChange() {
        inputActor.send({ type: 'SET_BILLING_PERIOD', billingPeriod: 'Yearly' });
      }

      return {
        value: 'yearly',
        labelText: 'Yearly',
        required: true,
        checked,
        onChange,
      };
    })();

    return [monthlyOptionConfig, yearlyOptionConfig];
  })();

  const subscriptionOptionConfigs: SubscriptionOptionProps[] = Object.values(subscriptions).map(
    function (subscription) {
      const { billingPeriod, subscriptionId } = inputActor.snapshot.context;

      const description: SubscriptionOptionProps['description'] = (function () {
        const { price: rate, bonuses } = subscription;
        const price = rate[billingPeriod];

        return billingPeriod === 'Monthly'
          ? { billingPeriod, price }
          : { billingPeriod, price, bonuses };
      })();

      const config = (function () {
        const { id, name } = subscription;
        const checked = subscriptionId === id;

        function onChange() {
          inputActor.send({ type: 'SET_SUBSCRIPTION_ID', subscriptionId: id });
        }

        return {
          value: id,
          labelText: name,
          required: true,
          description,
          checked,
          onChange,
        };
      })();

      return config;
    },
  );

  const addOnsOptionConfigs: AddOnsOptionProps[] = Object.values(addOns).map(function (addOn) {
    const { billingPeriod, addOnIds } = inputActor.snapshot.context;
    const { id, name, description, price: rate } = addOn;
    const checked = addOnIds.has(id);
    const amount = rate[billingPeriod];
    const price = { billingPeriod, amount };

    function onChange() {
      inputActor.send({ type: 'TOGGLE_ADD_ON', addOnId: id });
    }

    return {
      value: id,
      labelText: name,
      checked,
      description,
      price,
      onChange,
    };
  });

  const summaryProps: Omit<SummaryProps, 'footer'> = (function () {
    const { billingPeriod, subscriptionId, addOnIds } = inputActor.snapshot.context;

    const subscription = (function () {
      const selectedSubscription = subscriptions[subscriptionId];
      const { name, price: rate } = selectedSubscription;
      const price = rate[billingPeriod];
      return { name, billingPeriod, price };
    })();

    const addOnsProp = [...addOnIds].map(function (addOnId) {
      const addOn = addOns[addOnId];
      const { name, price: rate } = addOn;
      const price = rate[billingPeriod];
      return { name, price };
    });

    function onSubscriptionChange() {
      formProgressActor.send({ type: 'SUMMARY.CHANGE_SUBSCRIPTION' });
    }

    return { addOns: addOnsProp, subscription, onSubscriptionChange };
  })();

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
        {formProgressActor.snapshot.hasTag('confirmation') ? (
          <ConfirmationMessage />
        ) : (
          <SignupForm>
            {formProgressActor.snapshot.hasTag('yourInfo') && (
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
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() =>
                        formProgressActor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true })
                      }
                    >
                      Next Step
                    </button>
                  </div>
                }
              />
            )}

            {formProgressActor.snapshot.hasTag('selectPlan') && (
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
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => formProgressActor.send({ type: 'SELECT_PLAN.BACK' })}
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => formProgressActor.send({ type: 'SELECT_PLAN.NEXT' })}
                    >
                      Next Step
                    </button>
                  </div>
                }
              />
            )}

            {formProgressActor.snapshot.hasTag('addOns') && (
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
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => formProgressActor.send({ type: 'ADD_ONS.BACK' })}
                    >
                      Go Back
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => formProgressActor.send({ type: 'ADD_ONS.NEXT' })}
                    >
                      Next Step
                    </button>
                  </div>
                }
              />
            )}

            {formProgressActor.snapshot.hasTag('summary') && (
              <Summary
                {...summaryProps}
                footer={
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => formProgressActor.send({ type: 'SUMMARY.BACK' })}
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      onClick={() => formProgressActor.send({ type: 'SUMMARY.NEXT' })}
                    >
                      Confirm
                    </button>
                  </div>
                }
              />
            )}
          </SignupForm>
        )}
      </main>
    </div>
  );
}
