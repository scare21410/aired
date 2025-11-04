import type { DomainDatabase } from '@aired/domain-database';
import type { IRepositoryFactory } from './repository-factory.js';
import EmptyCommands from './empty-commands.js';
import EmptyQuery from './empty-query.js';

type ReadonlyRepositoryBuilder<TRepository> = (
  db: DomainDatabase,
) => TRepository;

type RepositoryBuilder<TRepository> = (db: DomainDatabase) => TRepository;

type RepositoryFactoryBuilder<
  TReadonlyRepository,
  TRepository,
  TQuery,
  TCommands,
> = (
  db: DomainDatabase,
) => IRepositoryFactory<TReadonlyRepository, TRepository, TQuery, TCommands>;

type QueryFactory<TQuery> = (_db: DomainDatabase) => TQuery;

type CommandsFactory<TCommands> = (db: DomainDatabase) => TCommands;

function emptyQueryFactory<TQuery>(_db: DomainDatabase) {
  return new EmptyQuery() as TQuery;
}

function emptyCommandsFactory<TCommands>(_db: DomainDatabase) {
  return new EmptyCommands() as TCommands;
}

export default function fakeRepositoryFactoryBuilder<
  TReadonlyRepository,
  TRepository,
  TQuery,
  TCommands,
>(
  readonlyRepositoryFactory: ReadonlyRepositoryBuilder<TReadonlyRepository>,
  repositoryFactory: RepositoryBuilder<TRepository>,
  queryFactory: QueryFactory<TQuery> = emptyQueryFactory<TQuery>,
  commandsFactory: CommandsFactory<TCommands> = emptyCommandsFactory<TCommands>,
): RepositoryFactoryBuilder<
  TReadonlyRepository,
  TRepository,
  TQuery,
  TCommands
> {
  return function (db: DomainDatabase) {
    return {
      createReadonlyRepository: () => readonlyRepositoryFactory(db),
      createRepository: () => repositoryFactory(db),
      createQuery: () => queryFactory(db),
      createCommands: () => commandsFactory(db),
    };
  };
}
