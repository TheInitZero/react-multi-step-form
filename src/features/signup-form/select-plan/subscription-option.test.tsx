import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import SubscriptionOption from './subscription-option';

type Plan = 'arcade' | 'advanced' | 'pro';

type SubscriptionOptionProps = ComponentProps<typeof SubscriptionOption>;

const defaultProps = {
  value: 'arcade',
  checked: false,
  required: false,
  onChange: vi.fn<(value: string) => void>(),
  labelText: 'Arcade',
  description: { billingPeriod: 'Monthly', price: 15 },
} satisfies SubscriptionOptionProps;

function subscriptionProps(
  overrides: Partial<SubscriptionOptionProps> = {},
): SubscriptionOptionProps {
  return { ...defaultProps, ...overrides };
}

function renderSubscriptionOption(overrides: Partial<SubscriptionOptionProps> = {}) {
  return render(<SubscriptionOption {...subscriptionProps(overrides)} />);
}

describe('SubscriptionOption', () => {
  it('associates the label with the radio input for accessibility', () => {
    renderSubscriptionOption();

    const radio = screen.getByRole('radio', { name: /arcade/i });
    expect(radio).toHaveAccessibleName('Arcade');
  });

  it('clicking the label checks the radio input (and calls onChange with value)', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn<(value: string) => void>();

    function SelectorHarness() {
      // Start with `arcade` unchecked; clicking its label should trigger `onChange`.
      const [selected, setSelected] = useState<Plan>('advanced');

      return (
        <>
          <SubscriptionOption
            value="arcade"
            checked={selected === 'arcade'}
            onChange={(value) => {
              onChangeSpy(value);
              setSelected(value as Plan);
            }}
            labelText="Arcade"
            description={{ billingPeriod: 'Monthly', price: 15 }}
          />
          <SubscriptionOption
            value="advanced"
            checked={selected === 'advanced'}
            onChange={(value) => setSelected(value as Plan)}
            labelText="Advanced"
            description={{ billingPeriod: 'Monthly', price: 25 }}
          />
          <SubscriptionOption
            value="pro"
            checked={selected === 'pro'}
            onChange={(value) => setSelected(value as Plan)}
            labelText="Pro"
            description={{ billingPeriod: 'Monthly', price: 35 }}
          />
        </>
      );
    }

    render(<SelectorHarness />);

    const label = screen.getByText('Arcade');
    await user.click(label);

    const radio = screen.getByRole('radio', { name: /arcade/i });
    expect(radio).toBeChecked();
    expect(onChangeSpy).toHaveBeenCalledWith('arcade');
  });

  it('behaves like a native radio group across multiple SubscriptionOption instances', async () => {
    const user = userEvent.setup();

    const plans: Array<{ value: Plan; label: string; price: number }> = [
      { value: 'arcade', label: 'Arcade', price: 10 },
      { value: 'advanced', label: 'Advanced', price: 20 },
      { value: 'pro', label: 'Pro', price: 30 },
    ];

    function SelectorHarness() {
      const [selected, setSelected] = useState<Plan>('arcade');

      return (
        <>
          {plans.map((plan) => (
            <SubscriptionOption
              key={plan.value}
              value={plan.value}
              checked={selected === plan.value}
              onChange={(value) => setSelected(value as Plan)}
              labelText={plan.label}
              description={{ billingPeriod: 'Monthly', price: plan.price }}
            />
          ))}
        </>
      );
    }

    render(<SelectorHarness />);

    const arcadeRadio = screen.getByRole('radio', { name: /arcade/i });
    const advancedRadio = screen.getByRole('radio', { name: /advanced/i });
    const proRadio = screen.getByRole('radio', { name: /pro/i });

    expect(arcadeRadio).toBeChecked();
    expect(advancedRadio).not.toBeChecked();
    expect(proRadio).not.toBeChecked();

    await user.click(advancedRadio);
    expect(advancedRadio).toBeChecked();
    expect(arcadeRadio).not.toBeChecked();
    expect(proRadio).not.toBeChecked();

    await user.click(proRadio);
    expect(proRadio).toBeChecked();
    expect(arcadeRadio).not.toBeChecked();
    expect(advancedRadio).not.toBeChecked();

    await user.click(arcadeRadio);
    expect(arcadeRadio).toBeChecked();
    expect(advancedRadio).not.toBeChecked();
    expect(proRadio).not.toBeChecked();
  });

  it('reflects checked state, value, name, required props, and associates the price description', () => {
    renderSubscriptionOption({
      value: 'pro',
      required: true,
      checked: false,
      labelText: 'Pro',
      onChange: vi.fn(),
      description: { billingPeriod: 'Yearly', price: 120, bonuses: ['Extra'] },
    });

    const radio = screen.getByRole('radio', { name: /pro/i });
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute('name', 'subscription-level');
    expect(radio).toHaveAttribute('value', 'pro');
    expect(radio).toBeRequired();

    expect(radio).toHaveAccessibleDescription('$120.00/yr');
  });

  it('renders yearly bonuses when billing is Yearly and hides them for Monthly billing', () => {
    const { rerender } = renderSubscriptionOption({
      value: 'pro',
      checked: false,
      labelText: 'Pro',
      onChange: vi.fn(),
      description: { billingPeriod: 'Yearly', price: 60, bonuses: ['Bonus A', 'Bonus B'] },
    });

    expect(screen.getByText('$60.00/yr')).toBeInTheDocument();
    expect(screen.getByText('Bonus A')).toBeInTheDocument();
    expect(screen.getByText('Bonus B')).toBeInTheDocument();

    rerender(
      <SubscriptionOption
        {...subscriptionProps({
          value: 'pro',
          checked: false,
          labelText: 'Pro',
          onChange: vi.fn(),
          description: { billingPeriod: 'Monthly', price: 15 },
        })}
      />,
    );

    expect(screen.getByText('$15.00/mo')).toBeInTheDocument();
    expect(screen.queryByText('Bonus A')).not.toBeInTheDocument();
    expect(screen.queryByText('Bonus B')).not.toBeInTheDocument();
  });
});
