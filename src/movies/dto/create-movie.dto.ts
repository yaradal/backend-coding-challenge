import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'The Matrix',
    description: 'Movie title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A movie about the matrix.',
    description: 'Movie description (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 1999,
    description: 'Movie release year (between 1900 and current year + 10)',
    minimum: 1900,
    maximum: new Date().getFullYear() + 10,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  releaseYear: number;

  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Movie genre',
  })
  @IsString()
  genre: string;
}
