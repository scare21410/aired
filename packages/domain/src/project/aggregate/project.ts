import { z } from 'zod';
import { OrganizationIdSchema } from '../../organization/value/organization-id';
import { ProjectIdSchema } from '../value/project-id';

export const ProjectSchema = z.object({
  id: ProjectIdSchema,
  organizationId: OrganizationIdSchema,
  name: z.string(),
});

export type ProjectType = z.infer<typeof ProjectSchema>;

export default class Project implements ProjectType {
  public readonly id: ProjectType['id'];
  public readonly organizationId: ProjectType['organizationId'];
  public readonly name: ProjectType['name'];

  constructor(
    id: ProjectType['id'],
    organizationId: ProjectType['organizationId'],
    name: ProjectType['name'],
  ) {
    this.id = id;
    this.organizationId = organizationId;
    this.name = name;
  }

  static clone(other: Project) {
    return new Project(other.id, other.organizationId, other.name);
  }

  static from(other: unknown): Project {
    return Project.clone(ProjectSchema.parse(other));
  }
}
