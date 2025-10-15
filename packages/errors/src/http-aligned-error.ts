import BaseError from './base-error.js';

export default class HttpAlignedError extends BaseError {
  public readonly httpCode: number;

  constructor(httpCode: number, message: string, errorCode?: string) {
    super(
      message ||
        (errorCode ?? httpCode).toString() ||
        'Unknown HTTP aligned error',
      errorCode,
    );
    this.httpCode = httpCode;
    Object.setPrototypeOf(this, HttpAlignedError.prototype);
  }
}
