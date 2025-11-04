import {
  createTRPCReact,
  httpBatchLink,
  type CreateTRPCReact,
  type TRPCClient,
} from '@trpc/react-query';
import { transformerFactory } from '@aired/trpc';
import type rpcFactory from '../rpc/rpc-factory.js';

type Router = Awaited<ReturnType<typeof rpcFactory>>;

function calculateHostName(): string {
  return typeof location === 'object'
    ? `${location.protocol}//${location.host}/_trpc`
    : 'http://localhost:8080/_trpc';
}

interface TrpcClientFactory {
  trpc: CreateTRPCReact<Router, unknown>;
  trpcClient: TRPCClient<Router>;
}

export default function rpcClientFactory(): TrpcClientFactory {
  const trpc = createTRPCReact<Router>({
    overrides: {
      useMutation: {
        /**
         * This function is called whenever a `.useMutation` succeeds
         * */
        async onSuccess({ originalFn, queryClient }) {
          /**
           * @note that order here matters:
           * The order here allows route changes in `onSuccess` without
           * having a flash of content change whilst redirecting.
           * */
          // Calls the `onSuccess` defined in the `useQuery()`-options:
          await originalFn();
          // Invalidate all queries in the react-query cache:
          await queryClient.invalidateQueries();
        },
      },
    },
  });
  return {
    trpc,
    trpcClient: trpc.createClient({
      links: [
        httpBatchLink({
          url: calculateHostName(),
          transformer: transformerFactory(),
        }),
      ],
    }),
  };
}
