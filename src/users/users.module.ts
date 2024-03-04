import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { Tag, TagSchema } from 'src/schemas/tag.schema';
import { CalendarEventSchema } from 'src/schemas/calendarEvent.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema}]),
        MongooseModule.forFeature([{ name: 'CalendarEvent', schema: CalendarEventSchema}]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
