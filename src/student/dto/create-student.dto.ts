import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    id_career: number;

    @IsNumber()
    id_cycle: number;
}