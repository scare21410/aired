import type { Aggregate } from '@aired/domain';

type RepositoryOperations = 'create' | 'read' | 'update' | 'delete';

type RepositoryEvent<
  O extends RepositoryOperations,
  T extends Aggregate,
> = CustomEvent<{
  operation: O;
  aggregate: T;
}>;

type RepositoryEventListener<
  T extends Aggregate,
  O extends RepositoryOperations,
> =
  | ((event: RepositoryEvent<O, T>) => void)
  | {
      handleEvent(object: Event): void;
    }
  | null;

export default class RepositoryEventTarget<
  T extends Aggregate,
> extends EventTarget {
  addEventListener<O extends RepositoryOperations>(
    type: O,
    listener: RepositoryEventListener<T, O>,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(type, listener as EventListener, options);
  }

  removeEventListener<O extends RepositoryOperations>(
    type: O,
    listener: RepositoryEventListener<T, O>,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(type, listener as EventListener, options);
  }

  dispatchEvent<O extends RepositoryOperations>(
    event: RepositoryEvent<O, T>,
  ): boolean {
    return super.dispatchEvent(event);
  }

  protected emitRead(aggregate: T): void {
    this.dispatchEvent(
      new CustomEvent('read', { detail: { aggregate, operation: 'read' } }),
    );
  }

  protected emitCreate(aggregate: T): void {
    this.dispatchEvent(
      new CustomEvent('create', { detail: { aggregate, operation: 'create' } }),
    );
  }

  protected emitUpdate(aggregate: T): void {
    this.dispatchEvent(
      new CustomEvent('update', { detail: { aggregate, operation: 'update' } }),
    );
  }

  protected emitDelete(aggregate: T): void {
    this.dispatchEvent(
      new CustomEvent('delete', { detail: { aggregate, operation: 'delete' } }),
    );
  }
}
