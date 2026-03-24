import { z } from 'zod';

export const VoiceProviderSchema = z
  .enum(['openai', 'elevenlabs', 'google', 'azure', 'macos'])
  .brand(Symbol('VoiceProvider'));

export type VoiceProvider = z.infer<typeof VoiceProviderSchema>;

export function createVoiceProvider(
  provider: 'openai' | 'elevenlabs' | 'google' | 'azure' | 'macos',
): VoiceProvider {
  return VoiceProviderSchema.parse(provider);
}
