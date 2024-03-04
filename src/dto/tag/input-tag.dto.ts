import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class InputTagDto {

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly color: string;
    
    userId: string;
}