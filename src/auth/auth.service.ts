import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { password, username, email } = authCredentialsDto;

    const salt = await genSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.salt = salt;
    try {
      await this.entityManager.save(newUser);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException(
          'The email or username is already taken. Please try another one!',
        );
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }

  async signIn(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentials);
    if (!username) throw new UnauthorizedException('Invalid credentials!');

    const payload: JwtPayload = { username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found!`);
    await this.entityManager.remove(user);
  }

  private async validateUserPassword(
    authCredentials: AuthCredentialsDto,
  ): Promise<string | null> {
    const { username, password } = authCredentials;
    const user = await this.userRepository.findOneBy({ username });
    if (user && (await user.validatePassword(password))) return user.username;
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }
}
