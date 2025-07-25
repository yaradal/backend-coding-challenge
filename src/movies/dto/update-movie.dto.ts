import { IsInt, IsString, Max, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
  @ApiProperty({
    example: 'The Matrix Reloaded',
    description: 'Movie title (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Neo continues his journey to save humanity from the machines.',
    description: 'Movie description (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 2003,
    description:
      'Movie release year (between 1900 and current year + 10) (optional)',
    minimum: 1900,
    maximum: new Date().getFullYear() + 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  releaseYear?: number;

  @ApiProperty({
    example: 'Action',
    description: 'Movie genre (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  genre?: string;
}
