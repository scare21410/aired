import { z } from 'zod';

export const OrganizationIdSchema = z.uuid().brand(Symbol('OrganizationId'));

export type OrganizationId = z.infer<typeof OrganizationIdSchema>;

export function createOrganizationId(id: string): OrganizationId {
  return OrganizationIdSchema.parse(id);
}
