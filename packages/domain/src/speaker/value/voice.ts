import { z } from 'zod';
import { VoiceProviderSchema } from './voice-provider.js';

export const VoiceSchema = z.object({
  provider: VoiceProviderSchema,
  name: z.string(),
});

export type Voice = z.infer<typeof VoiceSchema>;

export function createVoice(
  provider: z.infer<typeof VoiceProviderSchema>,
  name: string,
): Voice {
  return VoiceSchema.parse({ provider, name });
}
