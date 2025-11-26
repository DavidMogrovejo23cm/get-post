import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTeacherDto {
    @IsString()
    first_name: string;
    @IsString()
    last_name: string;
    @IsEmail()
    email: string;
    @IsOptional()
    phone?: string;
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
    @IsNumber()
    id_specialty: number;
}