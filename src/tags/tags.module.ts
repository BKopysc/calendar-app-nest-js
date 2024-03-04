import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Tag, TagSchema } from 'src/schemas/tag.schema';
import { CalendarEventSchema } from 'src/schemas/calendarEvent.schema';

@Module({
    controllers: [TagsController],
    providers: [TagsService],
    imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([{ name: 'CalendarEvent', schema: CalendarEventSchema}])],
    exports: [TagsService]
})
export class TagsModule {}
