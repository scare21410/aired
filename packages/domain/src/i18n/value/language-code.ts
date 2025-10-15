import { z } from 'zod';

export const LanguageCodeSchema = z.string().brand(Symbol('LanguageCode'));

export type LanguageCode = z.infer<typeof LanguageCodeSchema>;

export function createLanguageCode(code: string): LanguageCode {
  return LanguageCodeSchema.parse(code);
}
