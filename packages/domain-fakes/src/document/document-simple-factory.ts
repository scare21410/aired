import { v5 } from 'uuid';
import {
  createDocumentId,
  createLanguageCode,
  createDocumentTranscript,
  Document,
  type Project,
} from '@aired/domain';

export default function documentSimpleFactory(project: Project) {
  const id = v5('simple-document', project.id);
  return new Document(
    createDocumentId(id),
    project.organizationId,
    project.id,
    createLanguageCode('en'),
    'Simple Document',
    createDocumentTranscript({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a simple paragraph with plain text.',
            },
          ],
        },
      ],
    }),
  );
}
