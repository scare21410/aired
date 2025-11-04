import { describe, it, expect, beforeEach } from 'vitest';
import { DomainDatabase } from '@aired/domain-database';
import {
  defaultAggregateSetFactory,
  organizationAFactory,
  organizationBFactory,
  projectAFactory,
  projectBFactory,
} from '@aired/domain-fakes';
import { createProjectId } from '@aired/domain';
import FakeProjectReadonlyRepository from './fake-project-readonly-repository.js';

describe('FakeProjectReadonlyRepository', () => {
  let db: DomainDatabase;
  let repository: FakeProjectReadonlyRepository;

  beforeEach(() => {
    db = new DomainDatabase(defaultAggregateSetFactory());
    repository = new FakeProjectReadonlyRepository(db);
  });

  describe('find', () => {
    it('finds a project by id and organizationId', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      const found = await repository.find(project.id, organizationA.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(project.id);
      expect(found?.organizationId).toBe(organizationA.id);
      expect(found?.name).toBe(project.name);
    });

    it('returns undefined when project does not exist', async () => {
      const organizationA = organizationAFactory();
      const nonExistentId = createProjectId(crypto.randomUUID());

      const found = await repository.find(nonExistentId, organizationA.id);

      expect(found).toBeUndefined();
    });

    it('returns undefined when organizationId does not match', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const project = projectAFactory(organizationA);

      const found = await repository.find(project.id, organizationB.id);

      expect(found).toBeUndefined();
    });

    it('finds the correct project when multiple exist', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationB);

      const foundA = await repository.find(projectA.id, organizationA.id);
      const foundB = await repository.find(projectB.id, organizationB.id);

      expect(foundA?.id).toBe(projectA.id);
      expect(foundA?.name).toBe('Project A');
      expect(foundB?.id).toBe(projectB.id);
      expect(foundB?.name).toBe('Project B');
    });

    it('finds projects from pre-populated database', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const found = await repository.find(projectA.id, organizationA.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(projectA.id);
    });
  });
});
