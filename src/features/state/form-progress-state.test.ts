import { describe, it, expect } from 'vitest';
import { createActor } from 'xstate';
import { formProgressMachine } from './form-progress-state';

describe('formProgressMachine', () => {
  const getActor = () => createActor(formProgressMachine);

  it('should start in yourInfo with correct initial statusRecord', () => {
    const actor = getActor();
    actor.start();

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('yourInfo');
    expect(snapshot.context.statusRecord).toEqual({
      'your-info': 'Started',
      'select-plan': 'NotStarted',
      'add-ons': 'NotStarted',
      summary: 'NotStarted',
    });
  });

  it('should NOT transition if YOUR_INFO.NEXT guard fails', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: false });

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('yourInfo');
    expect(snapshot.context.statusRecord['your-info']).toBe('Started');
  });

  it('should transition to selectPlan when YOUR_INFO.NEXT is valid', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('selectPlan');
    expect(snapshot.context.statusRecord).toEqual({
      'your-info': 'Completed',
      'select-plan': 'Started',
      'add-ons': 'NotStarted',
      summary: 'NotStarted',
    });
  });

  it('should go back to yourInfo from selectPlan', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.BACK' });

    expect(actor.getSnapshot().value).toBe('yourInfo');
  });

  it('should transition to addOns and update status', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('addOns');
    expect(snapshot.context.statusRecord).toEqual({
      'your-info': 'Completed',
      'select-plan': 'Completed',
      'add-ons': 'Started',
      summary: 'NotStarted',
    });
  });

  it('should handle ADD_ONS.BACK correctly', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.BACK' });

    expect(actor.getSnapshot().value).toBe('selectPlan');
  });

  it('should transition to summary and update status', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.NEXT' });

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('summary');
    expect(snapshot.context.statusRecord).toEqual({
      'your-info': 'Completed',
      'select-plan': 'Completed',
      'add-ons': 'Completed',
      summary: 'Started',
    });
  });

  it('should go back to addOns from summary', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.NEXT' });
    actor.send({ type: 'SUMMARY.BACK' });

    expect(actor.getSnapshot().value).toBe('addOns');
  });

  it('should jump to selectPlan on CHANGE_SUBSCRIPTION', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.NEXT' });
    actor.send({ type: 'SUMMARY.CHANGE_SUBSCRIPTION' });

    expect(actor.getSnapshot().value).toBe('selectPlan');
  });

  it('should reach confirmation and mark summary as completed', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.NEXT' });
    actor.send({ type: 'SUMMARY.NEXT' });

    const snapshot = actor.getSnapshot();

    expect(snapshot.value).toBe('confirmation');
    expect(snapshot.context.statusRecord.summary).toBe('Completed');
  });

  it('should be in final state at confirmation', () => {
    const actor = getActor();
    actor.start();

    actor.send({ type: 'YOUR_INFO.NEXT', isInfoValid: true });
    actor.send({ type: 'SELECT_PLAN.NEXT' });
    actor.send({ type: 'ADD_ONS.NEXT' });
    actor.send({ type: 'SUMMARY.NEXT' });

    expect(actor.getSnapshot().status).toBe('done');
  });
});
