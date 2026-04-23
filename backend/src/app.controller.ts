import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  @Post('auth/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto.username, createUserDto.password);
  }

  @Post('auth/login')
  async login(@Body() body: any) {
    const { username, password } = body;
    const result = await this.authService.login(username, password);
    if (!result) {
      return { error: 'Invalid credentials' };
    }
    return result;
  }

  @Get('users')
  async getUsers() {
    return this.chatService.findAllPublicUsers();
  }
}
