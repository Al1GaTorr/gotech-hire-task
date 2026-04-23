import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ChatController } from './chat.controller';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { User } from './entities/user.entity';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Room, Message],
      
    }),


    TypeOrmModule.forFeature([User, Room, Message]),
  ],
  controllers: [AppController, ChatController],
  providers: [AuthService, ChatService, ChatGateway],
})
export class AppModule {}
