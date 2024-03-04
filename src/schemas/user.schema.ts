import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, now } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

    _id: Types.ObjectId;

    @Prop()
    username: string;
    
    @Prop()
    password: string;

    createdAt: Date;
    updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);