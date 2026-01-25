import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { role: role as any, isActive: true },
      select: ['id', 'email', 'firstName', 'lastName', 'middleName', 'position', 'photoUrl', 'rating', 'ratingsCount', 'phone'],
      order: { rating: 'DESC' },
    });
  }

  async updateRating(userId: string, newRating: number): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    const totalRating = user.rating * user.ratingsCount + newRating;
    const newCount = user.ratingsCount + 1;
    const avgRating = totalRating / newCount;

    await this.usersRepository.update(userId, {
      rating: avgRating,
      ratingsCount: newCount,
    });
  }
}
