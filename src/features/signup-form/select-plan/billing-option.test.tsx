import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import BillingOption from './billing-option';

type HarnessProps = {
  children: ReactNode;
};

function Harness({ children }: HarnessProps) {
  return children;
}

describe('BillingOption', () => {
  it('associates the label with the radio input for accessibility', () => {
    render(
      <BillingOption value="monthly" checked={false} onChange={vi.fn()} labelText="Monthly" />,
    );

    const radio = screen.getByRole('radio', { name: /monthly/i });
    expect(radio).toHaveAccessibleName('Monthly');
  });

  it('clicking the label checks the radio input (and calls onChange with value)', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn<(value: string) => void>();

    function SelectorHarness() {
      const [selected, setSelected] = useState('yearly');

      return (
        <BillingOption
          value="monthly"
          checked={selected === 'monthly'}
          onChange={(value) => {
            onChangeSpy(value);
            setSelected(value);
          }}
          labelText="Monthly"
        />
      );
    }

    render(
      <Harness>
        <SelectorHarness />
      </Harness>,
    );

    const label = screen.getByText('Monthly');
    await user.click(label);

    const radio = screen.getByRole('radio', { name: /monthly/i });
    expect(radio).toBeChecked();
    expect(onChangeSpy).toHaveBeenCalledWith('monthly');
  });

  it('behaves like a native radio group across multiple BillingOption instances', async () => {
    const user = userEvent.setup();

    function SelectorHarness() {
      const [selected, setSelected] = useState<'monthly' | 'yearly'>('monthly');

      return (
        <>
          <BillingOption
            value="monthly"
            checked={selected === 'monthly'}
            onChange={(value) => setSelected(value as 'monthly' | 'yearly')}
            labelText="Monthly"
          />
          <BillingOption
            value="yearly"
            checked={selected === 'yearly'}
            onChange={(value) => setSelected(value as 'monthly' | 'yearly')}
            labelText="Yearly"
          />
        </>
      );
    }

    render(
      <Harness>
        <SelectorHarness />
      </Harness>,
    );

    const monthlyRadio = screen.getByRole('radio', { name: /monthly/i });
    const yearlyRadio = screen.getByRole('radio', { name: /yearly/i });

    expect(monthlyRadio).toBeChecked();
    expect(yearlyRadio).not.toBeChecked();

    await user.click(yearlyRadio);
    expect(yearlyRadio).toBeChecked();
    expect(monthlyRadio).not.toBeChecked();

    await user.click(monthlyRadio);
    expect(monthlyRadio).toBeChecked();
    expect(yearlyRadio).not.toBeChecked();
  });

  it('reflects checked state, value, name, and required props on the input', () => {
    render(
      <BillingOption
        value="monthly"
        required
        checked={false}
        onChange={vi.fn()}
        labelText="Monthly"
      />,
    );

    const radio = screen.getByRole('radio', { name: /monthly/i });
    expect(radio).not.toBeChecked();
    expect(radio).toHaveAttribute('name', 'billing-frequency');
    expect(radio).toHaveAttribute('value', 'monthly');
    expect(radio).toBeRequired();
  });
});
