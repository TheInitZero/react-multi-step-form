import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { none, some } from '../../../utils';
import InfoInput from './info-input';

type InfoInputProps = ComponentProps<typeof InfoInput>;

const defaultProps = {
  labelText: 'Full name',
  name: 'fullName',
  placeholder: 'Jane Doe',
  inputType: { kind: 'text' as const, autoComplete: 'name' as const },
  value: '',
  onInput: vi.fn(),
  validationStatus: none(),
} satisfies Omit<InfoInputProps, never>;

function renderInfoInput(overrides: Partial<InfoInputProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<InfoInput {...props} />);
}

describe('InfoInput', () => {
  it('shows an asterisk in the label when required and omits it when not required', () => {
    const { rerender } = renderInfoInput({ required: true });
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /full name/i })).toHaveAccessibleName('Full name*');

    rerender(<InfoInput {...defaultProps} required={false} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /full name/i })).toHaveAccessibleName('Full name');

    rerender(<InfoInput {...defaultProps} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /full name/i })).toHaveAccessibleName('Full name');
  });

  it('sets aria-invalid to true when validation fails and false when valid', () => {
    const { rerender } = renderInfoInput({
      validationStatus: some('Invalid'),
    });
    const inputInvalid = screen.getByRole('textbox', { name: /full name/i });
    expect(inputInvalid).toHaveAttribute('aria-invalid', 'true');
    expect(inputInvalid).toHaveAccessibleDescription('Invalid');

    rerender(<InfoInput {...defaultProps} validationStatus={none()} value="" />);
    const inputValid = screen.getByRole('textbox', { name: /full name/i });
    expect(inputValid).toHaveAttribute('aria-invalid', 'false');
    expect(inputValid).not.toHaveAccessibleDescription();
  });

  it('shows an error message when invalid and hides it when valid', () => {
    const { rerender } = renderInfoInput({
      validationStatus: some('This field is wrong'),
    });
    const inputInvalid = screen.getByRole('textbox', { name: /full name/i });
    expect(inputInvalid).toHaveAccessibleDescription('This field is wrong');

    rerender(<InfoInput {...defaultProps} validationStatus={none()} value="" />);
    const inputValid = screen.getByRole('textbox', { name: /full name/i });
    expect(inputValid).not.toHaveAccessibleDescription('This field is wrong');
  });

  it('associates the label with the input for accessibility', () => {
    renderInfoInput();
    const input = screen.getByRole('textbox', { name: /full name/i });
    expect(input).toHaveAccessibleName('Full name');
    expect(input).toHaveAttribute('name', 'fullName');
    expect(input).toHaveAttribute('placeholder', 'Jane Doe');
  });

  it('reflects name, placeholder, required, type, and autoComplete from props', () => {
    renderInfoInput({
      name: 'email',
      placeholder: 'you@example.com',
      required: true,
      inputType: { kind: 'email', autoComplete: 'email' },
    });
    const input = screen.getByRole('textbox', { name: /full name/i });
    expect(input).toHaveAccessibleName('Full name*');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('autoComplete', 'email');
    expect(input).toBeRequired();
  });

  const inputTypeCases: Array<{
    inputType: InfoInputProps['inputType'];
    expectedType: string;
    expectedAutoComplete: string;
  }> = [
    {
      inputType: { kind: 'text', autoComplete: 'name' },
      expectedType: 'text',
      expectedAutoComplete: 'name',
    },
    {
      inputType: { kind: 'email', autoComplete: 'email' },
      expectedType: 'email',
      expectedAutoComplete: 'email',
    },
    {
      inputType: { kind: 'tel', autoComplete: 'tel' },
      expectedType: 'tel',
      expectedAutoComplete: 'tel',
    },
  ];

  it.each(inputTypeCases)(
    'uses type $expectedType and autoComplete $expectedAutoComplete for input kind $inputType.kind',
    ({ inputType, expectedType, expectedAutoComplete }) => {
      renderInfoInput({ inputType });
      const input = screen.getByRole('textbox', { name: /full name/i });
      expect(input).toHaveAttribute('type', expectedType);
      expect(input).toHaveAttribute('autoComplete', expectedAutoComplete);
    },
  );

  it('displays the controlled value from props', () => {
    renderInfoInput({ value: 'Ada Lovelace' });
    expect(screen.getByRole('textbox', { name: /full name/i })).toHaveValue('Ada Lovelace');
  });

  it('calls onInput so a parent can keep the field controlled while typing', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState('');
      return (
        <InfoInput {...defaultProps} value={value} onInput={setValue} validationStatus={none()} />
      );
    }
    render(<Harness />);
    const input = screen.getByRole('textbox', { name: /full name/i });
    await user.type(input, 'ab');
    expect(input).toHaveValue('ab');
  });

  it('links the input to the error region via aria-describedby and exposes a live region', () => {
    renderInfoInput();
    const input = screen.getByRole('textbox', { name: /full name/i });
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorRegion = document.getElementById(describedBy!);
    expect(errorRegion).not.toBeNull();
    expect(errorRegion).toHaveAttribute('aria-live', 'assertive');
    expect(input).not.toHaveAccessibleDescription();
  });

  it('updates invalid state and messaging when value and validation change', () => {
    const { rerender } = render(
      <InfoInput
        {...defaultProps}
        labelText="Email"
        value="bad"
        validationStatus={some('Email must contain @')}
        inputType={{ kind: 'email', autoComplete: 'email' }}
      />,
    );

    let input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Email must contain @');

    rerender(
      <InfoInput
        {...defaultProps}
        labelText="Email"
        value="good@example.com"
        validationStatus={none()}
        inputType={{ kind: 'email', autoComplete: 'email' }}
      />,
    );

    input = screen.getByRole('textbox', { name: /email/i });
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAccessibleDescription('Email must contain @');
  });
});
