export default function App() {
  let model = {
    currentStep: 'your-info',
    statuses: {
      'your-info': 'started',
      'select-plan': 'not-started',
      'add-ons': 'not-started',
      summary: 'not-started',
    },
  };

  return (
    <div>
      <header>
        <h1>Signup</h1>
      </header>

      <SignupProgress model={model} />

      <main>
        <form>
          <SignupFormStepYourInfo />
        </form>
      </main>
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

function SignupFormStepYourInfo() {
  return (
    <fieldset>
      <div>
        <legend>Personal info</legend>

        <p>Please provide your name, email address, and phone number.</p>
      </div>

      <div>
        <div>
          <label htmlFor="name">Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="e.g. Stephen King"
            autocomplete="name"
            aria-invalid="false"
            aria-describedby="name-error"
            required
          />

          <span id="name-error" aria-live="assertive"></span>
        </div>

        <div>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="e.g. stephenKing42@hotmail.com"
            autocomplete="email"
            aria-invalid="false"
            aria-describedby="email-error"
            required
          />

          <span id="email-error" aria-live="assertive"></span>
        </div>

        <div>
          <label htmlFor="telephone">Phone number</label>

          <input
            id="telephone"
            type="tel"
            name="telephone"
            placeholder="e.g. +1 234 567 890"
            autocomplete="tel"
            aria-invalid="false"
            aria-describedby="telephone-error"
            required
          />

          <span id="telephone-error" aria-live="assertive"></span>
        </div>
      </div>

      <div>
        <button type="button" disabled>
          Next step
        </button>
      </div>
    </fieldset>
  );
}
