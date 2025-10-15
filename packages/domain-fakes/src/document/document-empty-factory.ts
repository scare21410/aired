import { v5 } from 'uuid';
import {
  createDocumentId,
  createLanguageCode,
  createEmptyDocumentTranscript,
  Document,
  type Project,
} from '@aired/domain';

export default function documentEmptyFactory(project: Project) {
  const id = v5('empty-document', project.id);
  return new Document(
    createDocumentId(id),
    project.organizationId,
    project.id,
    createLanguageCode('en'),
    'Empty Document',
    createEmptyDocumentTranscript(),
  );
}
