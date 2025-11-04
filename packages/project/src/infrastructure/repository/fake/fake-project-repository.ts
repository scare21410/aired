import { Project, type ProjectCreateType } from '@aired/domain';
import type { DomainDatabase } from '@aired/domain-database';
import type IProjectRepository from '../../../application/repository/project-repository.js';
import FakeProjectReadonlyRepository from './fake-project-readonly-repository.js';

export default class FakeProjectRepository
  extends FakeProjectReadonlyRepository
  implements IProjectRepository
{
  private readonly db: DomainDatabase;

  constructor(db: DomainDatabase) {
    super(db);
    this.db = db;
  }

  create(data: ProjectCreateType): Promise<Project> {
    const id = crypto.randomUUID();
    const project = Project.from({
      id: id,
      ...data,
    });
    this.db.insert(project);
    this.emitCreate(project);

    return Promise.resolve(project);
  }

  update(aggregate: Project): Promise<void> {
    this.db.update(aggregate);
    this.emitUpdate(aggregate);

    return Promise.resolve();
  }

  delete(aggregate: Project): Promise<void> {
    this.db.delete(aggregate);
    this.emitDelete(aggregate);

    return Promise.resolve();
  }
}
