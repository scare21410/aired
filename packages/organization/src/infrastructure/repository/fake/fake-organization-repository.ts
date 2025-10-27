import { Organization, type OrganizationCreateType } from '@aired/domain';
import { RepositoryEventTarget } from '@aired/domain-repository';
import type { DomainDatabase } from '@aired/domain-database';
import type IOrganizationRepository from '../../../application/repository/organization-repository.js';

export default class FakeOrganizationRepository
  extends RepositoryEventTarget<Organization>
  implements IOrganizationRepository
{
  private readonly db: DomainDatabase;

  constructor(db: DomainDatabase) {
    super();
    this.db = db;
  }

  create(data: OrganizationCreateType): Promise<Organization> {
    const id = crypto.randomUUID();
    const organization = Organization.from({
      id: id,
      ...data,
    });
    this.db.insert(organization);
    this.emitCreate(organization);

    return Promise.resolve(organization);
  }

  update(aggregate: Organization): Promise<void> {
    this.db.update(aggregate);
    this.emitUpdate(aggregate);

    return Promise.resolve();
  }

  delete(aggregate: Organization): Promise<void> {
    this.db.delete(aggregate);
    this.emitDelete(aggregate);

    return Promise.resolve();
  }

  find(id: Organization['id']): Promise<Organization | undefined> {
    const aggregate = this.db.find(
      (organization): organization is Organization =>
        organization instanceof Organization && organization.id === id,
    );
    return Promise.resolve(aggregate);
  }
}
