import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { InputTagDto } from 'src/dto/tag/input-tag.dto';
import { ISimpleTag } from 'src/interface/tag/ITag.interface';
import { CalendarEvent } from 'src/schemas/calendarEvent.schema';
import { Tag } from 'src/schemas/tag.schema';

@Injectable()
export class TagsService {
    constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>,
        @InjectModel(CalendarEvent.name) private calendarEventModel: Model<CalendarEvent>) { }

    public async getAllTags(userId: string): Promise<ISimpleTag[]> {
        const tags = await this.tagModel.find({ userId: userId }).exec();
        const simpleTags: ISimpleTag[] = []
        tags.forEach(tag => {
            const simpleTag: ISimpleTag = {
                id: tag._id.toString(),
                name: tag.name,
                color: tag.color,
                createdAt: tag.createdAt,
                updatedAt: tag.updatedAt
            }
            simpleTags.push(simpleTag);
        });
        return simpleTags;
    }

    public async getTagById(userId: string, tagId: string): Promise<ISimpleTag> {
        const tag = await this.tagModel.findOne({ userId: userId, _id: tagId }).exec();

        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
        }

        if (tag.userId.toString() !== userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        const simpleTag: ISimpleTag = {
            id: tag._id.toString(),
            name: tag.name,
            color: tag.color,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
        }
        return simpleTag;
    }

    public async createTag(userId: string, inputTagDto: InputTagDto): Promise<ISimpleTag> {
        //check if tag exists
        const foundTag = await this.findOneTagByName(userId, inputTagDto.name);
        if (foundTag) {
            throw new HttpException('Tag already exists', HttpStatus.CONFLICT);
        }

        //create tag
        inputTagDto.userId = userId;
        const tag = new this.tagModel(inputTagDto);
        const savedTag = await tag.save();

        const simpleSavedTag: ISimpleTag = {
            id: savedTag._id.toString(),
            name: savedTag.name,
            color: savedTag.color,
            createdAt: savedTag.createdAt,
            updatedAt: savedTag.updatedAt
        }

        return simpleSavedTag;
    }

    public async findOneTagByName(userId: string, name: string): Promise<ISimpleTag> {
        const tag = await this.tagModel.findOne({ userId: userId, name: name }).exec();
        if (!tag) {
            return undefined;
        }
        const simpleTag: ISimpleTag = {
            id: tag._id.toString(),
            name: tag.name,
            color: tag.color,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
        }
        return simpleTag;
    }

    public async editTag(userId: string, tagId: string, inputTagDto: InputTagDto): Promise<ISimpleTag> {
        //find tag by id
        const tag = await this.tagModel.findById(tagId).exec();
        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
        }

        if (tag.userId.toString() !== userId) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        //check if tag exists
        const foundTag = await this.findOneTagByName(userId, inputTagDto.name);
        if (foundTag && foundTag.id !== tagId) {
            throw new HttpException('Tag with that name already exists', HttpStatus.CONFLICT);
        }

        //update tag
        tag.name = inputTagDto.name;
        tag.color = inputTagDto.color;
        const savedTag = await tag.save();

        const simpleSavedTag: ISimpleTag = {
            id: savedTag._id.toString(),
            name: savedTag.name,
            color: savedTag.color,
            createdAt: savedTag.createdAt,
            updatedAt: savedTag.updatedAt
        }

        return simpleSavedTag;
    }

    public async deleteTagById(userId: string, tagId: string): Promise<boolean> {
        const tag = await this.tagModel.findOneAndDelete({ userId: userId, _id: tagId }).exec();
        if (!tag) {
            throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
        }

        //update calendar events
        const calEvents = await this.calendarEventModel.find({ userId: userId }).exec();
        const bulkUpdateOps = []; // bulk update operations for CalendarEvent

        console.log("fetching calEvents")

        calEvents.forEach(calEvent => {
            const index = calEvent.tagsIds.indexOf(new mongoose.Types.ObjectId(tagId));
            if (index > -1) {
                const newTagsIds = calEvent.tagsIds.splice(index, 1);
                bulkUpdateOps.push({
                    updateOne: {
                        filter: { _id: calEvent._id },
                        update: { $set: { tagsIds: newTagsIds } }
                    }
                });
            }
        });

        console.log("bulkUpdateOps. len", bulkUpdateOps.length);

        if (bulkUpdateOps.length > 0) {
            await this.calendarEventModel.bulkWrite(bulkUpdateOps);
        }

        return true;
    }

}
