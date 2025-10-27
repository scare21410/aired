import { z } from 'zod';
import { OrganizationIdSchema } from '../../organization/value/organization-id.js';
import { ProjectIdSchema } from '../../project/value/project-id.js';
import { LanguageCodeSchema } from '../../i18n/value/language-code.js';
import { DocumentIdSchema } from '../value/document-id.js';
import { DocumentTranscriptSchema } from '../value/document-transcript.js';

export const DocumentSchema = z.object({
  id: DocumentIdSchema,
  organizationId: OrganizationIdSchema,
  projectId: ProjectIdSchema,
  language: LanguageCodeSchema,
  title: z.string(),
  transcript: DocumentTranscriptSchema,
});

export type DocumentType = z.infer<typeof DocumentSchema>;

export default class Document implements DocumentType {
  public readonly id: DocumentType['id'];
  public readonly organizationId: DocumentType['organizationId'];
  public readonly projectId: DocumentType['projectId'];
  public readonly language: DocumentType['language'];
  public readonly title: DocumentType['title'];
  public readonly transcript: DocumentType['transcript'];

  constructor(
    id: DocumentType['id'],
    organizationId: DocumentType['organizationId'],
    projectId: DocumentType['projectId'],
    language: DocumentType['language'],
    title: DocumentType['title'],
    transcript: DocumentType['transcript'],
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.projectId = projectId;
    this.language = language;
    this.title = title;
    this.transcript = transcript;
  }

  static clone(other: Document) {
    return new Document(
      other.id,
      other.organizationId,
      other.projectId,
      other.language,
      other.title,
      other.transcript,
    );
  }

  static from(other: unknown): Document {
    return Document.clone(DocumentSchema.parse(other));
  }
}

export const DocumentCreateSchema = DocumentSchema.omit({ id: true });
export type DocumentCreateType = z.infer<typeof DocumentCreateSchema>;
