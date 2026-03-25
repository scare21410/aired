import { createUserId, User } from '@aired/domain';

export default function userUnconfirmedFactory() {
  return new User(
    createUserId('eb66a273-5241-43a3-becf-3bb81fff0dfc'),
    'bob.wilson',
    'bob.wilson@example.com',
    false,
    undefined,
    undefined,
    'UNCONFIRMED',
    true,
    new Date('2024-03-01T09:00:00Z'),
    new Date('2024-03-01T09:00:00Z'),
    undefined,
    undefined,
    undefined,
  );
}
