import { IsNumber, IsString } from "class-validator";

export class CreateCareerDto {
    @IsString()
    name: string;
    @IsString()
    totalCycles: string;
    @IsString()
    duration: string;
}