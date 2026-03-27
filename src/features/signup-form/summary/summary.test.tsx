import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Summary, { type SummaryProps } from './summary';

const defaultProps: SummaryProps = {
  subscription: {
    name: 'Arcade',
    billingPeriod: 'Monthly',
    price: 10,
  },
  addOns: [
    { name: 'Online service', price: 2 },
    { name: 'Larger storage', price: 3 },
  ],
  onSubscriptionChange: vi.fn(),
  footer: <div>Test footer content</div>,
};

function renderSummary(overrides: Partial<SummaryProps> = {}) {
  const props = { ...defaultProps, ...overrides };
  return render(<Summary {...props} />);
}

describe('Summary', () => {
  describe('rendering', () => {
    it('renders subscription name, billing period, and price in the subscription section', () => {
      renderSummary();

      const subscriptionSection = screen.getByRole('region', {
        name: /subscription/i,
      });

      expect(subscriptionSection).toHaveTextContent(/arcade\s*\(monthly\)/i);
      expect(subscriptionSection).toHaveTextContent(/\$\d+\/mo/i);
    });

    it('renders add-ons with names and prices in the add-ons section', () => {
      renderSummary();

      const addOnsList = screen.getByRole('list', { name: /add-ons/i });
      const items = within(addOnsList).getAllByRole('listitem');

      expect(items).toHaveLength(2);

      expect(items[0]).toHaveTextContent(/online service/i);
      expect(items[0]).toHaveTextContent(/\+\$\d+/i);

      expect(items[1]).toHaveTextContent(/larger storage/i);
      expect(items[1]).toHaveTextContent(/\+\$\d+/i);
    });

    it('does not render add-ons section when empty', () => {
      renderSummary({ addOns: [] });

      expect(screen.queryByRole('list', { name: /add-ons/i })).not.toBeInTheDocument();
    });

    it('renders total price in the total section', () => {
      renderSummary();

      const totalRow = screen.getByText(/total/i).closest('p');
      expect(totalRow).toBeInTheDocument();
      expect(totalRow).toHaveTextContent(/\$\d+\/mo/i);
    });

    it('calculates and displays correct total price in the total section', () => {
      renderSummary({
        subscription: { name: 'Arcade', billingPeriod: 'Monthly', price: 10 },
        addOns: [
          { name: 'Online service', price: 2 },
          { name: 'Larger storage', price: 3 },
        ],
      });

      const totalRow = screen.getByText(/total/i).closest('p');
      expect(totalRow).toHaveTextContent(/\$15\/mo/i);
    });

    it.each([
      { billingPeriod: 'Monthly' as const, suffix: /\/mo/i },
      { billingPeriod: 'Yearly' as const, suffix: /\/yr/i },
    ])(
      'renders all prices with correct suffix for $billingPeriod billing',
      ({ billingPeriod, suffix }) => {
        renderSummary({
          subscription: {
            name: 'Arcade',
            billingPeriod,
            price: 10,
          },
          addOns: [{ name: 'Addon', price: 5 }],
        });

        const subscriptionSection = screen.getByRole('region', {
          name: /subscription/i,
        });
        expect(subscriptionSection).toHaveTextContent(suffix);

        const addOnsList = screen.getByRole('list', { name: /add-ons/i });
        expect(addOnsList).toHaveTextContent(suffix);

        const totalRow = screen.getByText(/total/i).closest('p');
        expect(totalRow).toHaveTextContent(suffix);
      },
    );

    it('renders correctly with no add-ons and zero price', () => {
      renderSummary({
        subscription: {
          name: 'Free',
          billingPeriod: 'Monthly',
          price: 0,
        },
        addOns: [],
      });

      const subscriptionSection = screen.getByRole('region', {
        name: /subscription/i,
      });
      expect(subscriptionSection).toHaveTextContent(/free/i);
      expect(subscriptionSection).toHaveTextContent(/\$0\/mo/i);

      const totalRow = screen.getByText(/total/i).closest('p');
      expect(totalRow).toHaveTextContent(/\$0\/mo/i);

      expect(screen.queryByRole('list', { name: /add-ons/i })).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onSubscriptionChange when clicking "Change subscription"', async () => {
      const user = userEvent.setup();
      const onSubscriptionChange = vi.fn();

      renderSummary({ onSubscriptionChange });

      const subscriptionSection = screen.getByRole('region', {
        name: /subscription/i,
      });

      await user.click(
        within(subscriptionSection).getByRole('button', {
          name: /change subscription/i,
        }),
      );

      expect(onSubscriptionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('renders subscription section with accessible label', () => {
      renderSummary();

      expect(screen.getByRole('region', { name: /subscription/i })).toBeInTheDocument();
    });

    it('renders add-ons list with accessible name when present', () => {
      renderSummary();

      expect(screen.getByRole('list', { name: /add-ons/i })).toBeInTheDocument();
    });

    it('renders footer content when provided', () => {
      renderSummary({
        footer: (
          <div>
            <button>Go Back</button>
            <button>Confirm</button>
          </div>
        ),
      });

      expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    });
  });
});
