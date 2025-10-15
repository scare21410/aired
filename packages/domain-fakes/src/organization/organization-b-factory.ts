import { createOrganizationId, Organization } from '@aired/domain';

export default function organizationBFactory() {
  return new Organization(
    createOrganizationId('77d895fe-2df3-49f7-9858-17bf1859efa8'),
    'Organization B',
  );
}
