import { Organization, User } from '@aired/domain';
import projectAFactory from './project/project-a-factory.js';
import projectBFactory from './project/project-b-factory.js';
import documentEmptyFactory from './document/document-empty-factory.js';
import documentSimpleFactory from './document/document-simple-factory.js';
import documentComplexFactory from './document/document-complex-factory.js';
import memberAFactory from './organization/member-a-factory.js';
import memberBFactory from './organization/member-b-factory.js';

export default function aggregateSetFactory(
  organization: Organization,
  userA: User,
  userB: User,
) {
  const projectA = projectAFactory(organization);
  const projectB = projectBFactory(organization);

  const documentEmpty = documentEmptyFactory(projectA);
  const documentSimple = documentSimpleFactory(projectA);
  const documentComplex = documentComplexFactory(projectB);

  const memberA = memberAFactory(organization, userA);
  const memberB = memberBFactory(organization, userB);

  return [
    organization,
    projectA,
    projectB,
    documentEmpty,
    documentSimple,
    documentComplex,
    memberA,
    memberB,
  ];
}
