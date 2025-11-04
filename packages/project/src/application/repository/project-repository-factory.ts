import type IProjectReadonlyRepository from './project-readonly-repository.js';
import type IProjectQuery from './project-query.js';
import type IProjectRepository from './project-repository.js';

export default interface IProjectRepositoryFactory {
  createRepository(): IProjectRepository;
  createReadonlyRepository(): IProjectReadonlyRepository;
  createQuery(): IProjectQuery;
}
