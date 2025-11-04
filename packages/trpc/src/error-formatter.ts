import { HttpAlignedError } from '@aired/errors';
import {
  TRPC_ERROR_CODES_BY_KEY,
  type ErrorFormatter,
  type TRPCErrorShape,
} from '@trpc/server/unstable-core-do-not-import';

// TODO: replace these with imports from @trpc/server once
//       it gets to a stable release

// const TRPC_ERROR_CODES = {
//   PARSE_ERROR: -32700 as const,
//   BAD_REQUEST: -32600 as const,
//   INTERNAL_SERVER_ERROR: -32603 as const,
//   NOT_IMPLEMENTED: -32603 as const,
//   UNAUTHORIZED: -32001 as const,
//   FORBIDDEN: -32003 as const,
//   NOT_FOUND: -32004 as const,
//   METHOD_NOT_SUPPORTED: -32005 as const,
//   TIMEOUT: -32008 as const,
//   CONFLICT: -32009 as const,
//   PRECONDITION_FAILED: -32012 as const,
//   UNSUPPORTED_MEDIA_TYPE: -32015 as const,
//   PAYLOAD_TOO_LARGE: -32013 as const,
//   UNPROCESSABLE_CONTENT: -32022 as const,
//   TOO_MANY_REQUESTS: -32029 as const,
//   CLIENT_CLOSED_REQUEST: -32099 as const,
// };

const HTTP_TO_ERROR_CODE = {
  400: 'BAD_REQUEST' as const,
  401: 'UNAUTHORIZED' as const,
  403: 'FORBIDDEN' as const,
  404: 'NOT_FOUND' as const,
  405: 'METHOD_NOT_SUPPORTED' as const,
  408: 'TIMEOUT' as const,
  409: 'CONFLICT' as const,
  412: 'PRECONDITION_FAILED' as const,
  413: 'PAYLOAD_TOO_LARGE' as const,
  415: 'UNSUPPORTED_MEDIA_TYPE' as const,
  422: 'UNPROCESSABLE_CONTENT' as const,
  429: 'TOO_MANY_REQUESTS' as const,
  499: 'CLIENT_CLOSED_REQUEST' as const,
  500: 'INTERNAL_SERVER_ERROR' as const,
  501: 'NOT_IMPLEMENTED' as const,
  502: 'BAD_GATEWAY' as const,
  503: 'SERVICE_UNAVAILABLE' as const,
  504: 'GATEWAY_TIMEOUT' as const,
};

export default function errorFormatter<TContext, TShape extends TRPCErrorShape>(
  opts: Parameters<ErrorFormatter<TContext, TShape>>[0],
): TShape {
  const { error, path } = opts;
  if (error.cause instanceof HttpAlignedError) {
    const httpCode: keyof typeof HTTP_TO_ERROR_CODE =
      error.cause.httpCode in HTTP_TO_ERROR_CODE
        ? (error.cause.httpCode as keyof typeof HTTP_TO_ERROR_CODE)
        : 500;
    const descriptiveCode = HTTP_TO_ERROR_CODE[httpCode];
    const numericCode = TRPC_ERROR_CODES_BY_KEY[descriptiveCode];
    return {
      message: error.message,
      code: numericCode,
      data: {
        code: descriptiveCode,
        httpStatus: error.cause.httpCode,
        stack: error.stack,
        path,
      },
    } as TShape;
  }

  return opts.shape as TShape;
}
