import HttpAlignedError from './http-aligned-error.js';

export default class AuthorizationError extends HttpAlignedError {
  static httpCode = 403;

  constructor(message?: string, errorCode?: string) {
    super(AuthorizationError.httpCode, message ?? 'Unauthorized', errorCode);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new AuthorizationError(message ?? 'Unauthorized', errorCode);
    }
  }
}
