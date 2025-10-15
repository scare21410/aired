import { createOrganizationId, Organization } from '@aired/domain';

export default function organizationAFactory() {
  return new Organization(
    createOrganizationId('e03e7324-931a-488f-a6a4-f367da43054b'),
    'Organization A',
  );
}
