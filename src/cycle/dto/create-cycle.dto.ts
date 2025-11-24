import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCycleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}