import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMateriaDto {
    @ApiProperty({
        description: "Nombre de la Materia",
        example: "Mathematics"
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: "ID de la carrera",
        example: 1
    })
    @IsNumber()
    id_carrera: number;

    @ApiProperty({
        description: "ID del ciclo",
        example: 1
    })
    @IsNumber()
    id_ciclo: number;

    @ApiProperty({
        description: "ID del Docente ",
        example: 1,
        required: false
    })
    @IsNumber()
    @IsOptional()
    id_docente?: number;
}