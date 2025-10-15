import { expect, it, describe } from 'vitest';
import { Project } from '@aired/domain';
import { organizationAFactory, projectAFactory } from '@aired/domain-fakes';
import UniqueConstraintCheck from './unique-constraint-check.js';

const organization = organizationAFactory();

describe('UniqueConstraintCheck', () => {
  it('throws an error if there are duplicate values', () => {
    const data = [projectAFactory(organization), projectAFactory(organization)];
    const check = new UniqueConstraintCheck(Project, 'id');
    expect(() => {
      check.check(data);
    }).toThrow('Unique constraint violation');
  });

  it('succeeds if there are no duplicate values', () => {
    const data = [projectAFactory(organization)];
    const check = new UniqueConstraintCheck(Project, 'id');
    expect(() => {
      check.check(data);
    }).not.toThrow();
  });
});
