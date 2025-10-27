import { describe, it, expect } from 'vitest';
import { createMemberId } from '../value/member-id.js';
import { createOrganizationId } from '../value/organization-id.js';
import { createUserId } from '../../user/value/user-id.js';
import { createProjectId } from '../../project/value/project-id.js';
import { createPermission } from '../value/permission.js';
import Member from './member.js';

describe('Member', () => {
  describe('from', () => {
    it('creates Member from valid data with projects', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('admin'),
          },
          {
            id: createProjectId('523e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('read'),
          },
        ],
      };

      const member = Member.from(data);

      expect(member).toBeInstanceOf(Member);
      expect(member.id).toBe(data.id);
      expect(member.organizationId).toBe(data.organizationId);
      expect(member.userId).toBe(data.userId);
      expect(member.projects).toEqual(data.projects);
      expect(member.projects).toHaveLength(2);
    });

    it('creates Member with empty projects array', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [],
      };

      const member = Member.from(data);

      expect(member).toBeInstanceOf(Member);
      expect(member.projects).toEqual([]);
      expect(member.projects).toHaveLength(0);
    });

    it('throws error for invalid member UUID', () => {
      const data = {
        id: 'invalid-uuid',
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [],
      };

      expect(() => Member.from(data)).toThrow();
    });

    it('throws error for invalid organization UUID', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: 'invalid-uuid',
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [],
      };

      expect(() => Member.from(data)).toThrow();
    });

    it('throws error for invalid user UUID', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: 'invalid-uuid',
        projects: [],
      };

      expect(() => Member.from(data)).toThrow();
    });

    it('throws error for invalid project UUID', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: 'invalid-uuid',
            permission: createPermission('admin'),
          },
        ],
      };

      expect(() => Member.from(data)).toThrow();
    });

    it('throws error for invalid permission', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: 'invalid-permission',
          },
        ],
      };

      expect(() => Member.from(data)).toThrow();
    });
  });

  describe('clone', () => {
    it('creates a new Member instance with same values', () => {
      const original = new Member(
        createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        createOrganizationId('223e4567-e89b-12d3-a456-426614174000'),
        createUserId('323e4567-e89b-12d3-a456-426614174000'),
        [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('admin'),
          },
        ],
      );

      const cloned = Member.clone(original);

      expect(cloned).toBeInstanceOf(Member);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
    });

    it('creates a new Member instance with empty projects', () => {
      const original = new Member(
        createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        createOrganizationId('223e4567-e89b-12d3-a456-426614174000'),
        createUserId('323e4567-e89b-12d3-a456-426614174000'),
        [],
      );

      const cloned = Member.clone(original);

      expect(cloned).toBeInstanceOf(Member);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
      expect(cloned.projects).toHaveLength(0);
    });
  });

  describe('permissions', () => {
    it('creates Member with admin permission', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('admin'),
          },
        ],
      };

      const member = Member.from(data);

      expect(member.projects[0].permission).toBe('admin');
    });

    it('creates Member with read permission', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('read'),
          },
        ],
      };

      const member = Member.from(data);

      expect(member.projects[0].permission).toBe('read');
    });

    it('creates Member with write permission', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('write'),
          },
        ],
      };

      const member = Member.from(data);

      expect(member.projects[0].permission).toBe('write');
    });

    it('creates Member with multiple projects with different permissions', () => {
      const data = {
        id: createMemberId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174000',
        ),
        userId: createUserId('323e4567-e89b-12d3-a456-426614174000'),
        projects: [
          {
            id: createProjectId('423e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('admin'),
          },
          {
            id: createProjectId('523e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('write'),
          },
          {
            id: createProjectId('623e4567-e89b-12d3-a456-426614174000'),
            permission: createPermission('read'),
          },
        ],
      };

      const member = Member.from(data);

      expect(member.projects).toHaveLength(3);
      expect(member.projects[0].permission).toBe('admin');
      expect(member.projects[1].permission).toBe('write');
      expect(member.projects[2].permission).toBe('read');
    });
  });
});
