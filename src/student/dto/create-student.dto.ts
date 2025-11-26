import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateStudentDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsNumber()
    id_career: number;

    @IsNumber()
    id_cycle: number;
}