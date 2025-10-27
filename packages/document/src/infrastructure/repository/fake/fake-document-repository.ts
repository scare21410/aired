import {
  Document,
  type DocumentCreateType,
  type DocumentId,
  type ProjectId,
  type OrganizationId,
} from '@aired/domain';
import { RepositoryEventTarget } from '@aired/domain-repository';
import type { DomainDatabase } from '@aired/domain-database';
import type IDocumentRepository from '../../../application/repository/document-repository.js';

export default class FakeDocumentRepository
  extends RepositoryEventTarget<Document>
  implements IDocumentRepository
{
  private readonly db: DomainDatabase;

  constructor(db: DomainDatabase) {
    super();
    this.db = db;
  }

  create(data: DocumentCreateType): Promise<Document> {
    const id = crypto.randomUUID();
    const document = Document.from({
      id: id,
      ...data,
    });
    this.db.insert(document);
    this.emitCreate(document);

    return Promise.resolve(document);
  }

  update(aggregate: Document): Promise<void> {
    this.db.update(aggregate);
    this.emitUpdate(aggregate);

    return Promise.resolve();
  }

  delete(aggregate: Document): Promise<void> {
    this.db.delete(aggregate);
    this.emitDelete(aggregate);

    return Promise.resolve();
  }

  find(
    id: DocumentId,
    projectId: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Document | undefined> {
    const aggregate = this.db.find(
      (document): document is Document =>
        document instanceof Document &&
        document.id === id &&
        document.projectId === projectId &&
        document.organizationId === organizationId,
    );
    return Promise.resolve(aggregate);
  }

  findByOrganizationId(organizationId: OrganizationId): Promise<Document[]> {
    const aggregates = this.db.filter(
      (document): document is Document =>
        document instanceof Document &&
        document.organizationId === organizationId,
    );
    return Promise.resolve(aggregates);
  }

  findByProjectId(
    projectId: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Document[]> {
    const aggregates = this.db.filter(
      (document): document is Document =>
        document instanceof Document &&
        document.projectId === projectId &&
        document.organizationId === organizationId,
    );
    return Promise.resolve(aggregates);
  }
}
