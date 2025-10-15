import HttpAlignedError from './http-aligned-error.js';

export default class AuthenticationError extends HttpAlignedError {
  static httpCode = 401;

  constructor(message?: string, errorCode?: string) {
    super(
      AuthenticationError.httpCode,
      message ?? 'Unauthenticated',
      errorCode,
    );
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  static throwIfNil<T>(
    value: T | null | undefined,
    message?: string,
    errorCode = undefined,
  ): asserts value is NonNullable<T> {
    if (value == undefined) {
      throw new AuthenticationError(message ?? 'Unauthenticated', errorCode);
    }
  }
}
