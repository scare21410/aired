import type { Project, ProjectCreateType } from '@aired/domain';
import type IProjectReadonlyRepository from './project-readonly-repository.js';

export default interface IProjectRepository extends IProjectReadonlyRepository {
  create(data: ProjectCreateType): Promise<Project>;
  update(aggregate: Project): Promise<void>;
  delete(aggregate: Project): Promise<void>;
}
