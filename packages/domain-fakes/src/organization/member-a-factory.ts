import { v5 } from 'uuid';
import {
  createMemberId,
  createProjectId,
  createPermission,
  Member,
  type Organization,
  type User,
} from '@aired/domain';

export default function memberAFactory(organization: Organization, user: User) {
  const id = v5(`member-${user.id}`, organization.id);
  const projectAId = v5('a', organization.id);

  return new Member(createMemberId(id), organization.id, user.id, [
    {
      id: createProjectId(projectAId),
      permission: createPermission('admin'),
    },
  ]);
}
