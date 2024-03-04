import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTimestampsConfig, Types, now } from "mongoose";

export type CalendarEventDocument = HydratedDocument<CalendarEvent>;

@Schema({ timestamps: true })
export class CalendarEvent {

    _id: Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    })
    userId: Types.ObjectId;

    @Prop({
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag'}]
    })
    tagsIds: Types.ObjectId[];

    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    start: Date;

    @Prop()
    end: Date;

    createdAt: Date;
    updatedAt: Date;

}

export const CalendarEventSchema = SchemaFactory.createForClass(CalendarEvent);