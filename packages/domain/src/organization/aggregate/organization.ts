import { z } from 'zod';
import { OrganizationIdSchema } from '../value/organization-id';

export const OrganizationSchema = z.object({
  id: OrganizationIdSchema,
  name: z.string(),
});

export type OrganizationType = z.infer<typeof OrganizationSchema>;

export default class Organization implements OrganizationType {
  public readonly id: OrganizationType['id'];
  public readonly name: OrganizationType['name'];

  constructor(id: OrganizationType['id'], name: OrganizationType['name']) {
    this.id = id;
    this.name = name;
  }

  static clone(other: Organization) {
    return new Organization(other.id, other.name);
  }

  static from(other: unknown): Organization {
    return Organization.clone(OrganizationSchema.parse(other));
  }
}
