import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

  // private md5(password: string): string {
  //   return crypto.createHash('md5').update(password).digest('hex');
  // }

  async register(username: string, password: string): Promise<any> {
    if (username.length < 3) {
    throw new BadRequestException('Username too short');
  }
    console.log('Registering user:', username);
    const hashed = await this.hashPassword(password);
    const user = this.userRepository.create({ username, password: hashed });
    const saved = await this.userRepository.save(user);
    const token = jwt.sign({ userId: saved.id, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token, userId: saved.id };
  }

  async login(username: string, password: string): Promise<any> {
  const user = await this.userRepository.findOne({ 
    where: { username },
    select: ['id', 'username', 'password']
  });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) return null;

  console.log('User logged in:', username);
  const token = jwt.sign({ userId: user.id, username }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return { token, userId: user.id };
}

  async refreshToken(token: string) {
    const payload = this.verifyToken(token);
    if (!payload) {
      return null;
    }
    const newToken = jwt.sign({ userId: payload.userId, username: payload.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return { token: newToken };
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return null;
    }
  }
}
