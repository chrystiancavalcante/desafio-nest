/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User {
  _id: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: {
      street: { type: String, required: true },
      neighborhood: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    required: true,
  })
  address: {
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  @Prop()
  resetToken: string;

  @Prop()
  resetTokenExpires: Date;

  comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
