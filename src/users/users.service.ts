import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUserProfile(userId: number): Promise<UserProfileDto> {
    const userProfile =
      await this.usersRepository.findUserWithRatedMovies(userId);
    if (!userProfile) {
      throw new NotFoundException(`User with ID ${userId} does not exist`);
    }
    return userProfile as UserProfileDto;
  }
}
