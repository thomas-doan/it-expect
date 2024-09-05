import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmailAndGetPassword(email: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'password', 'role'],
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`); // 404
    }
    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`); // 404
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered'); // 409
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return user; // 201 Created
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`); // 404
    }
    return this.userRepository.save(user); // 200 OK
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} does not exist`); // 404
    }
    return this.userRepository.remove(user); // 200 OK
  }
}
