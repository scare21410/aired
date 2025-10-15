import type { Aggregate } from '@aired/domain';

export interface DomainDatabaseQueryInterface {
  find<T extends Aggregate>(
    predicate: (entity: T) => entity is T,
  ): T | undefined;

  filter<T extends Aggregate>(
    predicate: (entity: T) => entity is T,
  ): readonly T[];

  insert(entity: Aggregate): void;

  update(entity: Aggregate): void;

  delete(entity: Aggregate): void;
}
