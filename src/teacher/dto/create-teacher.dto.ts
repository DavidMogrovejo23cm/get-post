import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTeacherDto {
    @IsString()
    first_name: string;
    @IsString()
    last_name: string;
    @IsEmail()
    email: string;
    @IsOptional()
    phone?: string;
    @IsNumber()
    id_specialty: number;
}