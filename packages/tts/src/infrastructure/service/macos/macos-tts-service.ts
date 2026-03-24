import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type ITtsService from '../../../application/service/tts-service.js';
import type {
  TtsSynthesizeInput,
  TtsAudio,
} from '../../../application/service/tts-service.js';
import { AUDIO_MIME_TYPES } from '../../../application/service/tts-service.js';
import { ssmlToSay } from './ssml-to-say.js';

const execFileAsync = promisify(execFile);

const DEFAULT_RATE = 180;

export default class MacOsTtsService implements ITtsService {
  async synthesize(input: TtsSynthesizeInput): Promise<TtsAudio> {
    const id = crypto.randomUUID();
    const inputPath = join(tmpdir(), `tts-${id}.txt`);
    const outputPath = join(tmpdir(), `tts-${id}.aiff`);

    const text = ssmlToSay(input.ssml);
    const args = ['-f', inputPath, '-o', outputPath];

    if (input.voice) args.push('-v', input.voice);
    if (input.rate)
      args.push('-r', String(Math.round(DEFAULT_RATE * input.rate)));

    await writeFile(inputPath, text);
    await execFileAsync('say', args);
    const data = await readFile(outputPath);
    await Promise.all([unlink(inputPath), unlink(outputPath)]);

    return { data, format: 'aiff', mimeType: AUDIO_MIME_TYPES.aiff };
  }
}
