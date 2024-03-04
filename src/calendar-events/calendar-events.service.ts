import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InputCalendarEventDto } from 'src/dto/calendarEvent/input-calendarEvent.dto';
import { ICalendarEvent } from 'src/interface/calendar-event/ICalendarEvent.interface';
import { ICalendarEventQueryParams } from 'src/interface/calendar-event/ICalendarEventQueryParams.interface';
import { CalendarEvent } from 'src/schemas/calendarEvent.schema';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class CalendarEventsService {
    constructor(@InjectModel(CalendarEvent.name) private calendarEventModel: Model<CalendarEvent>,
        
        private tagsService: TagsService) { }

    public async getAllCalendarEventsByParams(userId: string, queryParams: ICalendarEventQueryParams): Promise<ICalendarEvent[]> {
        //Filter with query params

        if (queryParams.end < queryParams.start) {
            return [];
        }

        const queryBuild = {}
        queryBuild['userId'] = userId;
        if(queryParams.start) {
            queryBuild['start'] = {
                $gte: queryParams.start,
            }
        }
        if(queryParams.end) {
            queryBuild['end'] = {
                $lt: queryParams.end
            }
        }
        if(queryParams.parsedTagsIds?.length > 0) {
            console.log(queryParams.parsedTagsIds);
            queryBuild['tagsIds'] = {
                $in: queryParams.parsedTagsIds
            }
        }

        const calEvents = await this.calendarEventModel.find(queryBuild).exec();
        
        const calEventsArray = await this.createCalendarEventObjectsArray(calEvents, userId);

        return calEventsArray;
    }

    private async createCalendarEventObjectsArray(calEvents: CalendarEvent[], userId: string): Promise<ICalendarEvent[]> {
        const calEventsArray: ICalendarEvent[] = [];
        const fetchedTags = await this.tagsService.getAllTags(userId);

        calEvents.forEach(calEvent => {

            const calEventObj: ICalendarEvent = {
                id: calEvent._id.toString(),
                title: calEvent.title,
                description: calEvent.description,
                start: calEvent.start,
                end: calEvent.end,
                createdAt: calEvent.createdAt,
                updatedAt: calEvent.updatedAt,
                tags: []
            }

            calEvent.tagsIds.forEach(tagId => {
                const foundTag = fetchedTags.find(tag => tag.id === tagId.toString());
                if (foundTag) {
                    calEventObj.tags.push(foundTag);
                }
            });

            calEventsArray.push(calEventObj);
        });

        return calEventsArray;
    }

    public async getCalendarEventById(userId: string, eventId: string): Promise<ICalendarEvent> {
        const calEvent = await this.calendarEventModel.findOne({ userId: userId, _id: eventId }).exec();
        if (!calEvent) {
            throw new HttpException('Calendar event not found', HttpStatus.NOT_FOUND);
        }

        const calEventsArray = await this.createCalendarEventObjectsArray([calEvent], userId);

        return calEventsArray[0];
    }

    public async createCalendarEvent(userId: string, inputCalendarEventDto: InputCalendarEventDto): Promise<ICalendarEvent> {
        //Check if tags exist
        const tags = await this.tagsService.getAllTags(userId);
        const uniqueTagsIds = [...new Set(inputCalendarEventDto.tagsIds)];
        const foundTags = tags.filter(tag => uniqueTagsIds.includes(tag.id));
        
        //Check if tags from input 
        if (foundTags.length !== uniqueTagsIds.length) {
            throw new HttpException('Tags ids are not valid', HttpStatus.NOT_FOUND);
        }

        inputCalendarEventDto.userId = userId;
        const calEvent = new this.calendarEventModel(inputCalendarEventDto);
        const savedCalEvent = await calEvent.save();

        const calEventsArray = await this.createCalendarEventObjectsArray([savedCalEvent], userId);

        return calEventsArray[0];
    }

    public async updateCalendarEvent(userId: string, eventId: string, inputCalendarEventDto: InputCalendarEventDto): Promise<ICalendarEvent> {
        const calEvent = await this.calendarEventModel.findOne({ userId: userId, _id: eventId }).exec();
        if (!calEvent) {
            throw new HttpException('Calendar event not found', HttpStatus.NOT_FOUND);
        }

        calEvent.title = inputCalendarEventDto.title;
        calEvent.description = inputCalendarEventDto.description;
        calEvent.start = inputCalendarEventDto.start;
        calEvent.end = inputCalendarEventDto.end;
        calEvent.tagsIds = inputCalendarEventDto.tagsIds.map(tagId => new mongoose.Types.ObjectId(tagId));

        const savedCalEvent = await calEvent.save();

        const calEventsArray = await this.createCalendarEventObjectsArray([savedCalEvent], userId);

        return calEventsArray[0];
    }

    public async deleteCalendarEvent(userId: string, eventId: string): Promise<boolean> {
        const calEvent = await this.calendarEventModel.findOneAndDelete({ userId: userId, _id: eventId }).exec();
        if (!calEvent) {
            throw new HttpException('Calendar event not found', HttpStatus.NOT_FOUND);
        }

        return true;
    }
}
