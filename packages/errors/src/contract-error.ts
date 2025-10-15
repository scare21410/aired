import HttpAlignedError from './http-aligned-error.js';

export default class ContractError extends HttpAlignedError {
  static httpCode = 422;

  constructor(message?: string, errorCode?: string) {
    super(ContractError.httpCode, message ?? 'Contract violation', errorCode);
    Object.setPrototypeOf(this, ContractError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new ContractError(message ?? 'Contract violation', errorCode);
    }
  }
}
