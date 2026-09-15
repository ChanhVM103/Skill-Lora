import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema.js';

export interface SafeUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(input: {
    email: string;
    fullName: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<SafeUser> {
    const existingUser = await this.userModel.exists({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.userModel.create({
      email: input.email.toLowerCase(),
      fullName: input.fullName,
      passwordHash: input.passwordHash,
      role: input.role ?? UserRole.Student,
    });

    return this.toSafeUser(user);
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+passwordHash').exec();
  }

  async findById(id: string): Promise<SafeUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await this.userModel.findById(id).exec();
    return user ? this.toSafeUser(user) : null;
  }

  toSafeUser(user: UserDocument): SafeUser {
    return {
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
