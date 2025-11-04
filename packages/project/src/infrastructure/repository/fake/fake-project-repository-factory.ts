import type { DomainDatabase } from '@aired/domain-database';
import { fakeRepositoryFactoryBuilder } from '@aired/domain-repository';
import FakeProjectReadonlyRepository from './fake-project-readonly-repository.js';
import FakeProjectQuery from './fake-project-query.js';
import FakeProjectRepository from './fake-project-repository.js';

export default function fakeProjectRepositoryFactory(db: DomainDatabase) {
  const builder = fakeRepositoryFactoryBuilder(
    (db) => new FakeProjectReadonlyRepository(db),
    (db) => new FakeProjectRepository(db),
    (db) => new FakeProjectQuery(db),
  );
  return builder(db);
}
