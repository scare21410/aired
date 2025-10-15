import { type Aggregate, Organization, Project, Document } from '@aired/domain';
import type { DomainDatabaseQueryInterface } from './interfaces.js';
import UniqueConstraintCheck from './unique-constraint-check.js';

interface ConstraintCheck {
  check(data: Aggregate[]): void;
}

export default class DomainDatabase implements DomainDatabaseQueryInterface {
  private data: Aggregate[];

  private readonly constraints: ConstraintCheck[];

  constructor(data: Aggregate[]) {
    this.data = data;
    this.constraints = [
      new UniqueConstraintCheck(Organization, 'id'),
      new UniqueConstraintCheck(Project, 'id'),
      new UniqueConstraintCheck(Document, 'id'),
    ];
  }

  find<T extends Aggregate>(
    predicate: (aggregate: Aggregate) => aggregate is T,
  ): T | undefined {
    return this.data.find(predicate);
  }

  filter<T extends Aggregate>(
    predicate: (aggregate: Aggregate) => aggregate is T,
  ): T[] {
    return this.data.filter(predicate);
  }

  insert(entity: Aggregate): void {
    const data = [...this.data, entity];
    this.constraints.forEach((constraint) => {
      constraint.check(data);
    });
    this.data = data;
  }

  update(entity: Aggregate): void {
    const data = this.data.map((item) =>
      item.id === entity.id ? entity : item,
    );
    this.constraints.forEach((constraint) => {
      constraint.check(data);
    });
    this.data = data;
  }

  delete(entity: Aggregate): void {
    const data = this.data.filter((item) => item.id !== entity.id);
    this.constraints.forEach((constraint) => {
      constraint.check(data);
    });
    this.data = data;
  }
}
