import { createUserId, User } from '@aired/domain';

export default function userBFactory() {
  return new User(
    createUserId('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e'),
    'jane.smith',
    'jane.smith@example.com',
    true,
    undefined,
    undefined,
    'CONFIRMED',
    true,
    new Date('2024-02-01T08:00:00Z'),
    new Date('2024-02-10T12:00:00Z'),
    'Jane',
    'Smith',
  );
}
