import { assign, setup } from 'xstate';
import { none, some, type Maybe } from '../../utils';

type FormStep = { id: string; title: string };

type FormStepStatus = 'Completed' | 'Started' | 'NotStarted';

type StatusRecord = Record<FormStep['id'], FormStepStatus>;

type SideEffect = {
  kind: 'FocusTitle';
  titleEl: HTMLHeadingElement | HTMLLegendElement;
};

type Context = {
  statusRecord: StatusRecord;
  maybeSideEffect: Maybe<SideEffect>;
};

type Events =
  | { type: 'YOUR_INFO.NEXT'; titleElToFocus: SideEffect['titleEl']; isInfoValid: boolean }
  | {
      type:
        | 'SELECT_PLAN.BACK'
        | 'SELECT_PLAN.NEXT'
        | 'ADD_ONS.BACK'
        | 'ADD_ONS.NEXT'
        | 'SUMMARY.CHANGE_SUBSCRIPTION'
        | 'SUMMARY.BACK'
        | 'SUMMARY.NEXT';
      titleElToFocus: SideEffect['titleEl'];
    };

export const formProgressMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },

  actions: {
    updateStatusRecord: assign({
      statusRecord: ({ context }, params: StatusRecord) => {
        return {
          ...context.statusRecord,
          ...params,
        };
      },
    }),

    updateSideEffext: assign({
      maybeSideEffect: (_, params: Maybe<SideEffect>) => {
        return params;
      },
    }),
  },
}).createMachine({
  id: 'form-progress-machine',

  context: {
    statusRecord: {
      'your-info': 'NotStarted',
      'select-plan': 'NotStarted',
      'add-ons': 'NotStarted',
      summary: 'NotStarted',
    },

    maybeSideEffect: none(),
  },

  initial: 'yourInfo',

  states: {
    yourInfo: {
      on: {
        'YOUR_INFO.NEXT': {
          target: 'selectPlan',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'your-info': 'Completed', 'select-plan': 'Started' },
            },
            {
              type: 'updateSideEffext',
              params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
            },
          ],
        },
      },
    },

    selectPlan: {
      on: {
        'SELECT_PLAN.BACK': {
          target: 'yourInfo',
          actions: {
            type: 'updateSideEffext',
            params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
          },
        },

        'SELECT_PLAN.NEXT': {
          target: 'addOns',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'select-plan': 'Completed', 'add-ons': 'Started' },
            },
            {
              type: 'updateSideEffext',
              params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
            },
          ],
        },
      },
    },

    addOns: {
      on: {
        'ADD_ONS.BACK': {
          target: 'selectPlan',
          actions: {
            type: 'updateSideEffext',
            params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
          },
        },

        'ADD_ONS.NEXT': {
          target: 'summary',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'add-ons': 'Completed', summary: 'Started' },
            },
            {
              type: 'updateSideEffext',
              params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
            },
          ],
        },
      },
    },

    summary: {
      on: {
        'SUMMARY.CHANGE_SUBSCRIPTION': {
          target: 'selectPlan',
          actions: {
            type: 'updateSideEffext',
            params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
          },
        },

        'SUMMARY.BACK': {
          target: 'addOns',
          actions: {
            type: 'updateSideEffext',
            params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
          },
        },

        'SUMMARY.NEXT': {
          target: 'confirmation',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { summary: 'Completed' },
            },
            {
              type: 'updateSideEffext',
              params: ({ event }) => some({ kind: 'FocusTitle', titleEl: event.titleElToFocus }),
            },
          ],
        },
      },
    },

    confirmation: { type: 'final' },
  },
});
