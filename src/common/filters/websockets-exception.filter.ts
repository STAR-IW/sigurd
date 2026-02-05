import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WebsocketsExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const data = ctx.getData();

    const message =
      exception instanceof WsException
        ? exception.getError()
        : 'Internal server error';

    client.emit('error', {
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
