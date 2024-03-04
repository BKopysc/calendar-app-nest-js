import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CalendarEventsService } from './calendar-events.service';
import { AuthGuard } from 'src/authentication/auth.guard';
import { ICalendarEvent } from 'src/interface/calendar-event/ICalendarEvent.interface';
import { ICalendarEventQueryParams } from 'src/interface/calendar-event/ICalendarEventQueryParams.interface';
import { InputCalendarEventDto } from 'src/dto/calendarEvent/input-calendarEvent.dto';

@Controller('calendar-events')
export class CalendarEventsController {
    constructor(private readonly calendarEventsService: CalendarEventsService) { }

    @UseGuards(AuthGuard)
    @Get()
    async getAllCalendarEvents(@Query() query: ICalendarEventQueryParams, @Req() request, @Res() response): Promise<ICalendarEvent[]> {
        try {
            const builderQuery: ICalendarEventQueryParams = {
                start: query.start,
                end: query.end,
                parsedTagsIds: query.tagsIds ? query.tagsIds.split(',') : []
            }
            const calendarEvents = await this.calendarEventsService.getAllCalendarEventsByParams(request['jwtUser'].id, builderQuery);
            return response.status(200).json(calendarEvents);
        } catch (error) {
            console.log(error);

            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(400).json({
                statusCode: 400,
                message: 'Error: calendar events not found'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    async getCalendarEventById(@Req() request, @Res() response, @Param('id') id: string): Promise<ICalendarEvent> {
        try {
            const calendarEvent = await this.calendarEventsService.getCalendarEventById(request['jwtUser'].id, id);
            return response.status(200).json(calendarEvent);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(400).json({
                statusCode: 400,
                message: 'Error: calendar event not found'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    async createCalendarEvent(@Req() request, @Res() response, @Body() inputCalendarEventDto: InputCalendarEventDto): Promise<ICalendarEvent> {
        try {
            const userId = request['jwtUser'].id;
            const calendarEvent = await this.calendarEventsService.createCalendarEvent(userId, inputCalendarEventDto);
            return response.status(201).json(calendarEvent);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(400).json({
                statusCode: 400,
                message: 'Error: calendar event not created'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    async updateCalendarEvent(@Req() request, @Res() response, @Param('id') id: string, @Body() inputCalendarEventDto: InputCalendarEventDto): Promise<ICalendarEvent> {
        try {
            const userId = request['jwtUser'].id;
            const calendarEvent = await this.calendarEventsService.updateCalendarEvent(userId, id, inputCalendarEventDto);
            return response.status(200).json(calendarEvent);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(400).json({
                statusCode: 400,
                message: 'Error: calendar event not updated'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    async deleteCalendarEvent(@Req() request, @Res() response, @Param('id') id: string): Promise<boolean> {
        try {
            const userId = request['jwtUser'].id;
            const isDeleted = await this.calendarEventsService.deleteCalendarEvent(userId, id);
            return response.status(200).json(isDeleted);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(400).json({
                statusCode: 400,
                message: 'Error: calendar event not deleted'
            });
        }
    }

}
