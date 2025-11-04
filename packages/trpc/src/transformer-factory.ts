import { serialize, deserialize } from '@ungap/structured-clone';
import type { CombinedDataTransformer } from '@trpc/server/unstable-core-do-not-import';

const serde = {
  serialize,
  deserialize,
};
const transformer = {
  input: serde,
  output: serde,
};

export default function transformerFactory(): CombinedDataTransformer {
  // return undefined;
  return transformer;
}
