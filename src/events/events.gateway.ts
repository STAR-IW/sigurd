import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

//Gateway ( WebSocket Controller)

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  //http://localhost:3000/events
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new Map<string, Socket>();
  @WebSocketServer() server: Server;
  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
  }
  //run when the nestJS server deploys
  afterInit() {
    console.log('WebSocket gateway created & Server initialized');
  }
  handleDisconnect(client: Socket) {
    console.log(`client ${client.id} disconnected`);
    this.clients.delete(client.id);
  }
  @SubscribeMessage('join-class')
  async joinClass(
    @ConnectedSocket() client: Socket,
    @MessageBody('classId') classId: number,
  ) {
    console.log('client clicked send');
    console.log('classId', classId);
    const roomName = `class:${classId}`;
    await client.join(roomName);
    client.emit('join', { message: 'Joined', classId, roomName });
    console.log(client.rooms, 'client.rooms : ');
  }

  @SubscribeMessage('leave-class')
  async leaveClass(
    @ConnectedSocket() client: Socket,
    @MessageBody('classId') classId: number,
  ) {
    console.log('client clicked send');
    console.log('classId', classId);
    const roomName = `class:${classId}`;
    await client.leave(roomName);
    client.emit('leave', { message: 'leave', classId, roomName });
  }
}
