import { ISimpleTag, ITag } from "../tag/ITag.interface";

export interface ICalendarEvent {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    createdAt: Date;
    updatedAt: Date;
    tags: ISimpleTag[];
}