import { z } from 'zod';
import { MemberIdSchema } from '../value/member-id.js';
import { OrganizationIdSchema } from '../value/organization-id.js';
import { UserIdSchema } from '../../user/value/user-id.js';
import { ProjectIdSchema } from '../../project/value/project-id.js';
import { PermissionSchema } from '../value/permission.js';

export const MemberProjectSchema = z.object({
  id: ProjectIdSchema,
  permission: PermissionSchema,
});

export type MemberProjectType = z.infer<typeof MemberProjectSchema>;

export const MemberSchema = z.object({
  id: MemberIdSchema,
  organizationId: OrganizationIdSchema,
  userId: UserIdSchema,
  projects: z.array(MemberProjectSchema),
});

export type MemberType = z.infer<typeof MemberSchema>;

export default class Member implements MemberType {
  public readonly id: MemberType['id'];
  public readonly organizationId: MemberType['organizationId'];
  public readonly userId: MemberType['userId'];
  public readonly projects: MemberType['projects'];

  constructor(
    id: MemberType['id'],
    organizationId: MemberType['organizationId'],
    userId: MemberType['userId'],
    projects: MemberType['projects'],
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.userId = userId;
    this.projects = projects;
  }

  static clone(other: Member) {
    return new Member(
      other.id,
      other.organizationId,
      other.userId,
      other.projects,
    );
  }

  static from(other: unknown): Member {
    const parsed = MemberSchema.parse(other);
    return new Member(
      parsed.id,
      parsed.organizationId,
      parsed.userId,
      parsed.projects,
    );
  }
}

export const MemberCreateSchema = MemberSchema.omit({ id: true });
export type MemberCreateType = z.infer<typeof MemberCreateSchema>;
