import { z } from 'zod';

export const DocumentIdSchema = z.uuid().brand(Symbol('DocumentId'));

export type DocumentId = z.infer<typeof DocumentIdSchema>;

export function createDocumentId(id: string): DocumentId {
  return DocumentIdSchema.parse(id);
}
