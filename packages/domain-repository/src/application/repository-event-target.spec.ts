import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Organization } from '@aired/domain';
import {
  organizationAFactory,
  organizationBFactory,
} from '@aired/domain-fakes';
import RepositoryEventTarget from './repository-event-target.js';

class TestRepositoryEventTarget extends RepositoryEventTarget<Organization> {
  public triggerEmitRead(aggregate: Organization): void {
    this.emitRead(aggregate);
  }

  public triggerEmitCreate(aggregate: Organization): void {
    this.emitCreate(aggregate);
  }

  public triggerEmitUpdate(aggregate: Organization): void {
    this.emitUpdate(aggregate);
  }

  public triggerEmitDelete(aggregate: Organization): void {
    this.emitDelete(aggregate);
  }
}

describe('RepositoryEventTarget', () => {
  let eventTarget: TestRepositoryEventTarget;
  let testOrganization: Organization;

  beforeEach(() => {
    eventTarget = new TestRepositoryEventTarget();
    testOrganization = organizationAFactory();
  });

  describe('addEventListener', () => {
    it('should add listener for create operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should add listener for read operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('read', listener);
      eventTarget.triggerEmitRead(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should add listener for update operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('update', listener);
      eventTarget.triggerEmitUpdate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should add listener for delete operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('delete', listener);
      eventTarget.triggerEmitDelete(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should add multiple listeners for the same operation', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventTarget.addEventListener('create', listener1);
      eventTarget.addEventListener('create', listener2);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should respect listener options', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener, { once: true });

      eventTarget.triggerEmitCreate(testOrganization);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeEventListener', () => {
    it('should remove listener for create operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener);
      eventTarget.removeEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove listener for read operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('read', listener);
      eventTarget.removeEventListener('read', listener);
      eventTarget.triggerEmitRead(testOrganization);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove listener for update operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('update', listener);
      eventTarget.removeEventListener('update', listener);
      eventTarget.triggerEmitUpdate(testOrganization);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should remove listener for delete operation', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('delete', listener);
      eventTarget.removeEventListener('delete', listener);
      eventTarget.triggerEmitDelete(testOrganization);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should only remove the specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventTarget.addEventListener('create', listener1);
      eventTarget.addEventListener('create', listener2);
      eventTarget.removeEventListener('create', listener1);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispatchEvent', () => {
    it('should dispatch custom create event', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener);

      const event = new CustomEvent('create', {
        detail: { aggregate: testOrganization, operation: 'create' as const },
      });
      const result = eventTarget.dispatchEvent(event);

      expect(result).toBe(true);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return false if event is cancelled', () => {
      const listener = vi.fn((event) => {
        event.preventDefault();
      });
      eventTarget.addEventListener('create', listener);

      const event = new CustomEvent('create', {
        detail: { aggregate: testOrganization, operation: 'create' as const },
        cancelable: true,
      });
      const result = eventTarget.dispatchEvent(event);

      expect(result).toBe(false);
    });
  });

  describe('emitRead', () => {
    it('should emit read event with correct aggregate', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('read', listener);
      eventTarget.triggerEmitRead(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event.detail.aggregate).toBe(testOrganization);
      expect(event.detail.operation).toBe('read');
    });

    it('should not trigger listeners for other operations', () => {
      const createListener = vi.fn();
      const updateListener = vi.fn();
      const deleteListener = vi.fn();

      eventTarget.addEventListener('create', createListener);
      eventTarget.addEventListener('update', updateListener);
      eventTarget.addEventListener('delete', deleteListener);
      eventTarget.triggerEmitRead(testOrganization);

      expect(createListener).not.toHaveBeenCalled();
      expect(updateListener).not.toHaveBeenCalled();
      expect(deleteListener).not.toHaveBeenCalled();
    });
  });

  describe('emitCreate', () => {
    it('should emit create event with correct aggregate', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event.detail.aggregate).toBe(testOrganization);
      expect(event.detail.operation).toBe('create');
    });

    it('should not trigger listeners for other operations', () => {
      const readListener = vi.fn();
      const updateListener = vi.fn();
      const deleteListener = vi.fn();

      eventTarget.addEventListener('read', readListener);
      eventTarget.addEventListener('update', updateListener);
      eventTarget.addEventListener('delete', deleteListener);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(readListener).not.toHaveBeenCalled();
      expect(updateListener).not.toHaveBeenCalled();
      expect(deleteListener).not.toHaveBeenCalled();
    });
  });

  describe('emitUpdate', () => {
    it('should emit update event with correct aggregate', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('update', listener);
      eventTarget.triggerEmitUpdate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event.detail.aggregate).toBe(testOrganization);
      expect(event.detail.operation).toBe('update');
    });

    it('should not trigger listeners for other operations', () => {
      const readListener = vi.fn();
      const createListener = vi.fn();
      const deleteListener = vi.fn();

      eventTarget.addEventListener('read', readListener);
      eventTarget.addEventListener('create', createListener);
      eventTarget.addEventListener('delete', deleteListener);
      eventTarget.triggerEmitUpdate(testOrganization);

      expect(readListener).not.toHaveBeenCalled();
      expect(createListener).not.toHaveBeenCalled();
      expect(deleteListener).not.toHaveBeenCalled();
    });
  });

  describe('emitDelete', () => {
    it('should emit delete event with correct aggregate', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('delete', listener);
      eventTarget.triggerEmitDelete(testOrganization);

      expect(listener).toHaveBeenCalledTimes(1);
      const event = listener.mock.calls[0][0];
      expect(event.detail.aggregate).toBe(testOrganization);
      expect(event.detail.operation).toBe('delete');
    });

    it('should not trigger listeners for other operations', () => {
      const readListener = vi.fn();
      const createListener = vi.fn();
      const updateListener = vi.fn();

      eventTarget.addEventListener('read', readListener);
      eventTarget.addEventListener('create', createListener);
      eventTarget.addEventListener('update', updateListener);
      eventTarget.triggerEmitDelete(testOrganization);

      expect(readListener).not.toHaveBeenCalled();
      expect(createListener).not.toHaveBeenCalled();
      expect(updateListener).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple operations in sequence', () => {
      const createListener = vi.fn();
      const updateListener = vi.fn();
      const deleteListener = vi.fn();

      eventTarget.addEventListener('create', createListener);
      eventTarget.addEventListener('update', updateListener);
      eventTarget.addEventListener('delete', deleteListener);

      eventTarget.triggerEmitCreate(testOrganization);
      eventTarget.triggerEmitUpdate(testOrganization);
      eventTarget.triggerEmitDelete(testOrganization);

      expect(createListener).toHaveBeenCalledTimes(1);
      expect(updateListener).toHaveBeenCalledTimes(1);
      expect(deleteListener).toHaveBeenCalledTimes(1);
    });

    it('should handle different aggregates', () => {
      const listener = vi.fn();
      eventTarget.addEventListener('create', listener);

      const org1 = organizationAFactory();
      const org2 = organizationBFactory();

      eventTarget.triggerEmitCreate(org1);
      eventTarget.triggerEmitCreate(org2);

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls[0][0].detail.aggregate).toBe(org1);
      expect(listener.mock.calls[1][0].detail.aggregate).toBe(org2);
    });

    it('should support adding and removing listeners dynamically', () => {
      const listener = vi.fn();

      eventTarget.addEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      eventTarget.removeEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      eventTarget.addEventListener('create', listener);
      eventTarget.triggerEmitCreate(testOrganization);

      expect(listener).toHaveBeenCalledTimes(2);
    });
  });
});
