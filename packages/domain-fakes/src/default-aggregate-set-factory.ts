import organizationAFactory from './organization/organization-a-factory.js';
import organizationBFactory from './organization/organization-b-factory.js';
import aggregateSetFactory from './aggregate-set-factory.js';
import userAFactory from './user/user-a-factory.js';
import userBFactory from './user/user-b-factory.js';
import userUnconfirmedFactory from './user/user-unconfirmed-factory.js';

export default function defaultAggregateSetFactory() {
  const userA = userAFactory();
  const userB = userBFactory();
  const unconfirmedUser = userUnconfirmedFactory();
  const organizationA = organizationAFactory();
  const organizationB = organizationBFactory();
  return [
    userA,
    userB,
    unconfirmedUser,
    ...aggregateSetFactory(organizationA, userA, userB),
    ...aggregateSetFactory(organizationB, userA, userB),
  ];
}
