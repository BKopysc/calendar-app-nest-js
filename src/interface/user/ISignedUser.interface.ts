import { ISimpleUser } from "./ISimpleUser.interface";

export interface ISignedUser extends ISimpleUser {
    authorized: {
        accessToken: string;
        tokenType: string;
        expiresIn: string;
    };
}