import {
  type IProjectRepositoryFactory,
  rpcFactory as projectRpcFactory,
} from '@aired/project';
import { mergeRouters } from '@trpc/server/unstable-core-do-not-import';

export default function rpcFactory(
  projectRepositoryFactory: IProjectRepositoryFactory,
) {
  return mergeRouters(projectRpcFactory(projectRepositoryFactory));
}
