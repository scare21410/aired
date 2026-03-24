export interface TtsSynthesizeInput {
  ssml: string;
  voice?: string;
  model?: string;
  rate?: number;
}

export type AudioFormat = 'aiff' | 'mp3' | 'wav' | 'ogg' | 'flac';

export const AUDIO_MIME_TYPES: Record<AudioFormat, string> = {
  aiff: 'audio/aiff',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
};

export interface TtsAudio {
  data: Buffer;
  format: AudioFormat;
  mimeType: string;
}

export default interface ITtsService {
  synthesize(input: TtsSynthesizeInput): Promise<TtsAudio>;
}
