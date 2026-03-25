export type { Aggregate } from './aggregate.js';

export {
  OrganizationSchema,
  OrganizationCreateSchema,
  default as Organization,
  type OrganizationType,
  type OrganizationCreateType,
} from './organization/aggregate/organization.js';
export {
  OrganizationIdSchema,
  type OrganizationId,
  createOrganizationId,
} from './organization/value/organization-id.js';

export {
  ProjectSchema,
  ProjectCreateSchema,
  default as Project,
  type ProjectType,
  type ProjectCreateType,
} from './project/aggregate/project.js';
export {
  ProjectIdSchema,
  type ProjectId,
  createProjectId,
} from './project/value/project-id.js';

export {
  DocumentSchema,
  DocumentCreateSchema,
  default as Document,
  type DocumentType,
  type DocumentCreateType,
} from './document/aggregate/document.js';
export {
  DocumentIdSchema,
  type DocumentId,
  createDocumentId,
} from './document/value/document-id.js';
export {
  DocumentTranscriptSchema,
  type DocumentTranscript,
  createDocumentTranscript,
  createEmptyDocumentTranscript,
} from './document/value/document-transcript.js';

export {
  LanguageCodeSchema,
  type LanguageCode,
  createLanguageCode,
} from './i18n/value/language-code.js';

export {
  UserSchema,
  UserCreateSchema,
  UserStatusSchema,
  default as User,
  type UserType,
  type UserCreateType,
  type UserStatus,
} from './user/aggregate/user.js';
export {
  UserIdSchema,
  type UserId,
  createUserId,
} from './user/value/user-id.js';

export {
  MemberSchema,
  MemberCreateSchema,
  MemberProjectSchema,
  default as Member,
  type MemberType,
  type MemberCreateType,
  type MemberProjectType,
} from './organization/aggregate/member.js';
export {
  MemberIdSchema,
  type MemberId,
  createMemberId,
} from './organization/value/member-id.js';
export {
  PermissionSchema,
  type Permission,
  createPermission,
} from './organization/value/permission.js';

export {
  SpeakerSchema,
  SpeakerCreateSchema,
  default as Speaker,
  type SpeakerType,
  type SpeakerCreateType,
} from './speaker/aggregate/speaker.js';
export {
  SpeakerIdSchema,
  type SpeakerId,
  createSpeakerId,
} from './speaker/value/speaker-id.js';
export { VoiceSchema, type Voice, createVoice } from './speaker/value/voice.js';
export {
  VoiceProviderSchema,
  type VoiceProvider,
  createVoiceProvider,
} from './speaker/value/voice-provider.js';
