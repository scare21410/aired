import { describe, it, expect, beforeEach } from 'vitest';
import { DomainDatabase } from '@aired/domain-database';
import {
  defaultAggregateSetFactory,
  organizationAFactory,
  organizationBFactory,
  projectAFactory,
  projectBFactory,
} from '@aired/domain-fakes';
import { createProjectId, Project } from '@aired/domain';
import FakeProjectRepository from './fake-project-repository';

describe('FakeProjectRepository', () => {
  let db: DomainDatabase;
  let repository: FakeProjectRepository;

  beforeEach(() => {
    db = new DomainDatabase(defaultAggregateSetFactory());
    repository = new FakeProjectRepository(db);
  });

  describe('create', () => {
    it('should create a new project and return the project', async () => {
      const organizationA = organizationAFactory();
      const project = await repository.create({
        organizationId: organizationA.id,
        name: 'Test Project',
      });

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.organizationId).toBe(organizationA.id);
      expect(project.name).toBe('Test Project');
    });

    it('should insert the project into the database', async () => {
      const organizationA = organizationAFactory();
      const project = await repository.create({
        organizationId: organizationA.id,
        name: 'Test Project',
      });

      const found = await repository.find(project.id, organizationA.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Project');
    });

    it('should create projects with unique ids', async () => {
      const organizationA = organizationAFactory();
      const project1 = await repository.create({
        organizationId: organizationA.id,
        name: 'Project 1',
      });
      const project2 = await repository.create({
        organizationId: organizationA.id,
        name: 'Project 2',
      });

      expect(project1.id).not.toBe(project2.id);
    });

    it('should emit create event when project is created', async () => {
      const organizationA = organizationAFactory();
      const eventPromise = new Promise<Project>((resolve) => {
        repository.addEventListener('create', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      const project = await repository.create({
        organizationId: organizationA.id,
        name: 'Test Project',
      });
      const emittedProject = await eventPromise;

      expect(emittedProject).toBe(project);
      expect(emittedProject.name).toBe('Test Project');
    });
  });

  describe('update', () => {
    it('should update an existing project', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      const updated = new Project(
        project.id,
        project.organizationId,
        'Updated Name',
      );
      await repository.update(updated);

      const found = await repository.find(project.id, organizationA.id);
      expect(found?.name).toBe('Updated Name');
    });

    it('should not throw when updating a project', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      const updated = new Project(
        project.id,
        project.organizationId,
        'New Name',
      );
      await expect(repository.update(updated)).resolves.toBeUndefined();
    });

    it('should emit update event when project is updated', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);
      const updated = new Project(
        project.id,
        project.organizationId,
        'Updated Name',
      );

      const eventPromise = new Promise<Project>((resolve) => {
        repository.addEventListener('update', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.update(updated);
      const emittedProject = await eventPromise;

      expect(emittedProject).toBe(updated);
      expect(emittedProject.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should remove a project from the database', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      await repository.delete(project);

      const found = await repository.find(project.id, organizationA.id);
      expect(found).toBeUndefined();
    });

    it('should not throw when deleting a project', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      await expect(repository.delete(project)).resolves.toBeUndefined();
    });

    it('should handle deleting non-existent project gracefully', async () => {
      const organizationA = organizationAFactory();
      const nonExistentProject = new Project(
        createProjectId(crypto.randomUUID()),
        organizationA.id,
        'Non-existent',
      );

      await expect(
        repository.delete(nonExistentProject),
      ).resolves.toBeUndefined();
    });

    it('should emit delete event when project is deleted', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      const eventPromise = new Promise<Project>((resolve) => {
        repository.addEventListener('delete', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.delete(project);
      const emittedProject = await eventPromise;

      expect(emittedProject).toBe(project);
      expect(emittedProject.id).toBe(project.id);
    });
  });

  describe('find', () => {
    it('should find a project by id and organizationId', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      const found = await repository.find(project.id, organizationA.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(project.id);
      expect(found?.organizationId).toBe(organizationA.id);
      expect(found?.name).toBe(project.name);
    });

    it('should return undefined when project does not exist', async () => {
      const organizationA = organizationAFactory();
      const nonExistentId = createProjectId(crypto.randomUUID());

      const found = await repository.find(nonExistentId, organizationA.id);

      expect(found).toBeUndefined();
    });

    it('should return undefined when organizationId does not match', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const project = projectAFactory(organizationA);

      const found = await repository.find(project.id, organizationB.id);

      expect(found).toBeUndefined();
    });

    it('should find the correct project when multiple exist', async () => {
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

    it('should find projects from pre-populated database', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const found = await repository.find(projectA.id, organizationA.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(projectA.id);
    });
  });

  describe('findByOrganizationId', () => {
    it('should find all projects for an organization', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const projects = await repository.findByOrganizationId(organizationA.id);

      expect(projects.length).toBeGreaterThan(0);
      expect(projects.some((p) => p.id === projectA.id)).toBe(true);
      expect(projects.every((p) => p.organizationId === organizationA.id)).toBe(
        true,
      );
    });

    it('should return empty array when no projects exist for organization', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationA);
      await repository.delete(projectA);
      await repository.delete(projectB);

      const projects = await repository.findByOrganizationId(organizationA.id);

      expect(projects).toEqual([]);
    });

    it('should only return projects for specified organization', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();

      const projectsA = await repository.findByOrganizationId(organizationA.id);
      const projectsB = await repository.findByOrganizationId(organizationB.id);

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

    it('should include newly created projects', async () => {
      const organizationA = organizationAFactory();

      const newProject = await repository.create({
        organizationId: organizationA.id,
        name: 'New Project',
      });

      const projects = await repository.findByOrganizationId(organizationA.id);

      expect(projects.some((p) => p.id === newProject.id)).toBe(true);
    });

    it('should not include deleted projects', async () => {
      const organizationA = organizationAFactory();
      const project = projectAFactory(organizationA);

      await repository.delete(project);

      const projects = await repository.findByOrganizationId(organizationA.id);

      expect(projects.some((p) => p.id === project.id)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('should support create, find, update, and delete workflow', async () => {
      const organizationA = organizationAFactory();
      const project = await repository.create({
        organizationId: organizationA.id,
        name: 'Workflow Test',
      });
      const found = await repository.find(project.id, organizationA.id);
      expect(found?.name).toBe('Workflow Test');

      const updated = new Project(
        project.id,
        project.organizationId,
        'Updated Workflow',
      );
      await repository.update(updated);
      const foundAfterUpdate = await repository.find(
        project.id,
        organizationA.id,
      );
      expect(foundAfterUpdate?.name).toBe('Updated Workflow');

      await repository.delete(updated);
      const foundAfterDelete = await repository.find(
        project.id,
        organizationA.id,
      );
      expect(foundAfterDelete).toBeUndefined();
    });

    it('should work with pre-populated database from defaultAggregateSetFactory', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationB);

      const foundA = await repository.find(projectA.id, organizationA.id);
      expect(foundA).toBeDefined();
      expect(foundA?.name).toBe('Project A');

      const foundB = await repository.find(projectB.id, organizationB.id);
      expect(foundB).toBeDefined();
      expect(foundB?.name).toBe('Project B');

      const newProject = await repository.create({
        organizationId: organizationA.id,
        name: 'New Project',
      });
      const foundNew = await repository.find(newProject.id, organizationA.id);
      expect(foundNew).toBeDefined();
      expect(foundNew?.name).toBe('New Project');
    });

    it('should update pre-populated projects', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const updated = new Project(
        projectA.id,
        projectA.organizationId,
        'Modified Project A',
      );
      await repository.update(updated);

      const found = await repository.find(projectA.id, organizationA.id);
      expect(found?.name).toBe('Modified Project A');
    });

    it('should delete pre-populated projects', async () => {
      const organizationB = organizationBFactory();
      const projectB = projectBFactory(organizationB);

      await repository.delete(projectB);

      const found = await repository.find(projectB.id, organizationB.id);
      expect(found).toBeUndefined();
    });

    it('should emit events for full workflow', async () => {
      const organizationA = organizationAFactory();
      const events: string[] = [];

      repository.addEventListener('create', () => events.push('create'));
      repository.addEventListener('update', () => events.push('update'));
      repository.addEventListener('delete', () => events.push('delete'));

      const project = await repository.create({
        organizationId: organizationA.id,
        name: 'Event Test',
      });
      const updated = new Project(
        project.id,
        project.organizationId,
        'Updated Event',
      );
      await repository.update(updated);
      await repository.delete(updated);

      expect(events).toEqual(['create', 'update', 'delete']);
    });

    it('should isolate projects by organizationId', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();

      const projectForOrgA = await repository.create({
        organizationId: organizationA.id,
        name: 'Org A Project',
      });

      const foundInOrgA = await repository.find(
        projectForOrgA.id,
        organizationA.id,
      );
      expect(foundInOrgA).toBeDefined();

      const foundInOrgB = await repository.find(
        projectForOrgA.id,
        organizationB.id,
      );
      expect(foundInOrgB).toBeUndefined();
    });
  });
});
