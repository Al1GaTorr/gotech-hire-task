import { Controller, Get, Post, Body, Param, Headers, UnauthorizedException, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService, private authService: AuthService) {}

 @Get('rooms')
async getRooms(@Headers('authorization') authHeader: string) {
  const token = authHeader?.split(' ')[1];
  const payload = this.authService.verifyToken(token);
  
  if (!payload) {
    throw new UnauthorizedException('Сначала залогинься!'); 
  }

  // 3. Если всё ок, отдаем комнаты
  return this.chatService.getRooms();
}
@Post('messages')
async send(@Body() dto: SendMessageDto) {
  return this.chatService.saveMessage(
    dto.roomId, 
    dto.userId, 
    dto.content, 
    'Anonymous'
  );
}
  @Post('rooms')
  async createRoom(@Body() body: any, @Headers('authorization') auth: string) {
    // manual JWT parsing with hardcoded secret (second occurrence)
    let userId = 1; // magic default
    if (auth) {
      try {
        const token = auth.replace('Bearer ', '');
        const decoded = this.authService.verifyToken(token);
        if (!decoded) {
          throw new UnauthorizedException('Invalid token');
        }
        userId = decoded.userId;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }
    return this.chatService.createRoom(body.name, body.description);
  }

  @Get('rooms/:roomId/messages')
async getMessages(
  @Param('roomId') roomId: string,
  @Query('limit') limit: string = '20',
  @Query('offset') offset: string = '0'
) {
  
  return this.chatService.getMessages(
    parseInt(roomId), 
    parseInt(limit), 
    parseInt(offset)
  );
}
}
