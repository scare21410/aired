import type Organization from './organization/aggregate/organization.js';
import type Project from './project/aggregate/project.js';
import type Document from './document/aggregate/document.js';
import type User from './user/aggregate/user.js';
import type Member from './organization/aggregate/member.js';
import type Speaker from './speaker/aggregate/speaker.js';

export type Aggregate =
  | Organization
  | Project
  | Document
  | User
  | Member
  | Speaker;
