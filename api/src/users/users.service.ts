import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User, UserDocument } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const email = createUserDto.email.toLowerCase().trim();

    const emailInUse = await this.userModel.exists({ email });
    if (emailInUse) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    return this.userModel.create({
      name: createUserDto.name,
      email,
      password: passwordHash,
    });
  }

  async findAll() {
    const listUsers = await this.userModel.find({
      deletedAt: null,
    });

    if (listUsers.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    return listUsers;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.exists({ _id: id, deletedAt: null });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email) {
      //ne :  busca usuario e ignora o id do usuarioq ue esta
      // sendo atualizadopara não dar conflito com ele mesmo
      const emailInUse = await this.userModel.exists({
        email: updateUserDto.email,
        _id: { $ne: id },
      });

      if (emailInUse) {
        throw new ConflictException('Este e-mail já está cadastrado');
      }
    }

    const data = {
      ...updateUserDto,
      ...(updateUserDto.password && {
        password: await bcrypt.hash(updateUserDto.password, 10),
      }),
    };

    return this.userModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    );
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userModel.updateOne({ _id: id }, { deletedAt: new Date() });
    return `Usuario com id ${id} foi removido com sucesso`;
  }
}
