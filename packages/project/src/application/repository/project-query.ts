import type { OrganizationId, Project } from '@aired/domain';

export default interface IProjectQuery {
  findByOrganizationId(organizationId: OrganizationId): Promise<Project[]>;
}
