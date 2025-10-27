import { describe, it, expect, beforeEach } from 'vitest';
import { DomainDatabase } from '@aired/domain-database';
import {
  defaultAggregateSetFactory,
  organizationAFactory,
  organizationBFactory,
  projectAFactory,
  projectBFactory,
  documentSimpleFactory,
  documentComplexFactory,
} from '@aired/domain-fakes';
import {
  createDocumentId,
  createLanguageCode,
  createEmptyDocumentTranscript,
  Document,
} from '@aired/domain';
import FakeDocumentRepository from './fake-document-repository.js';

describe('FakeDocumentRepository', () => {
  let db: DomainDatabase;
  let repository: FakeDocumentRepository;

  beforeEach(() => {
    db = new DomainDatabase(defaultAggregateSetFactory());
    repository = new FakeDocumentRepository(db);
  });

  describe('create', () => {
    it('creates a new document and returns the document', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      });

      expect(document).toBeDefined();
      expect(document.id).toBeDefined();
      expect(document.organizationId).toBe(organizationA.id);
      expect(document.projectId).toBe(projectA.id);
      expect(document.title).toBe('Test Document');
    });

    it('inserts the document into the database', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      });

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found).toBeDefined();
      expect(found?.title).toBe('Test Document');
    });

    it('creates documents with unique ids', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const doc1 = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Document 1',
        transcript: createEmptyDocumentTranscript(),
      });
      const doc2 = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Document 2',
        transcript: createEmptyDocumentTranscript(),
      });

      expect(doc1.id).not.toBe(doc2.id);
    });

    it('emits create event when document is created', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const eventPromise = new Promise<Document>((resolve) => {
        repository.addEventListener('create', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      const document = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      });
      const emittedDocument = await eventPromise;

      expect(emittedDocument).toBe(document);
      expect(emittedDocument.title).toBe('Test Document');
    });
  });

  describe('update', () => {
    it('updates an existing document', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'Updated Title',
        document.transcript,
      );
      await repository.update(updated);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found?.title).toBe('Updated Title');
    });

    it('does not throw when updating a document', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'New Title',
        document.transcript,
      );
      await expect(repository.update(updated)).resolves.toBeUndefined();
    });

    it('emits update event when document is updated', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);
      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'Updated Title',
        document.transcript,
      );

      const eventPromise = new Promise<Document>((resolve) => {
        repository.addEventListener('update', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.update(updated);
      const emittedDocument = await eventPromise;

      expect(emittedDocument).toBe(updated);
      expect(emittedDocument.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('removes a document from the database', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      await repository.delete(document);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found).toBeUndefined();
    });

    it('does not throw when deleting a document', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      await expect(repository.delete(document)).resolves.toBeUndefined();
    });

    it('handles deleting non-existent document gracefully', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const nonExistentDocument = new Document(
        createDocumentId(crypto.randomUUID()),
        organizationA.id,
        projectA.id,
        createLanguageCode('en'),
        'Non-existent',
        createEmptyDocumentTranscript(),
      );

      await expect(
        repository.delete(nonExistentDocument),
      ).resolves.toBeUndefined();
    });

    it('emits delete event when document is deleted', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const eventPromise = new Promise<Document>((resolve) => {
        repository.addEventListener('delete', (event) => {
          resolve(event.detail.aggregate);
        });
      });

      await repository.delete(document);
      const emittedDocument = await eventPromise;

      expect(emittedDocument).toBe(document);
      expect(emittedDocument.id).toBe(document.id);
    });
  });

  describe('find', () => {
    it('finds a document by id, projectId and organizationId', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );

      expect(found).toBeDefined();
      expect(found?.id).toBe(document.id);
      expect(found?.projectId).toBe(projectA.id);
      expect(found?.organizationId).toBe(organizationA.id);
      expect(found?.title).toBe(document.title);
    });

    it('returns undefined when document does not exist', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const nonExistentId = createDocumentId(crypto.randomUUID());

      const found = await repository.find(
        nonExistentId,
        projectA.id,
        organizationA.id,
      );

      expect(found).toBeUndefined();
    });

    it('returns undefined when projectId does not match', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const found = await repository.find(
        document.id,
        projectB.id,
        organizationA.id,
      );

      expect(found).toBeUndefined();
    });

    it('returns undefined when organizationId does not match', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationB.id,
      );

      expect(found).toBeUndefined();
    });

    it('finds the correct document when multiple exist', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationA);
      const docSimple = documentSimpleFactory(projectA);
      const docComplex = documentComplexFactory(projectB);

      const foundSimple = await repository.find(
        docSimple.id,
        projectA.id,
        organizationA.id,
      );
      const foundComplex = await repository.find(
        docComplex.id,
        projectB.id,
        organizationA.id,
      );

      expect(foundSimple?.id).toBe(docSimple.id);
      expect(foundSimple?.title).toBe('Simple Document');
      expect(foundComplex?.id).toBe(docComplex.id);
      expect(foundComplex?.title).toBe('Complex Document');
    });

    it('finds documents from pre-populated database', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );

      expect(found).toBeDefined();
      expect(found?.id).toBe(document.id);
    });
  });

  describe('findByOrganizationId', () => {
    it('finds all documents for an organization', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const documents = await repository.findByOrganizationId(organizationA.id);

      expect(documents.length).toBeGreaterThan(0);
      expect(documents.some((d) => d.id === document.id)).toBe(true);
      expect(
        documents.every((d) => d.organizationId === organizationA.id),
      ).toBe(true);
    });

    it('returns empty array when no documents exist for organization', async () => {
      const organizationA = organizationAFactory();
      const allDocuments = await repository.findByOrganizationId(
        organizationA.id,
      );

      for (const doc of allDocuments) {
        await repository.delete(doc);
      }

      const found = await repository.findByOrganizationId(organizationA.id);

      expect(found).toEqual([]);
    });

    it('only returns documents for specified organization', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();

      const documentsA = await repository.findByOrganizationId(
        organizationA.id,
      );
      const documentsB = await repository.findByOrganizationId(
        organizationB.id,
      );

      expect(
        documentsA.every((d) => d.organizationId === organizationA.id),
      ).toBe(true);
      expect(
        documentsB.every((d) => d.organizationId === organizationB.id),
      ).toBe(true);
      expect(
        documentsA.some((d) => d.organizationId === organizationB.id),
      ).toBe(false);
      expect(
        documentsB.some((d) => d.organizationId === organizationA.id),
      ).toBe(false);
    });

    it('includes newly created documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const newDocument = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'New Document',
        transcript: createEmptyDocumentTranscript(),
      });

      const documents = await repository.findByOrganizationId(organizationA.id);

      expect(documents.some((d) => d.id === newDocument.id)).toBe(true);
    });

    it('does not include deleted documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      await repository.delete(document);

      const documents = await repository.findByOrganizationId(organizationA.id);

      expect(documents.some((d) => d.id === document.id)).toBe(false);
    });
  });

  describe('findByProjectId', () => {
    it('finds all documents for a project', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const documents = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );

      expect(documents.length).toBeGreaterThan(0);
      expect(documents.some((d) => d.id === document.id)).toBe(true);
      expect(documents.every((d) => d.projectId === projectA.id)).toBe(true);
      expect(
        documents.every((d) => d.organizationId === organizationA.id),
      ).toBe(true);
    });

    it('returns empty array when no documents exist for project', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const allDocuments = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );

      for (const doc of allDocuments) {
        await repository.delete(doc);
      }

      const found = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );

      expect(found).toEqual([]);
    });

    it('only returns documents for specified project', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const projectB = projectBFactory(organizationA);

      const documentsA = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );
      const documentsB = await repository.findByProjectId(
        projectB.id,
        organizationA.id,
      );

      expect(documentsA.every((d) => d.projectId === projectA.id)).toBe(true);
      expect(documentsB.every((d) => d.projectId === projectB.id)).toBe(true);
      expect(documentsA.some((d) => d.projectId === projectB.id)).toBe(false);
      expect(documentsB.some((d) => d.projectId === projectA.id)).toBe(false);
    });

    it('requires matching organizationId', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const projectA = projectAFactory(organizationA);

      const documentsWrongOrg = await repository.findByProjectId(
        projectA.id,
        organizationB.id,
      );

      expect(documentsWrongOrg).toEqual([]);
    });

    it('includes newly created documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);

      const newDocument = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'New Document',
        transcript: createEmptyDocumentTranscript(),
      });

      const documents = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );

      expect(documents.some((d) => d.id === newDocument.id)).toBe(true);
    });

    it('does not include deleted documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      await repository.delete(document);

      const documents = await repository.findByProjectId(
        projectA.id,
        organizationA.id,
      );

      expect(documents.some((d) => d.id === document.id)).toBe(false);
    });
  });

  describe('integration scenarios', () => {
    it('supports create, find, update, and delete workflow', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Workflow Test',
        transcript: createEmptyDocumentTranscript(),
      });
      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found?.title).toBe('Workflow Test');

      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'Updated Workflow',
        document.transcript,
      );
      await repository.update(updated);
      const foundAfterUpdate = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(foundAfterUpdate?.title).toBe('Updated Workflow');

      await repository.delete(updated);
      const foundAfterDelete = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(foundAfterDelete).toBeUndefined();
    });

    it('works with pre-populated database from defaultAggregateSetFactory', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found).toBeDefined();
      expect(found?.title).toBe('Simple Document');

      const newDocument = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'New Document',
        transcript: createEmptyDocumentTranscript(),
      });
      const foundNew = await repository.find(
        newDocument.id,
        projectA.id,
        organizationA.id,
      );
      expect(foundNew).toBeDefined();
      expect(foundNew?.title).toBe('New Document');
    });

    it('updates pre-populated documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'Modified Simple Document',
        document.transcript,
      );
      await repository.update(updated);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found?.title).toBe('Modified Simple Document');
    });

    it('deletes pre-populated documents', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const document = documentSimpleFactory(projectA);

      await repository.delete(document);

      const found = await repository.find(
        document.id,
        projectA.id,
        organizationA.id,
      );
      expect(found).toBeUndefined();
    });

    it('emits events for full workflow', async () => {
      const organizationA = organizationAFactory();
      const projectA = projectAFactory(organizationA);
      const events: string[] = [];

      repository.addEventListener('create', () => events.push('create'));
      repository.addEventListener('update', () => events.push('update'));
      repository.addEventListener('delete', () => events.push('delete'));

      const document = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Event Test',
        transcript: createEmptyDocumentTranscript(),
      });
      const updated = new Document(
        document.id,
        document.organizationId,
        document.projectId,
        document.language,
        'Updated Event',
        document.transcript,
      );
      await repository.update(updated);
      await repository.delete(updated);

      expect(events).toEqual(['create', 'update', 'delete']);
    });

    it('isolates documents by projectId and organizationId', async () => {
      const organizationA = organizationAFactory();
      const organizationB = organizationBFactory();
      const projectA = projectAFactory(organizationA);

      const documentForOrgA = await repository.create({
        organizationId: organizationA.id,
        projectId: projectA.id,
        language: createLanguageCode('en'),
        title: 'Org A Document',
        transcript: createEmptyDocumentTranscript(),
      });

      const foundInOrgA = await repository.find(
        documentForOrgA.id,
        projectA.id,
        organizationA.id,
      );
      expect(foundInOrgA).toBeDefined();

      const foundInOrgB = await repository.find(
        documentForOrgA.id,
        projectA.id,
        organizationB.id,
      );
      expect(foundInOrgB).toBeUndefined();
    });
  });
});
