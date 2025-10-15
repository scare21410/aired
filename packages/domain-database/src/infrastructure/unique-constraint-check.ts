import { ContractError } from '@aired/errors';
import type { Aggregate } from '@aired/domain';

export default class UniqueConstraintCheck<T extends Aggregate> {
  private readonly klass: new (...args: never[]) => T;
  private readonly field: keyof T;

  constructor(klass: new (...args: never[]) => T, field: keyof T) {
    this.klass = klass;
    this.field = field;
  }

  check(data: Aggregate[]): void {
    const entities = data.filter(
      (entity): entity is T => entity instanceof this.klass,
    );
    const values = entities.map((entity) => entity[this.field]);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      throw new ContractError(
        `Unique constraint violation on ${this.klass.name}.${String(this.field)}`,
      );
    }
  }
}
