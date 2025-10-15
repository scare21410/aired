import type {
  Document,
  DocumentCreateType,
  ProjectId,
  OrganizationId,
} from '@aired/domain';

export default interface IDocumentRepository {
  create(data: DocumentCreateType): Promise<Document>;
  update(aggregate: Document): Promise<void>;
  delete(aggregate: Document): Promise<void>;
  find(
    id: Document['id'],
    projectId: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Document | undefined>;
  findByOrganizationId(organizationId: OrganizationId): Promise<Document[]>;
  findByProjectId(
    projectId: ProjectId,
    organizationId: OrganizationId,
  ): Promise<Document[]>;
}
