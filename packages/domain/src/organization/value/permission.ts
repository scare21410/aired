import { z } from 'zod';

export const PermissionSchema = z
  .enum(['admin', 'read', 'write'])
  .brand(Symbol('Permission'));

export type Permission = z.infer<typeof PermissionSchema>;

export function createPermission(
  permission: 'admin' | 'read' | 'write',
): Permission {
  return PermissionSchema.parse(permission);
}
