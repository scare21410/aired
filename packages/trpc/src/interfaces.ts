export interface IDataTransformer {
  serialize: (object: unknown) => unknown;
  deserialize: (object: unknown) => unknown;
}
