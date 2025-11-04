import type EmptyQuery from './empty-query.js';
import type EmptyCommands from './empty-commands.js';

export interface IRepositoryFactory<
  TReadonlyRepository,
  TRepository,
  TQuery = EmptyQuery,
  TCommands = EmptyCommands,
> {
  createReadonlyRepository(): TReadonlyRepository;
  createRepository(): TRepository;
  createQuery(): TQuery;
  createCommands(): TCommands;
}
