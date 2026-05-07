export default function App() {
  return (
    <div>
      <header>
        <h1>Signup</h1>
      </header>

      <SignupProgress
        model={{
          currentStep: 'your-info',
          statuses: {
            'your-info': 'started',
            'select-plan': 'not-started',
            'add-ons': 'not-started',
            summary: 'not-started',
          },
        }}
      />
    </div>
  );
}

function SignupProgress({ model }) {
  const TITLES = {
    'your-info': 'Your info',
    'select-plan': 'Select plan',
    'add-ons': 'Add-ons',
    summary: 'Summary',
  };

  const STATUS_DESCRIPTIONS = {
    completed: 'Completed',
    started: 'Started',
    'not-started': 'Not started',
  };

  let steps = Object.entries(TITLES).map(function (entry) {
    let [key, title] = entry;
    let isCurrent = model.currentStep == key;
    let ariaCurrent = isCurrent ? 'step' : null;
    let titleElId = `signup-progress-step-title-${key}`;
    let statusElId = `signup-progress-step-status-${key}`;
    let ariaLabelledBy = `${titleElId} ${statusElId}`;
    let status = model.statuses[key];
    let statusDescription = STATUS_DESCRIPTIONS[status];

    return (
      <li
        key={key}
        aria-current={ariaCurrent}
        aria-labelledby={ariaLabelledBy}
        data-status={status}
      >
        <p id={titleElId}>{title}</p>

        <p id={statusElId}>{statusDescription}</p>
      </li>
    );
  });

  return (
    <aside aria-label="Signup progress">
      <ol>{steps}</ol>
    </aside>
  );
}
