import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import AddOnsOption, { type AddOnsOptionProps } from './add-ons-option';

const defaultProps = {
  value: 'online-service',
  checked: false,
  onChange: vi.fn<(value: string) => void>(),
  labelText: 'Online service',
  description: 'Access to multiplayer games',
  price: { billingPeriod: 'Monthly', amount: 1 },
} satisfies AddOnsOptionProps;

function addOnsProps(overrides: Partial<AddOnsOptionProps> = {}): AddOnsOptionProps {
  return { ...defaultProps, ...overrides };
}

function renderAddOnsOption(overrides: Partial<AddOnsOptionProps> = {}) {
  return render(<AddOnsOption {...addOnsProps(overrides)} />);
}

describe('AddOnsOption', () => {
  it('associates the label with the checkbox input for accessibility', () => {
    renderAddOnsOption();

    const checkbox = screen.getByRole('checkbox', { name: /online service/i });
    expect(checkbox).toHaveAccessibleName('Online service');
  });

  it('clicking the label checks the checkbox input (and calls onChange with value)', async () => {
    const user = userEvent.setup();
    const onChangeSpy = vi.fn<(value: string) => void>();

    function SelectorHarness() {
      const [selected, setSelected] = useState<string[]>([]);

      return (
        <AddOnsOption
          value="online-service"
          checked={selected.includes('online-service')}
          onChange={(value) => {
            onChangeSpy(value);
            setSelected((current) =>
              current.includes(value)
                ? current.filter((selectedValue) => selectedValue !== value)
                : [...current, value],
            );
          }}
          labelText="Online service"
          description="Access to multiplayer games"
          price={{ billingPeriod: 'Monthly', amount: 1 }}
        />
      );
    }

    render(<SelectorHarness />);

    const label = screen.getByText('Online service');
    await user.click(label);

    const checkbox = screen.getByRole('checkbox', { name: /online service/i });
    expect(checkbox).toBeChecked();
    expect(onChangeSpy).toHaveBeenCalledWith('online-service');
  });

  it('behaves like native checkboxes across multiple AddOnsOption instances', async () => {
    const user = userEvent.setup();

    function SelectorHarness() {
      const [selected, setSelected] = useState<string[]>(['online-service']);

      const handleChange = (value: string) => {
        setSelected((current) =>
          current.includes(value)
            ? current.filter((selectedValue) => selectedValue !== value)
            : [...current, value],
        );
      };

      return (
        <>
          <AddOnsOption
            value="online-service"
            checked={selected.includes('online-service')}
            onChange={handleChange}
            labelText="Online service"
            description="Access to multiplayer games"
            price={{ billingPeriod: 'Monthly', amount: 1 }}
          />
          <AddOnsOption
            value="larger-storage"
            checked={selected.includes('larger-storage')}
            onChange={handleChange}
            labelText="Larger storage"
            description="Extra 1TB of cloud save"
            price={{ billingPeriod: 'Monthly', amount: 2 }}
          />
        </>
      );
    }

    render(<SelectorHarness />);

    const onlineServiceCheckbox = screen.getByRole('checkbox', { name: /online service/i });
    const largerStorageCheckbox = screen.getByRole('checkbox', { name: /larger storage/i });

    expect(onlineServiceCheckbox).toBeChecked();
    expect(largerStorageCheckbox).not.toBeChecked();

    await user.click(largerStorageCheckbox);
    expect(onlineServiceCheckbox).toBeChecked();
    expect(largerStorageCheckbox).toBeChecked();

    await user.click(onlineServiceCheckbox);
    expect(onlineServiceCheckbox).not.toBeChecked();
    expect(largerStorageCheckbox).toBeChecked();
  });

  it('reflects checked state, value, name, and associates description and price via aria-describedby', () => {
    renderAddOnsOption({
      value: 'custom-profile',
      checked: true,
      labelText: 'Custom profile',
      description: 'Custom theme on your profile',
      price: { billingPeriod: 'Yearly', amount: 20 },
    });

    const checkbox = screen.getByRole('checkbox', { name: /custom profile/i });
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('name', 'add-ons');
    expect(checkbox).toHaveAttribute('value', 'custom-profile');
    expect(checkbox).toHaveAccessibleDescription('Custom theme on your profile +$20/yr');
  });
});
