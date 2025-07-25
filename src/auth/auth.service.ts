import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from '../users/users.repository';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto;

    const existing = await this.usersRepository.findByEmail(email);
    if (existing) {
      this.logger.debug(`User already exists: ${email}`);
      return {
        message:
          'Registration successful. Please check your email for verification.',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    this.logger.debug(
      `User registered successfully: ${email} (ID: ${user.id})`,
    );
    return {
      message:
        'Registration successful. Please check your email for verification.',
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }

  login(id: number) {
    const payload = { sub: id };
    const token = this.jwtService.sign(payload);

    this.logger.debug(`Generating JWT token for user ID: ${id}`);
    return {
      access_token: token,
    };
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;
    return result;
  }
}
