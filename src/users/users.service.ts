import { HttpException, HttpStatus, Injectable, NotFoundException, Redirect } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { IUser, IUserDocument } from 'src/interface/user/IUser.inteface';
import { InputUserDto } from 'src/dto/user/input-user.dto';
import { ISimpleUser } from 'src/interface/user/ISimpleUser.interface';
import { CreateUserHashedDto } from 'src/dto/user/create-user-hashed.dto';
import { IException } from 'src/interface/user/IException.interface';
import * as bcrypt from 'bcrypt';
import { ISignedUser } from 'src/interface/user/ISignedUser.interface';
import { Tag } from 'src/schemas/tag.schema';
import { CalendarEvent } from 'src/schemas/calendarEvent.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<IUserDocument>,
        @InjectModel(Tag.name) private tagModel: Model<Tag>,
        @InjectModel(CalendarEvent.name) private calendarEventModel: Model<CalendarEvent>) {}

        async findAll(): Promise<IUserDocument[]> {
           return this.userModel.find().exec(); 
        }

        hashPassword(password: string): string {
            return password;
        }

        async create(createUserDto: CreateUserHashedDto): Promise<ISimpleUser> {
            
            const createdUser = new this.userModel(createUserDto);

            //Find if exists
            if(await this.checkIfUserExists(createdUser.username)) {
                return undefined;
            }

            const savedUser = await createdUser.save();

            const simpleUser: ISimpleUser = {
                id: savedUser._id,
                username: savedUser.username
            }

            return simpleUser;
        }

        public async updateUser(userId: string, inputUserDto: InputUserDto): Promise<ISimpleUser> {
            //find user by id
            const user = await this.userModel.findById(userId).exec();
            if(!user) {
                throw new NotFoundException();
            }

            //check if username is not taken
            const foundUsername = await this.userModel.findOne({username: inputUserDto.username}).exec();
            if(foundUsername && foundUsername._id.toString() !== userId){
                throw new HttpException('Username already taken', HttpStatus.CONFLICT);
            }

            //update user
            user.username = inputUserDto.username;
            const hashedPassword = await bcrypt.hash(inputUserDto.password, 10);
            user.password = hashedPassword;

            //save user
            const savedUser = await user.save();

            const simpleUser: ISimpleUser = {
                id: savedUser._id,
                username: savedUser.username
            }

            return simpleUser;
        }

        async findOne(username: string): Promise<IUserDocument> {
            return this.userModel.findOne({ username: username }).exec();
        }

        async checkIfUserExists(username: string): Promise<boolean> {
            const user = await this.findOne(username);
            if(user) {
                return true;
            }
            return false;
        }

        public async findOneById(id: string): Promise<IUserDocument> {
            return this.userModel.findById(id).exec();
        }

        public async remove(id: string): Promise<boolean> {
            const userDel = await this.userModel.findOneAndDelete({_id: id}).exec();
            if(!userDel) {
                throw new NotFoundException();
            }

            //find tags and delete them
            const tagDel = await this.tagModel.deleteMany({userId: id}).exec();

            //find calendar events and delete them
            const calEventDel = await this.calendarEventModel.deleteMany({userId: id}).exec();

            return true;

        }

}
