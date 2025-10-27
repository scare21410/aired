import { z } from 'zod';
import { UserIdSchema } from '../value/user-id.js';

export const UserStatusSchema = z.enum([
  'UNCONFIRMED',
  'CONFIRMED',
  'ARCHIVED',
  'COMPROMISED',
  'UNKNOWN',
  'RESET_REQUIRED',
  'FORCE_CHANGE_PASSWORD',
]);

export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserSchema = z.object({
  id: UserIdSchema,
  username: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  phoneNumber: z.string().optional(),
  phoneNumberVerified: z.boolean().optional(),
  status: UserStatusSchema,
  enabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

export default class User implements UserType {
  public readonly id: UserType['id'];
  public readonly username: UserType['username'];
  public readonly email: UserType['email'];
  public readonly emailVerified: UserType['emailVerified'];
  public readonly phoneNumber: UserType['phoneNumber'];
  public readonly phoneNumberVerified: UserType['phoneNumberVerified'];
  public readonly status: UserType['status'];
  public readonly enabled: UserType['enabled'];
  public readonly createdAt: UserType['createdAt'];
  public readonly updatedAt: UserType['updatedAt'];
  public readonly givenName: UserType['givenName'];
  public readonly familyName: UserType['familyName'];

  constructor(
    id: UserType['id'],
    username: UserType['username'],
    email: UserType['email'],
    emailVerified: UserType['emailVerified'],
    phoneNumber: UserType['phoneNumber'],
    phoneNumberVerified: UserType['phoneNumberVerified'],
    status: UserType['status'],
    enabled: UserType['enabled'],
    createdAt: UserType['createdAt'],
    updatedAt: UserType['updatedAt'],
    givenName: UserType['givenName'],
    familyName: UserType['familyName'],
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.emailVerified = emailVerified;
    this.phoneNumber = phoneNumber;
    this.phoneNumberVerified = phoneNumberVerified;
    this.status = status;
    this.enabled = enabled;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.givenName = givenName;
    this.familyName = familyName;
  }

  static clone(other: User) {
    return new User(
      other.id,
      other.username,
      other.email,
      other.emailVerified,
      other.phoneNumber,
      other.phoneNumberVerified,
      other.status,
      other.enabled,
      other.createdAt,
      other.updatedAt,
      other.givenName,
      other.familyName,
    );
  }

  static from(other: unknown): User {
    const parsed = UserSchema.parse(other);
    return new User(
      parsed.id,
      parsed.username,
      parsed.email,
      parsed.emailVerified,
      parsed.phoneNumber,
      parsed.phoneNumberVerified,
      parsed.status,
      parsed.enabled,
      parsed.createdAt,
      parsed.updatedAt,
      parsed.givenName,
      parsed.familyName,
    );
  }
}

export const UserCreateSchema = z.object({
  username: z.string().min(1).max(128),
  email: z.email().optional(),
  emailVerified: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  phoneNumberVerified: z.boolean().optional(),
  status: UserStatusSchema.optional(),
  enabled: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  temporaryPassword: z.string().max(256).optional(),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;
