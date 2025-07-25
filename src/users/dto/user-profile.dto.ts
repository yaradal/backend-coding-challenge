import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    example: 1,
    description: 'Movie ID',
  })
  id: number;

  @ApiProperty({
    example: 'The Matrix',
    description: 'Movie title',
  })
  title: string;

  @ApiProperty({
    example: 'A movie about the matrix.',
    description: 'Movie description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 1999,
    description: 'Movie release year',
  })
  releaseYear: number;

  @ApiProperty({
    example: 'Sci-Fi',
    description: 'Movie genre',
  })
  genre: string;

  @ApiProperty({
    example: 8.5,
    description: 'Average rating score (1-10)',
    nullable: true,
  })
  avgRatingScore: number | null;

  @ApiProperty({
    example: 15,
    description: 'Number of ratings for this movie',
  })
  ratingCount: number;
}

export class RatingDto {
  @ApiProperty({
    example: 8,
    description: 'User rating score (1-10)',
    minimum: 1,
    maximum: 10,
  })
  score: number;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'When the rating was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: MovieDto,
    description: 'The movie that was rated',
  })
  movie: MovieDto;
}

export class UserProfileDto {
  @ApiProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username',
  })
  username: string;

  @ApiProperty({
    type: [RatingDto],
    description: 'List of movies rated by the user',
    example: [
      {
        score: 8,
        createdAt: '2024-01-15T10:30:00.000Z',
        movie: {
          id: 1,
          title: 'The Matrix',
          description: 'A computer hacker learns from mysterious rebels...',
          releaseYear: 1999,
          genre: 'Sci-Fi',
          avgRatingScore: 8.5,
          ratingCount: 15,
        },
      },
    ],
  })
  ratings: RatingDto[];
}
