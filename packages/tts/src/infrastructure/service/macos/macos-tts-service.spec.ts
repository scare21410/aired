import { describe, it, expect, beforeEach, vi } from 'vitest';
import MacOsTtsService from './macos-tts-service.js';

vi.mock('node:child_process', () => ({
  execFile: vi.fn(
    (
      cmd: string,
      args: string[],
      cb: (err: null, stdout: string, stderr: string) => void,
    ) => {
      cb(null, '', '');
    },
  ),
}));

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue(Buffer.from('fake audio')),
  writeFile: vi.fn().mockResolvedValue(undefined),
  unlink: vi.fn().mockResolvedValue(undefined),
}));

const { execFile } = await import('node:child_process');
const { readFile, writeFile, unlink } = await import('node:fs/promises');

describe('MacOsTtsService', () => {
  let service: MacOsTtsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MacOsTtsService();
  });

  describe('synthesize', () => {
    it('returns aiff format', async () => {
      const result = await service.synthesize({ ssml: 'Hello world' });

      expect(result.format).toBe('aiff');
    });

    it('returns correct mime type', async () => {
      const result = await service.synthesize({ ssml: 'Hello world' });

      expect(result.mimeType).toBe('audio/aiff');
    });

    it('returns audio data as buffer', async () => {
      const fakeData = Buffer.from('fake audio data');
      vi.mocked(readFile).mockResolvedValue(fakeData as any);

      const result = await service.synthesize({ ssml: 'Hello' });

      expect(result.data).toEqual(fakeData);
    });

    it('writes ssml-converted text to temp file', async () => {
      await service.synthesize({
        ssml: '<speak>Hello <emphasis level="strong">world</emphasis></speak>',
      });

      const writtenContent = vi.mocked(writeFile).mock.calls[0][1] as string;
      expect(writtenContent).toBe('Hello [[emph +]]world[[emph -]]');
    });

    it('passes voice flag to say when voice is provided', async () => {
      await service.synthesize({ ssml: 'Hello', voice: 'Samantha' });

      const args = vi.mocked(execFile).mock.calls[0][1] as string[];
      expect(args).toContain('-v');
      expect(args).toContain('Samantha');
    });

    it('passes rate flag to say converted to words per minute', async () => {
      await service.synthesize({ ssml: 'Hello', rate: 2.0 });

      const args = vi.mocked(execFile).mock.calls[0][1] as string[];
      expect(args).toContain('-r');
      expect(args).toContain('360');
    });

    it('omits voice flag when voice is not provided', async () => {
      await service.synthesize({ ssml: 'Hello' });

      const args = vi.mocked(execFile).mock.calls[0][1] as string[];
      expect(args).not.toContain('-v');
    });

    it('omits rate flag when rate is not provided', async () => {
      await service.synthesize({ ssml: 'Hello' });

      const args = vi.mocked(execFile).mock.calls[0][1] as string[];
      expect(args).not.toContain('-r');
    });

    it('ignores model since say has no model concept', async () => {
      await service.synthesize({ ssml: 'Hello', model: 'some-model' });

      const args = vi.mocked(execFile).mock.calls[0][1] as string[];
      expect(args).not.toContain('some-model');
    });

    it('cleans up both temp files after synthesis', async () => {
      await service.synthesize({ ssml: 'Hello' });

      expect(vi.mocked(unlink)).toHaveBeenCalledTimes(2);
    });

    it('cleans up temp files even when paths share the same uuid prefix', async () => {
      await service.synthesize({ ssml: 'Hello' });

      const [firstCall, secondCall] = vi.mocked(unlink).mock.calls;
      const inputPath = firstCall[0] as string;
      const outputPath = secondCall[0] as string;
      expect(inputPath).toContain('.txt');
      expect(outputPath).toContain('.aiff');
    });
  });
});
