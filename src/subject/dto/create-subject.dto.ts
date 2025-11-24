import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubjectDto {
    @IsString()
    name: string;

    @IsNumber()
    id_career: number;

    @IsNumber()
    id_cycle: number;

    @IsNumber()
    @IsOptional()
    id_teacher?: number;
}