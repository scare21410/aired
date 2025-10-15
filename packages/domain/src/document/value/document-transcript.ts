import { z } from 'zod';

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
]);

const TextNodeSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  marks: z.array(MarkSchema).optional(),
});

const HardBreakNodeSchema = z.object({
  type: z.literal('hardBreak'),
});

const InlineNodeSchema = z.discriminatedUnion('type', [
  TextNodeSchema,
  HardBreakNodeSchema,
]);

const ImageNodeSchema = z.object({
  type: z.literal('image'),
  attrs: z.object({
    src: z.string(),
    alt: z.string().optional(),
    title: z.string().optional(),
  }),
});

const HorizontalRuleNodeSchema = z.object({
  type: z.literal('horizontalRule'),
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
    content: z.array(InlineNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('heading'),
    attrs: z.object({
      level: z.number().min(1).max(6),
    }),
    content: z.array(InlineNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('codeBlock'),
    attrs: z
      .object({
        language: z.string().optional(),
      })
      .optional(),
    content: z.array(TextNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('blockquote'),
    get content() {
      return z.array(BlockNodeSchema).optional();
    },
  }),
  z.object({
    type: z.literal('bulletList'),
    content: z.array(ListItemNodeSchema).optional(),
  }),
  z.object({
    type: z.literal('orderedList'),
    attrs: z
      .object({
        start: z.number().optional(),
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
