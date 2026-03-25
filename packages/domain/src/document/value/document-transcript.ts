import { z } from 'zod';
import { SpeakerIdSchema } from '../../speaker/value/speaker-id.js';

const BoldMarkSchema = z.object({
  type: z.literal('bold'),
});

const ItalicMarkSchema = z.object({
  type: z.literal('italic'),
});

const StrikeMarkSchema = z.object({
  type: z.literal('strike'),
});

const UnderlineMarkSchema = z.object({
  type: z.literal('underline'),
});

const CodeMarkSchema = z.object({
  type: z.literal('code'),
});

const LinkMarkSchema = z.object({
  type: z.literal('link'),
  attrs: z.object({
    href: z.string(),
    target: z.string().optional(),
    rel: z.string().optional(),
    class: z.string().optional(),
  }),
});

const HighlightMarkSchema = z.object({
  type: z.literal('highlight'),
  attrs: z
    .object({
      color: z.string().optional(),
    })
    .optional(),
});

const SubscriptMarkSchema = z.object({
  type: z.literal('subscript'),
});

const SuperscriptMarkSchema = z.object({
  type: z.literal('superscript'),
});

const SpeakerMarkSchema = z.object({
  type: z.literal('speaker'),
  attrs: z.object({
    speakerId: SpeakerIdSchema,
  }),
});

const MarkSchema = z.discriminatedUnion('type', [
  BoldMarkSchema,
  ItalicMarkSchema,
  StrikeMarkSchema,
  UnderlineMarkSchema,
  CodeMarkSchema,
  LinkMarkSchema,
  HighlightMarkSchema,
  SubscriptMarkSchema,
  SuperscriptMarkSchema,
  SpeakerMarkSchema,
]);

const TextNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(MarkSchema).optional(),
});

const HardBreakNodeSchema = z.object({
  type: z.literal('hardBreak'),
});

const InlineNodeSchema = z.union([TextNodeSchema, HardBreakNodeSchema]);

const ImageNodeSchema = z.object({
  type: z.literal('image'),
  attrs: z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
    speakerId: SpeakerIdSchema.optional(),
  }),
});

const HorizontalRuleNodeSchema = z.object({
  type: z.literal('horizontalRule'),
  attrs: z
    .object({
      speakerId: SpeakerIdSchema.optional(),
    })
    .optional(),
});

const ListItemNodeSchema = z.object({
  type: z.literal('listItem'),
  get content() {
    return z.array(BlockNodeSchema).optional();
  },
});

const BlockNodeSchema = z.union([
  z.object({
    type: z.literal('paragraph'),
    attrs: z
      .object({
        speakerId: SpeakerIdSchema.optional(),
      })
      .optional(),
    content: z.array(InlineNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('heading'),
    attrs: z.object({
      level: z.number().min(1).max(6),
      speakerId: SpeakerIdSchema.optional(),
    }),
    content: z.array(InlineNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('codeBlock'),
    attrs: z
      .object({
        language: z.string().optional(),
        speakerId: SpeakerIdSchema.optional(),
      })
      .optional(),
    content: z.array(TextNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('blockquote'),
    attrs: z
      .object({
        speakerId: SpeakerIdSchema.optional(),
      })
      .optional(),
    get content() {
      return z.array(BlockNodeSchema).optional();
    },
  }),
  z.object({
    type: z.literal('bulletList'),
    attrs: z
      .object({
        speakerId: SpeakerIdSchema.optional(),
      })
      .optional(),
    content: z.array(ListItemNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('orderedList'),
    attrs: z
      .object({
        start: z.number().optional(),
        speakerId: SpeakerIdSchema.optional(),
      })
      .optional(),
    content: z.array(ListItemNodeSchema).optional(),
  }),
  HorizontalRuleNodeSchema,
  ImageNodeSchema,
]);

export const DocumentTranscriptSchema = z
  .object({
    type: z.literal('doc'),
    content: z.array(BlockNodeSchema).optional(),
  })
  .brand(Symbol('DocumentTranscript'));

export type DocumentTranscript = z.infer<typeof DocumentTranscriptSchema>;

export function createDocumentTranscript(
  transcript: unknown,
): DocumentTranscript {
  return DocumentTranscriptSchema.parse(transcript);
}

export function createEmptyDocumentTranscript(): DocumentTranscript {
  return DocumentTranscriptSchema.parse({
    type: 'doc',
    content: [],
  });
}
