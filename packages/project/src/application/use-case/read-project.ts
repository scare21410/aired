import type { OrganizationId, Project, ProjectId } from '@aired/domain';
import type IProjectReadonlyRepository from '../repository/project-readonly-repository.js';

export default class ReadProject {
  private readonly repository: IProjectReadonlyRepository;

  constructor(repository: IProjectReadonlyRepository) {
    this.repository = repository;
  }

  async execute(
    id: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Project | undefined> {
    return this.repository.find(id, organizationId);
  }
}
