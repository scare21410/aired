import type { Project, ProjectId, OrganizationId } from '@aired/domain';

export default interface IProjectReadonlyRepository {
  find(
    id: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Project | undefined>;
}
