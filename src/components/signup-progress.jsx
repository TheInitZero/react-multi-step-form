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

export function SignupProgress({ model }) {
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
        className="flex flex-col items-center"
        key={key}
        aria-current={ariaCurrent}
        aria-labelledby={ariaLabelledBy}
        data-status={status}
        data-component="signup-progress-step"
      >
        <p id={titleElId} className="sr-only sm:text-lg sm:not-sr-only">
          {title}
        </p>

        <p id={statusElId} className="sr-only">
          {statusDescription}
        </p>
      </li>
    );
  });

  return (
    <aside
      aria-label="Signup progress"
      className="p-6 rounded-2xl bg-blue-100 shadow"
    >
      <ol
        className="flex items-center justify-center gap-5"
        data-component="signup-progress"
      >
        {steps}
      </ol>
    </aside>
  );
}
