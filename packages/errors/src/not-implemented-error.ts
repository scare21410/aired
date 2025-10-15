import HttpAlignedError from './http-aligned-error.js';

export default class NotImplementedError extends HttpAlignedError {
  static httpCode = 501;

  constructor(message?: string, errorCode?: string) {
    super(
      NotImplementedError.httpCode,
      message ?? 'Not implemented',
      errorCode,
    );
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new NotImplementedError(message ?? 'Not implemented', errorCode);
    }
  }
}
