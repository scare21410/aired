import { describe, it, expect } from 'vitest';
import { createUserId } from '../value/user-id.js';
import User from './user.js';

describe('User', () => {
  describe('from', () => {
    it('creates User from valid data with all fields', () => {
      const data = {
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        username: 'john.doe',
        email: 'john.doe@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        phoneNumberVerified: true,
        status: 'CONFIRMED' as const,
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        givenName: 'John',
        familyName: 'Doe',
      };

      const user = User.from(data);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(data.id);
      expect(user.username).toBe(data.username);
      expect(user.email).toBe(data.email);
      expect(user.emailVerified).toBe(data.emailVerified);
      expect(user.phoneNumber).toBe(data.phoneNumber);
      expect(user.phoneNumberVerified).toBe(data.phoneNumberVerified);
      expect(user.status).toBe(data.status);
      expect(user.enabled).toBe(data.enabled);
      expect(user.createdAt).toEqual(data.createdAt);
      expect(user.updatedAt).toEqual(data.updatedAt);
      expect(user.givenName).toBe(data.givenName);
      expect(user.familyName).toBe(data.familyName);
    });

    it('creates User from valid data with minimal required fields', () => {
      const data = {
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        emailVerified: false,
        status: 'UNCONFIRMED' as const,
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      const user = User.from(data);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(data.id);
      expect(user.username).toBe(data.username);
      expect(user.email).toBe(data.email);
      expect(user.emailVerified).toBe(data.emailVerified);
      expect(user.phoneNumber).toBeUndefined();
      expect(user.phoneNumberVerified).toBeUndefined();
      expect(user.status).toBe(data.status);
      expect(user.enabled).toBe(data.enabled);
      expect(user.givenName).toBeUndefined();
      expect(user.familyName).toBeUndefined();
    });

    it('throws error for invalid user UUID', () => {
      const data = {
        id: 'invalid-uuid',
        username: 'john.doe',
        email: 'john.doe@example.com',
        emailVerified: true,
        status: 'CONFIRMED',
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      expect(() => User.from(data)).toThrow();
    });

    it('throws error for invalid email format', () => {
      const data = {
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        username: 'john.doe',
        email: 'invalid-email',
        emailVerified: true,
        status: 'CONFIRMED',
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      expect(() => User.from(data)).toThrow();
    });

    it('throws error for invalid status', () => {
      const data = {
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        username: 'john.doe',
        email: 'john.doe@example.com',
        emailVerified: true,
        status: 'INVALID_STATUS',
        enabled: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      expect(() => User.from(data)).toThrow();
    });
  });

  describe('clone', () => {
    it('creates a new User instance with same values', () => {
      const original = new User(
        createUserId('123e4567-e89b-12d3-a456-426614174000'),
        'john.doe',
        'john.doe@example.com',
        true,
        '+1234567890',
        true,
        'CONFIRMED',
        true,
        new Date('2024-01-01'),
        new Date('2024-01-02'),
        'John',
        'Doe',
        undefined,
      );

      const cloned = User.clone(original);

      expect(cloned).toBeInstanceOf(User);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
    });

    it('creates a new User instance with optional fields undefined', () => {
      const original = new User(
        createUserId('123e4567-e89b-12d3-a456-426614174000'),
        'jane.smith',
        'jane.smith@example.com',
        false,
        undefined,
        undefined,
        'UNCONFIRMED',
        true,
        new Date('2024-01-01'),
        new Date('2024-01-01'),
        undefined,
        undefined,
        undefined,
      );

      const cloned = User.clone(original);

      expect(cloned).toBeInstanceOf(User);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
      expect(cloned.phoneNumber).toBeUndefined();
      expect(cloned.phoneNumberVerified).toBeUndefined();
      expect(cloned.givenName).toBeUndefined();
      expect(cloned.familyName).toBeUndefined();
    });
  });

  describe('UserCreateSchema', () => {
    it('validates user creation with only username', () => {
      const data = {
        username: 'john.doe',
      };

      const result = User.from({
        ...data,
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        email: 'john@example.com',
        emailVerified: false,
        status: 'FORCE_CHANGE_PASSWORD',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(result.username).toBe(data.username);
    });

    it('validates user creation with username and email', () => {
      const data = {
        username: 'john.doe',
        email: 'john.doe@example.com',
      };

      const result = User.from({
        ...data,
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        emailVerified: false,
        status: 'FORCE_CHANGE_PASSWORD',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(result.username).toBe(data.username);
      expect(result.email).toBe(data.email);
    });

    it('validates user creation with all optional fields', () => {
      const data = {
        username: 'john.doe',
        email: 'john.doe@example.com',
        emailVerified: true,
        phoneNumber: '+1234567890',
        phoneNumberVerified: true,
        givenName: 'John',
        familyName: 'Doe',
      };

      const result = User.from({
        ...data,
        id: createUserId('123e4567-e89b-12d3-a456-426614174000'),
        status: 'CONFIRMED',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(result.username).toBe(data.username);
      expect(result.email).toBe(data.email);
      expect(result.emailVerified).toBe(data.emailVerified);
      expect(result.phoneNumber).toBe(data.phoneNumber);
      expect(result.phoneNumberVerified).toBe(data.phoneNumberVerified);
      expect(result.givenName).toBe(data.givenName);
      expect(result.familyName).toBe(data.familyName);
    });
  });
});
