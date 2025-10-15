import type {
  Project,
  ProjectCreateType,
  ProjectId,
  OrganizationId,
} from '@aired/domain';

export default interface IProjectRepository {
  create(data: ProjectCreateType): Promise<Project>;
  update(aggregate: Project): Promise<void>;
  delete(aggregate: Project): Promise<void>;
  find(
    id: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Project | undefined>;
  findByOrganizationId(organizationId: OrganizationId): Promise<Project[]>;
}
