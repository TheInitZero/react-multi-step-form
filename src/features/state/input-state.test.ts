import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { inputMachine } from './input-state';

describe('inputMachine', () => {
  const getActor = () => createActor(inputMachine);

  it('should have correct initial context', () => {
    const actor = getActor();
    actor.start();

    const snapshot = actor.getSnapshot();

    expect(snapshot.context).toEqual({
      name: '',
      email: '',
      telephone: '',
      billingPeriod: 'Monthly',
      subscriptionId: 'arcade',
      addOnIds: new Set(),
    });
  });

  it('should update name on SET_NAME', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_NAME', name: 'John Doe' });

    expect(actor.getSnapshot().context.name).toBe('John Doe');
  });

  it('should update email on SET_EMAIL', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_EMAIL', email: 'john@example.com' });

    expect(actor.getSnapshot().context.email).toBe('john@example.com');
  });

  it('should update telephone on SET_TELEPHONE', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_TELEPHONE', telephone: '+1234567890' });

    expect(actor.getSnapshot().context.telephone).toBe('+1234567890');
  });

  it('should update billingPeriod on SET_BILLING_PERIOD', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_BILLING_PERIOD', billingPeriod: 'Yearly' });

    expect(actor.getSnapshot().context.billingPeriod).toBe('Yearly');
  });

  it('should update subscriptionId on SET_SUBSCRIPTION_ID', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_SUBSCRIPTION_ID', subscriptionId: 'pro' });

    expect(actor.getSnapshot().context.subscriptionId).toBe('pro');
  });

  it('should add addOnId on TOGGLE_ADD_ON when not present', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'online-service' });

    const addOnIds = actor.getSnapshot().context.addOnIds;
    expect(addOnIds.has('online-service')).toBe(true);
    expect(addOnIds.size).toBe(1);
  });

  it('should remove addOnId on TOGGLE_ADD_ON when already present', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'online-service' });
    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'online-service' });

    const addOnIds = actor.getSnapshot().context.addOnIds;
    expect(addOnIds.has('online-service')).toBe(false);
    expect(addOnIds.size).toBe(0);
  });

  it('should handle multiple addOns independently', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'online-service' });
    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'larger-storage' });
    actor.send({ type: 'TOGGLE_ADD_ON', addOnId: 'online-service' });

    const addOnIds = actor.getSnapshot().context.addOnIds;
    expect(addOnIds.has('online-service')).toBe(false);
    expect(addOnIds.has('larger-storage')).toBe(true);
    expect(addOnIds.has('customizable-profile')).toBe(false);
    expect(addOnIds.size).toBe(1);
  });

  it('should maintain other context values when updating a field', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'SET_NAME', name: 'Jane Doe' });
    actor.send({ type: 'SET_EMAIL', email: 'jane@example.com' });
    actor.send({ type: 'SET_BILLING_PERIOD', billingPeriod: 'Yearly' });

    const snapshot = actor.getSnapshot();

    expect(snapshot.context.name).toBe('Jane Doe');
    expect(snapshot.context.email).toBe('jane@example.com');
    expect(snapshot.context.telephone).toBe('');
    expect(snapshot.context.billingPeriod).toBe('Yearly');
    expect(snapshot.context.subscriptionId).toBe('arcade');
    expect(snapshot.context.addOnIds.size).toBe(0);
  });
});
