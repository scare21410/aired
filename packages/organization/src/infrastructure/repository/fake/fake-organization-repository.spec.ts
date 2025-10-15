import { describe, it, expect, beforeEach } from 'vitest';
import { DomainDatabase } from '@aired/domain-database';
import {
  defaultAggregateSetFactory,
  organizationAFactory,
  organizationBFactory,
} from '@aired/domain-fakes';
import { createOrganizationId, Organization } from '@aired/domain';
import FakeOrganizationRepository from './fake-organization-repository';

describe('FakeOrganizationRepository', () => {
  let db: DomainDatabase;
  let repository: FakeOrganizationRepository;

  beforeEach(() => {
    db = new DomainDatabase(defaultAggregateSetFactory());
    repository = new FakeOrganizationRepository(db);
  });

  describe('create', () => {
    it('should create a new organization and return the organization', async () => {
      const organization = await repository.create({
        name: 'Test Organization',
      });

      expect(organization).toBeDefined();
      expect(organization.id).toBeDefined();
      expect(organization.name).toBe('Test Organization');
    });

    it('should insert the organization into the database', async () => {
      const organization = await repository.create({
        name: 'Test Organization',
      });

      const found = await repository.find(organization.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Organization');
    });

    it('should create organizations with unique ids', async () => {
      const org1 = await repository.create({ name: 'Organization 1' });
      const org2 = await repository.create({ name: 'Organization 2' });

      expect(org1.id).not.toBe(org2.id);
    });

    it('should emit create event when organization is created', async () => {
      const eventPromise = new Promise<Organization>((resolve) => {
        repository.addEventListener('create', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      const organization = await repository.create({
        name: 'Test Organization',
      });
      const emittedOrganization = await eventPromise;

      expect(emittedOrganization).toBe(organization);
      expect(emittedOrganization.name).toBe('Test Organization');
    });
  });

  describe('update', () => {
    it('should update an existing organization', async () => {
      const organization = organizationAFactory();

      const updated = new Organization(organization.id, 'Updated Name');
      await repository.update(updated);

      const found = await repository.find(organization.id);
      expect(found?.name).toBe('Updated Name');
    });

    it('should not throw when updating an organization', async () => {
      const organization = organizationAFactory();

      const updated = new Organization(organization.id, 'New Name');
      await expect(repository.update(updated)).resolves.toBeUndefined();
    });

    it('should emit update event when organization is updated', async () => {
      const organization = organizationAFactory();
      const updated = new Organization(organization.id, 'Updated Name');

      const eventPromise = new Promise<Organization>((resolve) => {
        repository.addEventListener('update', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.update(updated);
      const emittedOrganization = await eventPromise;

      expect(emittedOrganization).toBe(updated);
      expect(emittedOrganization.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should remove an organization from the database', async () => {
      const organization = organizationAFactory();

      await repository.delete(organization);

      const found = await repository.find(organization.id);
      expect(found).toBeUndefined();
    });

    it('should not throw when deleting an organization', async () => {
      const organization = organizationAFactory();

      await expect(repository.delete(organization)).resolves.toBeUndefined();
    });

    it('should handle deleting non-existent organization gracefully', async () => {
      const nonExistentOrg = new Organization(
        createOrganizationId(crypto.randomUUID()),
        'Non-existent',
      );

      await expect(repository.delete(nonExistentOrg)).resolves.toBeUndefined();
    });

    it('should emit delete event when organization is deleted', async () => {
      const organization = organizationAFactory();

      const eventPromise = new Promise<Organization>((resolve) => {
        repository.addEventListener('delete', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.delete(organization);
      const emittedOrganization = await eventPromise;

      expect(emittedOrganization).toBe(organization);
      expect(emittedOrganization.id).toBe(organization.id);
    });
  });

  describe('find', () => {
    it('should find an organization by id', async () => {
      const organization = organizationAFactory();

      const found = await repository.find(organization.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(organization.id);
      expect(found?.name).toBe(organization.name);
    });

    it('should return undefined when organization does not exist', async () => {
      const nonExistentId = createOrganizationId(crypto.randomUUID());

      const found = await repository.find(nonExistentId);

      expect(found).toBeUndefined();
    });

    it('should find the correct organization when multiple exist', async () => {
      const orgA = organizationAFactory();
      const orgB = organizationBFactory();

      const foundA = await repository.find(orgA.id);
      const foundB = await repository.find(orgB.id);

      expect(foundA?.id).toBe(orgA.id);
      expect(foundA?.name).toBe('Organization A');
      expect(foundB?.id).toBe(orgB.id);
      expect(foundB?.name).toBe('Organization B');
    });

    it('should find organizations from pre-populated database', async () => {
      const orgA = organizationAFactory();

      const found = await repository.find(orgA.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(orgA.id);
    });
  });

  describe('integration scenarios', () => {
    it('should support create, find, update, and delete workflow', async () => {
      const organization = await repository.create({ name: 'Workflow Test' });
      const found = await repository.find(organization.id);
      expect(found?.name).toBe('Workflow Test');

      const updated = new Organization(organization.id, 'Updated Workflow');
      await repository.update(updated);
      const foundAfterUpdate = await repository.find(organization.id);
      expect(foundAfterUpdate?.name).toBe('Updated Workflow');

      await repository.delete(updated);
      const foundAfterDelete = await repository.find(organization.id);
      expect(foundAfterDelete).toBeUndefined();
    });

    it('should work with pre-populated database from defaultAggregateSetFactory', async () => {
      const orgA = organizationAFactory();
      const orgB = organizationBFactory();

      const foundA = await repository.find(orgA.id);
      expect(foundA).toBeDefined();
      expect(foundA?.name).toBe('Organization A');

      const foundB = await repository.find(orgB.id);
      expect(foundB).toBeDefined();
      expect(foundB?.name).toBe('Organization B');

      const newOrganization = await repository.create({
        name: 'New Organization',
      });
      const foundNew = await repository.find(newOrganization.id);
      expect(foundNew).toBeDefined();
      expect(foundNew?.name).toBe('New Organization');
    });

    it('should update pre-populated organizations', async () => {
      const orgA = organizationAFactory();

      const updated = new Organization(orgA.id, 'Modified Organization A');
      await repository.update(updated);

      const found = await repository.find(orgA.id);
      expect(found?.name).toBe('Modified Organization A');
    });

    it('should delete pre-populated organizations', async () => {
      const orgB = organizationBFactory();

      await repository.delete(orgB);

      const found = await repository.find(orgB.id);
      expect(found).toBeUndefined();
    });

    it('should emit events for full workflow', async () => {
      const events: string[] = [];

      repository.addEventListener('create', () => events.push('create'));
      repository.addEventListener('update', () => events.push('update'));
      repository.addEventListener('delete', () => events.push('delete'));

      const organization = await repository.create({ name: 'Event Test' });
      const updated = new Organization(organization.id, 'Updated Event');
      await repository.update(updated);
      await repository.delete(updated);

      expect(events).toEqual(['create', 'update', 'delete']);
    });
  });
});
