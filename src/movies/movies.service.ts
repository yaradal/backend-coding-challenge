import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Movie, Rating } from '@prisma/client';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { MoviesRepository } from './movies.repository';
import { RatingsRepository } from './ratings.repository';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    private moviesRepository: MoviesRepository,
    private ratingsRepository: RatingsRepository,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = await this.moviesRepository.create(createMovieDto);
    this.logger.debug(
      `Movie created successfully: ${movie.title} (ID: ${movie.id})`,
    );
    return movie;
  }

  async findById(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} does not exist`);
    }
    return movie;
  }

  async searchByTitle(title: string): Promise<Movie[]> {
    const movies = await this.moviesRepository.searchByTitle(title);
    return movies;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    // Verify movie exists
    await this.findById(id);
    const movie = await this.moviesRepository.update(id, updateMovieDto);

    this.logger.debug(`Movie updated successfully: ${movie.title} (ID: ${id})`);
    return movie;
  }

  async rateMovie(
    userId: number,
    movieId: number,
    createRatingDto: CreateRatingDto,
  ): Promise<Rating> {
    // Verify movie exists
    await this.findById(movieId);

    // Upsert the rating
    const rating = await this.ratingsRepository.upsertRating(
      userId,
      movieId,
      createRatingDto.score,
    );

    // Calculate and update the movie's average rating
    await this.ratingsRepository.updateMovieAverageRating(movieId);

    this.logger.debug(
      `Rating updated successfully: User ${userId}, Movie ${movieId}, Score ${createRatingDto.score}`,
    );
    return rating;
  }
}
