import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();
    const errorString = exception.getError().toString();

    if (errorString.includes('Empty response')) {
      return response.status(500).json({
        ok: false,
        message: errorString.substring(0, errorString.indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      return response.status(rpcError.status).json({
        ok: false,
        message: rpcError.message,
      });
    }
    return response.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
  }
}
