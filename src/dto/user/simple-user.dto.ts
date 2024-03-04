import { ISimpleUser } from "src/interface/user/ISimpleUser.interface";

export class SimpleUserDto implements ISimpleUser {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}