import { assign, setup } from 'xstate';

type BillingPeriod = 'Monthly' | 'Yearly';

type Subscription = {
  id: string;
  name: string;
  price: Record<BillingPeriod, number>;
  bonuses: string[];
};

type AddOn = {
  id: string;
  name: string;
  price: Record<BillingPeriod, number>;
  description: string;
};

type Context = {
  name: string;
  email: string;
  telephone: string;
  billingPeriod: BillingPeriod;
  subscriptionId: Subscription['id'];
  addOnIds: Set<AddOn['id']>;
};

type Events =
  | { type: 'SET_NAME'; name: Context['name'] }
  | { type: 'SET_EMAIL'; email: Context['email'] }
  | { type: 'SET_TELEPHONE'; telephone: Context['telephone'] }
  | { type: 'SET_BILLING_PERIOD'; billingPeriod: Context['billingPeriod'] }
  | { type: 'SET_SUBSCRIPTION_ID'; subscriptionId: Context['subscriptionId'] }
  | { type: 'TOGGLE_ADD_ON'; addOnId: AddOn['id'] };

export const subscriptions: Record<Subscription['id'], Subscription> = {
  arcade: {
    id: 'arcade',
    name: 'Arcade',
    price: {
      Monthly: 9,
      Yearly: 90,
    },
    bonuses: ['2 months free'],
  },

  advanced: {
    id: 'advanced',
    name: 'Advanced',
    price: {
      Monthly: 12,
      Yearly: 120,
    },
    bonuses: ['3 months free'],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: {
      Monthly: 15,
      Yearly: 150,
    },
    bonuses: ['4 months free'],
  },
};

export const addOns: Record<AddOn['id'], AddOn> = {
  'online-service': {
    id: 'online-service',
    name: 'Online service',
    description: 'Access to multiplayer games',
    price: {
      Monthly: 1,
      Yearly: 10,
    },
  },

  'larger-storage': {
    id: 'larger-storage',
    name: 'Larger storage',
    description: 'Extra 1TB of cloud save',
    price: {
      Monthly: 2,
      Yearly: 20,
    },
  },

  'customizable-profile': {
    id: 'customizable-profile',
    name: 'Customizable Profile',
    description: 'Custom theme on your profile',
    price: {
      Monthly: 2,
      Yearly: 20,
    },
  },
};

export const inputMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
  },

  actions: {
    toggleAddOnId: assign({
      addOnIds: (_, params: { addOnIds: Context['addOnIds']; addOnId: AddOn['id'] }) => {
        const { addOnIds, addOnId } = params;
        const nextAddOnIds = new Set(addOnIds);

        if (nextAddOnIds.has(addOnId)) {
          nextAddOnIds.delete(addOnId);
        } else {
          nextAddOnIds.add(addOnId);
        }

        return nextAddOnIds;
      },
    }),
  },
}).createMachine({
  id: 'user-input',

  context: {
    name: '',
    email: '',
    telephone: '',
    billingPeriod: 'Monthly',
    subscriptionId: 'arcade',
    addOnIds: new Set(),
  },

  on: {
    SET_NAME: {
      actions: assign({ name: ({ event }) => event.name }),
    },

    SET_EMAIL: {
      actions: assign({ email: ({ event }) => event.email }),
    },

    SET_TELEPHONE: {
      actions: assign({ telephone: ({ event }) => event.telephone }),
    },

    SET_BILLING_PERIOD: {
      actions: assign({ billingPeriod: ({ event }) => event.billingPeriod }),
    },

    SET_SUBSCRIPTION_ID: {
      actions: assign({ subscriptionId: ({ event }) => event.subscriptionId }),
    },

    TOGGLE_ADD_ON: {
      actions: {
        type: 'toggleAddOnId',
        params: ({ context, event }) => ({ addOnIds: context.addOnIds, addOnId: event.addOnId }),
      },
    },
  },
});
