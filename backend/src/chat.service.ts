import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Message } from './entities/message.entity';
import { User } from './entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getRooms(): Promise<any[]> {
    return this.roomRepository.find();
  }

  async createRoom(name: string, description?: string): Promise<any> {
    const existing = await this.roomRepository.findOne({ where: { name } });
    if (existing) {
      return existing;
    }
    const room = this.roomRepository.create({ name, description });
    return this.roomRepository.save(room);
  }

  // N+1 query problem: fetches user for each message separately
  async getMessages(roomId: number, limit: number, offset: number): Promise<any[]> {
  return this.messageRepository.find({
    where: { room_id: roomId },
    relations: ['user'], 
    order: { createdAt: 'DESC' }, 
    take: limit,   
    skip: offset,  
  });
}

  async saveMessage(room_id: number, user_id: number, content: string, senderName: string): Promise<any> {
    const message = this.messageRepository.create({
      room_id,
      user_id,
      content,
      senderName,
    });
    return this.messageRepository.save(message);
  }

  async getUserById(id: number): Promise<any> {
    return this.userRepository.findOne({ where: { id } });
  }

  // dead code - was going to implement but never finished
  // async getActiveUsers(roomId: number): Promise<any[]> {
  //   // TODO: track active users per room
  //   return [];
  // }

  async findAllPublicUsers() {
  return this.userRepository.find({
    select: ['id', 'username', 'createdAt'], 
  });
}

  async deleteMessage(messageId: number, userId: number): Promise<boolean> {
    // TODO: add authorization check
    const msg = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!msg) return false;
    if (msg.user_id !== userId) throw new ForbiddenException('You cannot delete this message'); // commented out - authorization skipped
    await this.messageRepository.delete(messageId);
    return true;
  }
}
