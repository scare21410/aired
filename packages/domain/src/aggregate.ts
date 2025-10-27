import type Organization from './organization/aggregate/organization.js';
import type Project from './project/aggregate/project.js';
import type Document from './document/aggregate/document.js';
import type User from './user/aggregate/user.js';
import type Member from './organization/aggregate/member.js';

export type Aggregate = Organization | Project | Document | User | Member;
