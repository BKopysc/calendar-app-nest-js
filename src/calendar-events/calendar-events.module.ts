import { Module } from '@nestjs/common';
import { CalendarEventsController } from './calendar-events.controller';
import { CalendarEventsService } from './calendar-events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarEventSchema } from 'src/schemas/calendarEvent.schema';
import { TagsModule } from 'src/tags/tags.module';

@Module({
    controllers: [CalendarEventsController],
    providers: [CalendarEventsService],
    imports: [MongooseModule.forFeature([{ name: 'CalendarEvent', schema: CalendarEventSchema }]),
        TagsModule]
})
export class CalendarEventsModule {
}
