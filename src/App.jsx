import { useState } from 'react';
import { usePageTitle, useSignupProgressActor } from './hooks';
import { SignupProgress } from './components/signup-progress';
import { SignupFormStepYourInfo } from './components/signup-form-step/your-info';
import { SignupFormStepSelectPlan } from './components/signup-form-step/select-plan';
import { SignupFormStepAddOns } from './components/signup-form-step/add-ons';
import { SignupFormStepSummary } from './components/signup-form-step/summary';

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
