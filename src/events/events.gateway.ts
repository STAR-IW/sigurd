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
import { RedisService } from '../redis/redis.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClassCapacityUpdated } from './interfaces/class_capacity_updated.interface';

//Gateway ( WebSocket Controller)
@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  //http://localhost:3000/events
  namespace: '/events',
})
export class EventsGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnModuleInit
{
  constructor(private redisService: RedisService) {}

  private clients = new Map<string, Socket>();
  @WebSocketServer() server: Server;
  //runs after constructor
  onModuleInit() {
    // subscribe to redis updates channel, Receives updates from Redis
    this.redisService.onMessage('class:updates', (parsed: any) => {
      console.log('events.gateway| onModuleInit - onMessage');
      const data = parsed as ClassCapacityUpdated;
      try {
        this.broadcastCapacityUpdate(data);
      } catch (err) {
        console.error(err);
      }
    });
  }
  handleConnection(client: Socket) {
    console.log(`client ${client.id} connected using socket `);
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
    //connection between use and browser
    @ConnectedSocket() client: Socket,
    @MessageBody('classId') classId: number,
  ) {
    console.log('client clicked send');
    const roomName = `class:${classId}`;
    console.log('class', roomName);
    await client.join(roomName);
    //emit(eventName, data being sent)
    client.emit('join', { message: 'Joined', classId, roomName });
    this.server
      .to(roomName)
      .emit('user-joined', { message: 'Joined', classId, roomName });
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
    this.server
      .to(roomName)
      .emit('user-left', { message: 'Left', classId, roomName });
  }

  private broadcastCapacityUpdate(data: ClassCapacityUpdated) {
    this.server.to(`class:${data.classId}`).emit('capacity-updated', data);
  }
}
