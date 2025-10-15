import HttpAlignedError from './http-aligned-error.js';

export default class RequestTimeoutError extends HttpAlignedError {
  static httpCode = 408;

  constructor(message?: string, errorCode?: string) {
    super(
      RequestTimeoutError.httpCode,
      message ?? 'Request timed out',
      errorCode,
    );
    Object.setPrototypeOf(this, RequestTimeoutError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new RequestTimeoutError(message ?? 'Not implemented', errorCode);
    }
  }
}
