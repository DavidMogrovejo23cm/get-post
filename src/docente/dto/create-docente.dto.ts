import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateDocenteDto {
    @ApiProperty({
        description: "Nombre del docente",
        example: "Juan"
    })
    @IsString()
    nombre: string;

    @ApiProperty({
        description: "Apellido del docente",
        example: "Pérez"
    })
    @IsString()
    apellido: string;

    @ApiProperty({
        description: "Email del docente",
        example: "juan.perez@example.com"
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Teléfono del docente",
        example: "1234567890",
        required: false 
    })
    @IsString()
    @IsOptional()
    telefono?: string;

    @ApiProperty({
        description: "ID de la especialidad del docente",
        example: 1
    })
    @IsNumber()
    id_especialidad: number;
}