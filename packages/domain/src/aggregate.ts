import type Organization from './organization/aggregate/organization';
import type Project from './project/aggregate/project.js';
import type Document from './document/aggregate/document.js';

export type Aggregate = Organization | Project | Document;
