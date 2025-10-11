import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCicloDto {
    @ApiProperty({
        description: "Name of the cycle",
        example: "2024 - 1"
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: "Description of the cycle (optional)",
        example: "First cycle of the 2024 academic year",
        required: false
    })
    @IsString()
    @IsOptional()
    descripcion?: string;
}