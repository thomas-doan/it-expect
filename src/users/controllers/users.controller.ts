import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../auth/models/roles.model';
import { CreateAdminDto, CreateUserDto, UpdateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'create a user with customer role' })
  @ApiResponse({
    status: HttpStatus.CREATED, // 201 Created
    type: CreateUserDto,
  })
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'create a user with admin role' })
  @ApiResponse({
    status: HttpStatus.CREATED, // 201 Created
    type: CreateAdminDto,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.CREATED)
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.create(createAdminDto);
  }

  @ApiResponse({
    status: HttpStatus.OK, // 200 OK
    isArray: true,
    type: CreateUserDto,
  })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK, // 200 OK
    type: CreateUserDto,
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
