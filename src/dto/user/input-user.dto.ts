import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { IUser } from "src/interface/user/IUser.inteface";

export class InputUserDto {
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

}