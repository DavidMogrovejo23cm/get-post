import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateEspecialidadDto {
    @ApiProperty({
        description: "Nombre de la especialidad", 
        example: "Especializacion en desarrollo con react"
    })
    @IsString()
    nombre: string; 

    @ApiProperty({
        description: "Descripción de la especialidad", 
        example: "Uso de html, css, typescript"
    })
    @IsString()
    descripcion: string; 
}