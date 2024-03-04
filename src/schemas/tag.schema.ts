import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types, now } from "mongoose";

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true})
export class Tag {

    _id: Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    })
    userId: Types.ObjectId;

    @Prop()
    name: string;
    
    @Prop()
    color: string;

    createdAt: Date;
    updatedAt: Date;

}

export const TagSchema = SchemaFactory.createForClass(Tag);