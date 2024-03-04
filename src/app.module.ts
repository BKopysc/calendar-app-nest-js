import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { TagsController } from './tags/tags.controller';
import { CalendarEventsController } from './calendar-events/calendar-events.controller';
import { UsersService } from './users/users.service';
import { TagsService } from './tags/tags.service';
import { CalendarEventsService } from './calendar-events/calendar-events.service';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [TagsModule, UsersModule, CalendarEventsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        dbName: config.get<string>('DB_NAME'),
      }),
    }),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
