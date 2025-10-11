import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateCarreraDto {
    @ApiProperty({
        description: "Name of the career",
        example: "software development"
    })
    @IsString()
    nombre: string;         
    
    @ApiProperty({
        description: "Total of the cycles in the career",
        example: 4
    })
    @IsNumber()
    totalCiclos: number;  
    
    @ApiProperty({
        description: "Total duration of the career (e.g., '6 years' or '12 semesters')",
        example: "6 years" 
    })
    @IsString() 
    duracion: string;
}