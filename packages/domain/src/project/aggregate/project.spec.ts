import { describe, it, expect } from 'vitest';
import Project from './project';
import { createProjectId } from '../value/project-id';
import { createOrganizationId } from '../../organization/value/organization-id';

describe('Project', () => {
  describe('from', () => {
    it('should create Project from valid data', () => {
      const data = {
        id: createProjectId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        name: 'Test Project',
      };

      const project = Project.from(data);

      expect(project).toBeInstanceOf(Project);
      expect(project.id).toBe(data.id);
      expect(project.organizationId).toBe(data.organizationId);
      expect(project.name).toBe(data.name);
    });

    it('should throw error for invalid project UUID', () => {
      const data = {
        id: 'invalid-uuid',
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        name: 'Test Project',
      };

      expect(() => Project.from(data)).toThrow();
    });

    it('should throw error for invalid organization UUID', () => {
      const data = {
        id: createProjectId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: 'invalid-uuid',
        name: 'Test Project',
      };

      expect(() => Project.from(data)).toThrow();
    });

    it('should throw error for missing name', () => {
      const data = {
        id: createProjectId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
      };

      expect(() => Project.from(data)).toThrow();
    });
  });

  describe('clone', () => {
    it('should create a new Project instance with same values', () => {
      const original = new Project(
        createProjectId('123e4567-e89b-12d3-a456-426614174000'),
        createOrganizationId('223e4567-e89b-12d3-a456-426614174001'),
        'Test Project',
      );

      const cloned = Project.clone(original);

      expect(cloned).toBeInstanceOf(Project);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
    });
  });
});
