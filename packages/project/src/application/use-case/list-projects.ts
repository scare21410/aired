import type { OrganizationId, Project } from '@aired/domain';
import type IProjectQuery from '../repository/project-query.js';

export default class ListProjects {
  private readonly query: IProjectQuery;

  constructor(query: IProjectQuery) {
    this.query = query;
  }

  async execute(organizationId: OrganizationId): Promise<Project[]> {
    return this.query.findByOrganizationId(organizationId);
  }
}
