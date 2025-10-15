import { describe, it, expect } from 'vitest';
import Document from './document';
import { createDocumentId } from '../value/document-id';
import { createOrganizationId } from '../../organization/value/organization-id';
import { createProjectId } from '../../project/value/project-id';
import { createLanguageCode } from '../../i18n/value/language-code';
import { createEmptyDocumentTranscript } from '../value/document-transcript';

describe('Document', () => {
  describe('from', () => {
    it('should create Document from valid data', () => {
      const data = {
        id: createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        projectId: createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      };

      const document = Document.from(data);

      expect(document).toBeInstanceOf(Document);
      expect(document.id).toBe(data.id);
      expect(document.organizationId).toBe(data.organizationId);
      expect(document.projectId).toBe(data.projectId);
      expect(document.language).toBe(data.language);
      expect(document.title).toBe(data.title);
      expect(document.transcript).toBe(data.transcript);
    });

    it('should throw error for invalid document UUID', () => {
      const data = {
        id: 'invalid-uuid',
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        projectId: createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      };

      expect(() => Document.from(data)).toThrow();
    });

    it('should throw error for invalid organization UUID', () => {
      const data = {
        id: createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: 'invalid-uuid',
        projectId: createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      };

      expect(() => Document.from(data)).toThrow();
    });

    it('should throw error for invalid project UUID', () => {
      const data = {
        id: createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        projectId: 'invalid-uuid',
        language: createLanguageCode('en'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      };

      expect(() => Document.from(data)).toThrow();
    });

    it('should throw error for missing title', () => {
      const data = {
        id: createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        projectId: createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        language: createLanguageCode('en'),
        transcript: createEmptyDocumentTranscript(),
      };

      expect(() => Document.from(data)).toThrow();
    });

    it('should throw error for missing language', () => {
      const data = {
        id: createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        organizationId: createOrganizationId(
          '223e4567-e89b-12d3-a456-426614174001',
        ),
        projectId: createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        title: 'Test Document',
        transcript: createEmptyDocumentTranscript(),
      };

      expect(() => Document.from(data)).toThrow();
    });
  });

  describe('clone', () => {
    it('should create a new Document instance with same values', () => {
      const original = new Document(
        createDocumentId('123e4567-e89b-12d3-a456-426614174000'),
        createOrganizationId('223e4567-e89b-12d3-a456-426614174001'),
        createProjectId('323e4567-e89b-12d3-a456-426614174002'),
        createLanguageCode('en'),
        'Test Document',
        createEmptyDocumentTranscript(),
      );

      const cloned = Document.clone(original);

      expect(cloned).toBeInstanceOf(Document);
      expect(cloned).not.toBe(original);
      expect(cloned).toEqual(original);
    });
  });
});
