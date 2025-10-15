import type { Aggregate } from '@aired/domain';
import type EmptyQuery from './empty-query.js';
import type EmptyCommands from './empty-commands.js';

export interface IReadonlyRepository<T extends Aggregate> {
  find(id: T['id']): Promise<T | undefined>;
}

export interface IRepository<T extends Aggregate, CreateData>
  extends IReadonlyRepository<T> {
  create(entity: CreateData): Promise<T['id']>;
  save(entity: T): Promise<void>;
  delete(entity: T): Promise<void>;
}

export interface IRepositoryFactory<
  TReadonlyRepository extends IReadonlyRepository<Aggregate>,
  TRepository extends IRepository<Aggregate, unknown>,
  TQuery = EmptyQuery,
  TCommands = EmptyCommands,
> {
  createReadonlyRepository(): TReadonlyRepository;
  createRepository(): TRepository;
  query(): TQuery;
  commands(): TCommands;
}
