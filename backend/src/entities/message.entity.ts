import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity'; 
import { Room } from './room.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь с комнатой
  @ManyToOne(() => Room, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column()
  room_id: number; 

  // Связь с пользователем
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  senderName: string; 

  @CreateDateColumn()
  createdAt: Date;
}