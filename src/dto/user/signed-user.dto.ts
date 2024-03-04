import { ISignedUser } from "src/interface/user/ISignedUser.interface";

export class SignedUserDto implements ISignedUser {
    authorized: { accessToken: string; tokenType: string; expiresIn: string; };
    id: string;
    username: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}