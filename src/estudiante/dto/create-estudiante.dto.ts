import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateEstudianteDto {
    @ApiProperty({
        description: "Nombre del estudiante",
        example: "David"
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: "Apellido del estudiante",
        example: "Padilla"
    })
    @IsString()
    apellido: string;

    @ApiProperty({
        description:"Email del estudiante",
        example:"DavidPdilla@example.com"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description:"ID de la carrera",
        example: 1
    })
    @IsNumber()
    id_carrera: number;

    @ApiProperty({
        description:"ID del ciclo actual en el que se encuentra el estudiante",
        example: 3
    })
    @IsNumber()
    id_ciclo: number;
}