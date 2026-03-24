import { z } from 'zod';

export const SpeakerIdSchema = z.uuid().brand(Symbol('SpeakerId'));

export type SpeakerId = z.infer<typeof SpeakerIdSchema>;

export function createSpeakerId(id: string): SpeakerId {
  return SpeakerIdSchema.parse(id);
}
