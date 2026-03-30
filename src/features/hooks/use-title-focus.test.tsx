import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { useTitleFocus } from './use-title-focus';

describe('useTitleFocus', () => {
  it('focuses the element on mount', () => {
    const focusSpy = vi.fn();

    function TestComponent() {
      const ref = useTitleFocus<HTMLInputElement>();

      return (
        <input
          ref={(node) => {
            if (node) {
              node.focus = focusSpy;
            }
            ref(node);
          }}
          data-testid="input"
        />
      );
    }

    render(<TestComponent />);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does not throw if ref is null', () => {
    function TestComponent() {
      const ref = useTitleFocus<HTMLInputElement>();

      return <input ref={ref} data-testid="input" />;
    }

    expect(() => render(<TestComponent />)).not.toThrow();
  });

  it('cleans up correctly on unmount', () => {
    const focusSpy = vi.fn();

    function TestComponent() {
      const ref = useTitleFocus<HTMLInputElement>();

      return (
        <input
          ref={(node) => {
            if (node) {
              node.focus = focusSpy;
            }
            ref(node);
          }}
        />
      );
    }

    const { unmount } = render(<TestComponent />);

    expect(focusSpy).toHaveBeenCalledTimes(1);

    // Should not throw on unmount (cleanup runs)
    expect(() => unmount()).not.toThrow();
  });

  it('does NOT focus if element appears after mount', () => {
    const focusSpy = vi.fn();

    function TestComponent() {
      const [show, setShow] = useState(false);
      const ref = useTitleFocus<HTMLInputElement>();

      return (
        <>
          <button onClick={() => setShow(true)}>show</button>
          {show && (
            <input
              ref={(node) => {
                if (node) {
                  node.focus = focusSpy;
                }
                ref(node);
              }}
            />
          )}
        </>
      );
    }

    render(<TestComponent />);

    // Trigger element mount AFTER initial render
    screen.getByText('show').click();

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('works with different element types', () => {
    const focusSpy = vi.fn();

    function TestComponent() {
      const ref = useTitleFocus<HTMLButtonElement>();

      return (
        <button
          ref={(node) => {
            if (node) {
              node.focus = focusSpy;
            }
            ref(node);
          }}
        >
          Click
        </button>
      );
    }

    render(<TestComponent />);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
