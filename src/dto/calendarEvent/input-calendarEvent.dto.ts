import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class InputCalendarEventDto {

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description: string = '';

    @IsDateString()
    @IsNotEmpty()
    readonly start: Date;

    @IsDateString()
    @IsNotEmpty()
    readonly end: Date;

    @IsString({each: true})
    readonly tagsIds: string[];

    userId: string;
}