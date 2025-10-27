import { describe, it, expect } from 'vitest';
import { createOrganizationId } from '../value/organization-id.js';
import Organization from './organization.js';

describe('Organization', () => {
  describe('from', () => {
    it('should create Organization from valid data', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Organization',
      };

      const organization = Organization.from(data);

      expect(organization).toBeInstanceOf(Organization);
      expect(organization.id).toBe(data.id);
      expect(organization.name).toBe(data.name);
    });

    it('should throw error for invalid UUID', () => {
      const data = {
        id: 'invalid-uuid',
        name: 'Test Organization',
      };

      expect(() => Organization.from(data)).toThrow();
    });

    it('should throw error for missing name', () => {
      const data = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      expect(() => Organization.from(data)).toThrow();
    });
  });

  describe('clone', () => {
    it('should create a new Organization instance with same values', () => {
      const original = new Organization(
        createOrganizationId('123e4567-e89b-12d3-a456-426614174000'),
        'Test Organization',
      );

      const cloned = Organization.clone(original);

      expect(cloned).toBeInstanceOf(Organization);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
    });
  });
});
