import { type OrganizationId, Project } from '@aired/domain';
import { DomainDatabase } from '@aired/domain-database';
import type IProjectQuery from '../../../application/repository/project-query.js';

export default class FakeProjectQuery implements IProjectQuery {
  private readonly db: DomainDatabase;

  constructor(db: DomainDatabase) {
    this.db = db;
  }

  findByOrganizationId(organizationId: OrganizationId): Promise<Project[]> {
    const aggregates = this.db.filter(
      (project): project is Project =>
        project instanceof Project && project.organizationId === organizationId,
    );
    return Promise.resolve(aggregates);
  }
}
