import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'student@skillora.local' })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @ApiProperty({ enum: UserRole, example: UserRole.Student })
  @Prop({ enum: UserRole, default: UserRole.Student })
  role: UserRole;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
