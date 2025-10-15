import { v5 } from 'uuid';
import {
  createDocumentId,
  createLanguageCode,
  createDocumentTranscript,
  Document,
  type Project,
} from '@aired/domain';

export default function documentComplexFactory(project: Project) {
  const id = v5('complex-document', project.id);
  return new Document(
    createDocumentId(id),
    project.organizationId,
    project.id,
    createLanguageCode('en'),
    'Complex Document',
    createDocumentTranscript({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a ',
            },
            {
              type: 'text',
              text: 'bold',
              marks: [{ type: 'bold' }],
            },
            {
              type: 'text',
              text: ' and ',
            },
            {
              type: 'text',
              text: 'italic',
              marks: [{ type: 'italic' }],
            },
            {
              type: 'text',
              text: ' text with ',
            },
            {
              type: 'text',
              text: 'combined marks',
              marks: [
                { type: 'bold' },
                { type: 'italic' },
                { type: 'underline' },
              ],
            },
            {
              type: 'text',
              text: '.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Here is ',
            },
            {
              type: 'text',
              text: 'strikethrough',
              marks: [{ type: 'strike' }],
            },
            {
              type: 'text',
              text: ' and ',
            },
            {
              type: 'text',
              text: 'highlighted',
              marks: [{ type: 'highlight', attrs: { color: '#ffff00' } }],
            },
            {
              type: 'text',
              text: ' text.',
            },
          ],
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a blockquote with ',
                },
                {
                  type: 'text',
                  text: 'formatted',
                  marks: [{ type: 'bold' }],
                },
                {
                  type: 'text',
                  text: ' text inside.',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Multiple ',
            },
            {
              type: 'text',
              text: 'types',
              marks: [{ type: 'code' }],
            },
            {
              type: 'text',
              text: ' of ',
            },
            {
              type: 'text',
              text: 'marks',
              marks: [
                { type: 'link', attrs: { href: 'https://example.com' } },
                { type: 'bold' },
              ],
            },
            {
              type: 'text',
              text: ' in one paragraph.',
            },
          ],
        },
      ],
    }),
  );
}
