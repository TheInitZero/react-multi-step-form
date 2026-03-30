import { useTitleFocus } from '../hooks/use-title-focus';

export default function ConfirmationMessage() {
  const titleRefCallback = useTitleFocus<HTMLHeadingElement>();

  return (
    <section
      aria-label="Subscription confirmed"
      className="space-y-2 rounded-2xl border-2 border-gray-200 p-4 text-center shadow-sm"
    >
      <svg
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mx-auto size-16 stroke-green-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
        />
      </svg>

      <h2 tabIndex={-1} className="text-xl outline-none" ref={titleRefCallback}>
        Thank you!
      </h2>

      <p className="max-w-[60ch]">
        Thanks for confirming your subscription! We hope you have fun using our platform. If you
        ever need support, please feel free to email us at{' '}
        <a
          href="#"
          className="text-blue-700 underline underline-offset-2 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
        >
          support@loremgaming.com
        </a>
        .
      </p>
    </section>
  );
}
