import { Project, type ProjectId, type OrganizationId } from '@aired/domain';
import { RepositoryEventTarget } from '@aired/domain-repository';
import type { DomainDatabase } from '@aired/domain-database';
import type IProjectReadonlyRepository from '../../../application/repository/project-readonly-repository.js';

export default class FakeProjectReadonlyRepository
  extends RepositoryEventTarget<Project>
  implements IProjectReadonlyRepository
{
  private readonly readonlyDb: DomainDatabase;

  constructor(db: DomainDatabase) {
    super();
    this.readonlyDb = db;
  }

  find(
    id: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Project | undefined> {
    const aggregate = this.readonlyDb.find(
      (project): project is Project =>
        project instanceof Project &&
        project.id === id &&
        project.organizationId === organizationId,
    );
    return Promise.resolve(aggregate);
  }
}
