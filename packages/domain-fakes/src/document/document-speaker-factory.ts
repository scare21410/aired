import { v5 } from 'uuid';
import {
  createDocumentId,
  createLanguageCode,
  createDocumentTranscript,
  Document,
  type Project,
} from '@aired/domain';

export default function documentSpeakerFactory(project: Project) {
  const id = v5('speaker-document', project.id);
  const speakerAId = v5('speaker-a', project.organizationId as string);
  const speakerBId = v5('speaker-b', project.organizationId as string);

  const transcript = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { speakerId: speakerAId },
        content: [
          {
            type: 'text',
            text: 'Welcome to the show. Today we are talking about artificial intelligence.',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: { speakerId: speakerAId },
        content: [
          {
            type: 'text',
            text: 'It is a ',
          },
          {
            type: 'text',
            text: 'fascinating',
            marks: [{ type: 'italic' }],
          },
          {
            type: 'text',
            text: ' topic.',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: { speakerId: speakerBId },
        content: [
          {
            type: 'text',
            text: 'Thanks for having me. I have been researching this for ',
          },
          {
            type: 'text',
            text: 'years',
            marks: [{ type: 'bold' }],
          },
          {
            type: 'text',
            text: '.',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: { speakerId: speakerAId },
        content: [
          {
            type: 'text',
            text: 'So where do you think this is all heading?',
          },
        ],
      },
      {
        type: 'paragraph',
        attrs: { speakerId: speakerBId },
        content: [
          {
            type: 'text',
            text: 'Hard to say, but the pace of change is ',
          },
          {
            type: 'text',
            text: 'remarkable',
            marks: [{ type: 'bold' }, { type: 'italic' }],
          },
          {
            type: 'text',
            text: '.',
          },
        ],
      },
    ],
  };

  return new Document(
    createDocumentId(id),
    project.organizationId,
    project.id,
    createLanguageCode('en'),
    'Speaker Document',
    createDocumentTranscript(transcript),
  );
}
