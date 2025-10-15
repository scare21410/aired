import {
  Project,
  type ProjectCreateType,
  type ProjectId,
  type OrganizationId,
} from '@aired/domain';
import { RepositoryEventTarget } from '@aired/domain-repository';
import type { DomainDatabase } from '@aired/domain-database';
import type IProjectRepository from '../../../application/repository/project-repository';

export default class FakeProjectRepository
  extends RepositoryEventTarget<Project>
  implements IProjectRepository
{
  private readonly db: DomainDatabase;

  constructor(db: DomainDatabase) {
    super();
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

  find(
    id: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Project | undefined> {
    const aggregate = this.db.find(
      (project): project is Project =>
        project instanceof Project &&
        project.id === id &&
        project.organizationId === organizationId,
    );
    return Promise.resolve(aggregate);
  }

  findByOrganizationId(organizationId: OrganizationId): Promise<Project[]> {
    const aggregates = this.db.filter(
      (project): project is Project =>
        project instanceof Project && project.organizationId === organizationId,
    );
    return Promise.resolve(aggregates);
  }
}
