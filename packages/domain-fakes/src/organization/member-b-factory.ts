import { v5 } from 'uuid';
import {
  createMemberId,
  createProjectId,
  createPermission,
  Member,
  type Organization,
  type User,
} from '@aired/domain';

export default function memberBFactory(organization: Organization, user: User) {
  const id = v5(`member-${user.id}`, organization.id);
  const projectBId = v5('b', organization.id);

  return new Member(createMemberId(id), organization.id, user.id, [
    {
      id: createProjectId(projectBId),
      permission: createPermission('read'),
    },
  ]);
}
