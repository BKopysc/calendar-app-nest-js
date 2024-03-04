import { ObjectId } from "mongoose";

export interface ISimpleTag {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITag extends ISimpleTag {
    userId: ObjectId;
}