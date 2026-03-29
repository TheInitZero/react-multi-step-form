import { assign, setup } from 'xstate';

type FormStep = { id: string; title: string };

type FormStepStatus = 'Completed' | 'Started' | 'NotStarted';

type StatusRecord = Record<FormStep['id'], FormStepStatus>;

type Context = {
  statusRecord: StatusRecord;
};

type Events =
  | { type: 'YOUR_INFO.NEXT'; isInfoValid: boolean }
  | {
      type:
        | 'SELECT_PLAN.BACK'
        | 'SELECT_PLAN.NEXT'
        | 'ADD_ONS.BACK'
        | 'ADD_ONS.NEXT'
        | 'SUMMARY.CHANGE_SUBSCRIPTION'
        | 'SUMMARY.BACK'
        | 'SUMMARY.NEXT';
    };

export const formSteps: Record<FormStep['id'], FormStep> = {
  'your-info': { id: 'your-info', title: 'Your info' },
  'select-plan': { id: 'select-plan', title: 'Select plan' },
  'add-ons': { id: 'add-ons', title: 'Add-ons' },
  summary: { id: 'summary', title: 'Summary' },
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
  },
}).createMachine({
  id: 'form-progress-machine',

  context: {
    statusRecord: {
      'your-info': 'Started',
      'select-plan': 'NotStarted',
      'add-ons': 'NotStarted',
      summary: 'NotStarted',
    },
  },

  initial: 'yourInfo',

  states: {
    yourInfo: {
      tags: ['yourInfo'],

      on: {
        'YOUR_INFO.NEXT': {
          target: 'selectPlan',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'your-info': 'Completed', 'select-plan': 'Started' },
            },
          ],
        },
      },
    },

    selectPlan: {
      tags: ['selectPlan'],

      on: {
        'SELECT_PLAN.BACK': {
          target: 'yourInfo',
        },

        'SELECT_PLAN.NEXT': {
          target: 'addOns',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'select-plan': 'Completed', 'add-ons': 'Started' },
            },
          ],
        },
      },
    },

    addOns: {
      tags: ['addOns'],

      on: {
        'ADD_ONS.BACK': {
          target: 'selectPlan',
        },

        'ADD_ONS.NEXT': {
          target: 'summary',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { 'add-ons': 'Completed', summary: 'Started' },
            },
          ],
        },
      },
    },

    summary: {
      tags: ['summary'],

      on: {
        'SUMMARY.CHANGE_SUBSCRIPTION': {
          target: 'selectPlan',
        },

        'SUMMARY.BACK': {
          target: 'addOns',
        },

        'SUMMARY.NEXT': {
          target: 'confirmation',
          actions: [
            {
              type: 'updateStatusRecord',
              params: { summary: 'Completed' },
            },
          ],
        },
      },
    },

    confirmation: { tags: ['confirmation'], type: 'final' },
  },
});
