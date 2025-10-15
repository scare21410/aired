import HttpAlignedError from './http-aligned-error.js';

export default class NotFoundError extends HttpAlignedError {
  static httpCode = 404;

  constructor(message?: string, errorCode?: string) {
    super(NotFoundError.httpCode, message ?? 'Not found', errorCode);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new NotFoundError(message ?? 'Not found', errorCode);
    }
  }
}
