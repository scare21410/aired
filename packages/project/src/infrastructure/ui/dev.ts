import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { defaultAggregateSetFactory } from '@aired/domain-fakes';
import { DomainDatabase } from '@aired/domain-database';
import rpcFactory from '../rpc/rpc-factory.js';
import projectRepositoryFactory from '../repository/fake/fake-project-repository-factory.js';

const database = new DomainDatabase(defaultAggregateSetFactory());
const router = rpcFactory(projectRepositoryFactory(database));

const server = createHTTPServer({
  basePath: '/_trpc/',
  router,
  createContext: () => ({}),
  onError: ({ error }) => {
    console.error(error);
  },
});

server.listen(9000, () => {
  console.log('Listening on port 9000');
});
