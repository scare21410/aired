import { Organization } from '@aired/domain';
import projectAFactory from './project/project-a-factory.js';
import projectBFactory from './project/project-b-factory.js';
import documentEmptyFactory from './document/document-empty-factory.js';
import documentSimpleFactory from './document/document-simple-factory.js';
import documentComplexFactory from './document/document-complex-factory.js';

export default function aggregateSetFactory(organization: Organization) {
  const projectA = projectAFactory(organization);
  const projectB = projectBFactory(organization);

  const documentEmpty = documentEmptyFactory(projectA);
  const documentSimple = documentSimpleFactory(projectA);
  const documentComplex = documentComplexFactory(projectB);

  return [
    organization,
    projectA,
    projectB,
    documentEmpty,
    documentSimple,
    documentComplex,
  ];
}
