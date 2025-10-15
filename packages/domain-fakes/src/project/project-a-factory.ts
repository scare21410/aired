import { v5 } from 'uuid';
import { createProjectId, type Organization, Project } from '@aired/domain';

export default function projectAFactory(organization: Organization) {
  const id = v5('a', organization.id);
  return new Project(createProjectId(id), organization.id, 'Project A');
}
