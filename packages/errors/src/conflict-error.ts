import HttpAlignedError from './http-aligned-error.js';

export default class ConflictError extends HttpAlignedError {
  static httpCode = 409;

  constructor(message?: string, errorCode?: string) {
    super(ConflictError.httpCode, message ?? 'Conflict violation', errorCode);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new ConflictError(message ?? 'Conflict', errorCode);
    }
  }
}
