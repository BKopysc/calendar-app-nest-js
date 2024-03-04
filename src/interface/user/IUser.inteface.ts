import { Document } from 'mongoose' ;

export interface IUser {
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {

}