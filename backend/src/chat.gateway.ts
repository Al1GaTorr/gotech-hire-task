import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { verify } from 'crypto';
import { AuthService } from './auth.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } }) // В продакшене тут должен быть твой фронтенд URL
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService, private authService: AuthService) {}
  handleDisconnect(client: any) {
    console.log('User disconnected:', client.id);
  }

  private getRoomKey(roomId: number): string {
    return `room_${roomId}`;
  }

  handleConnection(client: Socket) {
    const check = this.authService.verifyToken(client.handshake.auth.token);
    if (!check) {
      client.disconnect();
      return;
    }
    console.log('User connected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket) {
    client.join(this.getRoomKey(data.roomId));
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: SendMessageDto, @ConnectedSocket() client: Socket) {
    const message = await this.chatService.saveMessage(
      data.roomId, 
      data.userId, 
      data.content, 
      "User"
    );
    this.server.to(this.getRoomKey(data.roomId)).emit('newMessage', message);
  }
}