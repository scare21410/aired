import AuthenticationError from './authentication-error.js';
import AuthorizationError from './authorization-error.js';
import BadRequestError from './bad-request-error.js';
import ConflictError from './conflict-error.js';
import ContractError from './contract-error.js';
import HttpAlignedError from './http-aligned-error.js';
import NotFoundError from './not-found-error.js';
import NotImplementedError from './not-implemented-error.js';
import RequestTimeoutError from './request-timeout-error.js';

export default function httpAlignedErrorFactory(
  httpCode: number,
  message: string,
  errorCode?: string,
) {
  switch (httpCode) {
    case AuthenticationError.httpCode:
      return new AuthenticationError(message, errorCode);
    case AuthorizationError.httpCode:
      return new AuthorizationError(message, errorCode);
    case BadRequestError.httpCode:
      return new BadRequestError(message, errorCode);
    case ConflictError.httpCode:
      return new ConflictError(message, errorCode);
    case ContractError.httpCode:
      return new ContractError(message, errorCode);
    case NotFoundError.httpCode:
      return new NotFoundError(message, errorCode);
    case NotImplementedError.httpCode:
      return new NotImplementedError(message, errorCode);
    case RequestTimeoutError.httpCode:
      return new RequestTimeoutError(message, errorCode);
    default:
      return new HttpAlignedError(httpCode, message, errorCode);
  }
}
