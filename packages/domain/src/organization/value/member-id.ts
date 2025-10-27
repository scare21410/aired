import { z } from 'zod';

export const MemberIdSchema = z.uuid().brand(Symbol('MemberId'));

export type MemberId = z.infer<typeof MemberIdSchema>;

export function createMemberId(id: string): MemberId {
  return MemberIdSchema.parse(id);
}
