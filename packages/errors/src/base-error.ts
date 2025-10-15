export default class BaseError extends Error {
  public readonly errorCode?: string;

  constructor(message: string, errorCode?: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
