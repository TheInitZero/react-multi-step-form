import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ProgressStep from './progress-step';

describe('ProgressStep', () => {
  it('renders a step with its title and description', () => {
    render(
      <ProgressStep
        title="Personal details"
        status={{ kind: 'NotStarted', description: 'Step not started yet' }}
      />,
    );

    // A step should be a listitem (semantic role)
    const step = screen.getByRole('listitem', {
      name: /personal details/i,
    });

    expect(step).toBeInTheDocument();
    expect(step).toHaveAccessibleDescription('Step not started yet');
  });

  it('marks the current step using aria-current', () => {
    render(
      <ProgressStep
        title="Current step"
        status={{ kind: 'Current', description: 'Current description' }}
      />,
    );

    const currentStep = screen.getByRole('listitem', {
      name: /current step/i,
      current: 'step',
    });

    expect(currentStep).toBeInTheDocument();
  });

  it('does not mark non-current steps as current', () => {
    render(
      <ProgressStep
        title="Upcoming step"
        status={{ kind: 'NotStarted', description: 'Coming next' }}
      />,
    );

    const step = screen.getByRole('listitem', {
      name: /upcoming step/i,
    });

    expect(step).not.toHaveAttribute('aria-current');
  });

  it('updates the current step when status changes', () => {
    const { rerender } = render(
      <ProgressStep title="Step" status={{ kind: 'NotStarted', description: 'Not started' }} />,
    );

    let step = screen.getByRole('listitem', { name: /step/i });
    expect(step).not.toHaveAttribute('aria-current');

    rerender(
      <ProgressStep title="Step" status={{ kind: 'Current', description: 'Now current' }} />,
    );

    step = screen.getByRole('listitem', {
      name: /step/i,
      current: 'step',
    });

    expect(step).toBeInTheDocument();
  });

  it('always exposes the correct description to the user', () => {
    const { rerender } = render(
      <ProgressStep title="Step" status={{ kind: 'NotStarted', description: 'Not started yet' }} />,
    );

    let step = screen.getByRole('listitem', { name: /step/i });
    expect(step).toHaveAccessibleDescription('Not started yet');

    rerender(
      <ProgressStep
        title="Step"
        status={{ kind: 'Completed', description: 'Completed successfully' }}
      />,
    );

    step = screen.getByRole('listitem', { name: /step/i });
    expect(step).toHaveAccessibleDescription('Completed successfully');
  });
});
