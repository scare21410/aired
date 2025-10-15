import { z } from 'zod';

export const ProjectIdSchema = z.uuid().brand(Symbol('ProjectId'));

export type ProjectId = z.infer<typeof ProjectIdSchema>;

export function createProjectId(id: string): ProjectId {
  return ProjectIdSchema.parse(id);
}
