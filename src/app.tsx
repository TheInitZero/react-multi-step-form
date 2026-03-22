import SignupProgress from './features/signup-progress/signup-progress';
import ProgressStep from './features/signup-progress/progress-step';
import SignupForm from './features/signup-form/signup-form';
import YourInfo from './features/signup-form/your-info/your-info';

export default function App() {
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
          <YourInfo />
        </SignupForm>
      </main>
    </div>
  );
}
