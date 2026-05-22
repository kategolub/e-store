import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  password?: string;

  @Prop({ required: true })
  name!: string;

  @Prop(String)
  avatar?: string;

  @Prop(String)
  googleId?: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role!: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
