import { z } from 'zod';
import { OrganizationIdSchema } from '../../organization/value/organization-id.js';
import { SpeakerIdSchema } from '../value/speaker-id.js';
import { VoiceSchema } from '../value/voice.js';

export const SpeakerSchema = z.object({
  id: SpeakerIdSchema,
  organizationId: OrganizationIdSchema,
  name: z.string(),
  voice: VoiceSchema,
});

export type SpeakerType = z.infer<typeof SpeakerSchema>;

export default class Speaker implements SpeakerType {
  public readonly id: SpeakerType['id'];
  public readonly organizationId: SpeakerType['organizationId'];
  public readonly name: SpeakerType['name'];
  public readonly voice: SpeakerType['voice'];

  constructor(
    id: SpeakerType['id'],
    organizationId: SpeakerType['organizationId'],
    name: SpeakerType['name'],
    voice: SpeakerType['voice'],
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.name = name;
    this.voice = voice;
  }

  static clone(other: Speaker): Speaker {
    return new Speaker(other.id, other.organizationId, other.name, other.voice);
  }

  static from(other: unknown): Speaker {
    return Speaker.clone(SpeakerSchema.parse(other));
  }
}

export const SpeakerCreateSchema = SpeakerSchema.omit({ id: true });
export type SpeakerCreateType = z.infer<typeof SpeakerCreateSchema>;
