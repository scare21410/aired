import organizationAFactory from './organization/organization-a-factory.js';
import organizationBFactory from './organization/organization-b-factory.js';
import aggregateSetFactory from './aggregate-set-factory';

export default function defaultAggregateSetFactory() {
  const organizationA = organizationAFactory();
  const organizationB = organizationBFactory();
  return [
    ...aggregateSetFactory(organizationA),
    ...aggregateSetFactory(organizationB),
  ];
}
