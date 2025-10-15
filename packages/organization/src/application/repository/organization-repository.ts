import type { Organization, OrganizationCreateType } from '@aired/domain';

export default interface IOrganizationRepository {
  create(data: OrganizationCreateType): Promise<Organization>;
  delete(aggregate: Organization): Promise<void>;
  update(aggregate: Organization): Promise<void>;
  find(id: Organization['id']): Promise<Organization | undefined>;
}
