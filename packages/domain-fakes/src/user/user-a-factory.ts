import { createUserId, User } from '@aired/domain';

export default function userAFactory() {
  return new User(
    createUserId('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'),
    'john.doe',
    'john.doe@example.com',
    true,
    '+12025551234',
    true,
    'CONFIRMED',
    true,
    new Date('2024-01-15T10:00:00Z'),
    new Date('2024-01-20T15:30:00Z'),
    'John',
    'Doe',
  );
}
