import HttpAlignedError from './http-aligned-error.js';

export default class BadRequestError extends HttpAlignedError {
  static httpCode = 400;

  constructor(message?: string, errorCode?: string) {
    super(BadRequestError.httpCode, message ?? 'Bad request', errorCode);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new BadRequestError(message ?? 'Bad request', errorCode);
    }
  }
}
