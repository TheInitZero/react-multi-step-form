import { useState } from 'react';
import { usePageTitle, useSignupProgressActor } from './hooks';
import { SignupProgress } from './components/signup-progress';
import { SignupFormStep } from './components/signup-form-step';

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
          <SignupFormStep.YourInfo model={model} dispatch={dispatch} />

          <SignupFormStep.SelectPlan
            billingFrequency={billingFrequency}
            setBillingFrequency={setBillingFrequency}
            subscriptionLevel={subscriptionLevel}
            setSubscriptionLevel={setSubscriptionLevel}
            model={model}
            dispatch={dispatch}
          />

          <SignupFormStep.AddOns
            addOnIds={addOnIds}
            setAddOnIds={setAddOnIds}
            billingFrequency={billingFrequency}
            model={model}
            dispatch={dispatch}
          />

          <SignupFormStep.Summary
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
