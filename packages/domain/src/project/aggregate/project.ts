import { z } from 'zod';
import { OrganizationIdSchema } from '../../organization/value/organization-id.js';
import { ProjectIdSchema } from '../value/project-id.js';

export const ProjectSchema = z.object({
  id: ProjectIdSchema,
  organizationId: OrganizationIdSchema,
  name: z.string(),
  coverImageUrl: z.string().optional(),
});

export type ProjectType = z.infer<typeof ProjectSchema>;

export default class Project implements ProjectType {
  public readonly id: ProjectType['id'];
  public readonly organizationId: ProjectType['organizationId'];
  public readonly name: ProjectType['name'];
  public readonly coverImageUrl: ProjectType['coverImageUrl'];

  constructor(
    id: ProjectType['id'],
    organizationId: ProjectType['organizationId'],
    name: ProjectType['name'],
    coverImageUrl?: ProjectType['coverImageUrl'],
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.name = name;
    this.coverImageUrl = coverImageUrl;
  }

  static clone(other: Project) {
    return new Project(
      other.id,
      other.organizationId,
      other.name,
      other.coverImageUrl,
    );
  }

  static from(other: unknown): Project {
    return Project.clone(ProjectSchema.parse(other));
  }
}

export const ProjectCreateSchema = ProjectSchema.omit({ id: true });
export type ProjectCreateType = z.infer<typeof ProjectCreateSchema>;
