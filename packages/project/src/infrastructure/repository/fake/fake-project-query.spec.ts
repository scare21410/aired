import { describe, it, expect, beforeEach } from 'vitest';
import { DomainDatabase } from '@aired/domain-database';
import {
  defaultAggregateSetFactory,
  organizationAFactory,
  organizationBFactory,
  projectAFactory,
  projectBFactory,
} from '@aired/domain-fakes';
import FakeProjectQuery from './fake-project-query.js';
import FakeProjectRepository from './fake-project-repository.js';

describe('FakeProjectQuery', () => {
  let db: DomainDatabase;
  let query: FakeProjectQuery;
  let repository: FakeProjectRepository;

  beforeEach(() => {
    db = new DomainDatabase(defaultAggregateSetFactory());
    query = new FakeProjectQuery(db);
    repository = new FakeProjectRepository(db);
  });

  describe('findByOrganizationId', () => {
    it('finds all projects for an organization', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const projects = await query.findByOrganizationId(organizationA.id);

      expect(projects.length).toBeGreaterThan(0);
      expect(projects.some((p) => p.id === projectA.id)).toBe(true);
      expect(projects.every((p) => p.organizationId === organizationA.id)).toBe(
        true,
      );
    });

    it('returns empty array when no projects exist for organization', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationA);
      await repository.delete(projectA);
      await repository.delete(projectB);

      const projects = await query.findByOrganizationId(organizationA.id);

      expect(projects).toEqual([]);
    });

    it('only returns projects for specified organization', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();

      const projectsA = await query.findByOrganizationId(organizationA.id);
      const projectsB = await query.findByOrganizationId(organizationB.id);

      expect(
        projectsA.every((p) => p.organizationId === organizationA.id),
      ).toBe(true);
      expect(
        projectsB.every((p) => p.organizationId === organizationB.id),
      ).toBe(true);
      expect(projectsA.some((p) => p.organizationId === organizationB.id)).toBe(
        false,
      );
      expect(projectsB.some((p) => p.organizationId === organizationA.id)).toBe(
        false,
      );
    });

    it('includes newly created projects', async () => {
      const organizationA = organizationAFactory();

      const newProject = await repository.create({
        organizationId: organizationA.id,
        name: 'New Project',
        defaultHosts: [],
      });

      const projects = await query.findByOrganizationId(organizationA.id);

      expect(projects.some((p) => p.id === newProject.id)).toBe(true);
    });

    it('does not include deleted projects', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      await repository.delete(project);

      const projects = await query.findByOrganizationId(organizationA.id);

      expect(projects.some((p) => p.id === project.id)).toBe(false);
    });
  });
});
