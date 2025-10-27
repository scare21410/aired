import { z } from 'zod';

export const UserIdSchema = z.uuid().brand(Symbol('UserId'));

export type UserId = z.infer<typeof UserIdSchema>;

export function createUserId(id: string): UserId {
  return UserIdSchema.parse(id);
}
