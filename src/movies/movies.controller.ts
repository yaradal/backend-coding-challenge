import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateMovieDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOperation({ summary: 'Search movies by title' })
  @ApiResponse({ status: 200, description: 'Movies found successfully' })
  @ApiQuery({ name: 'title', description: 'Movie title to search for' })
  @Get('search')
  async searchByTitle(@Query('title') title: string) {
    return this.moviesService.searchByTitle(title);
  }

  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({ status: 200, description: 'Movie found successfully' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findById(id);
  }

  @ApiOperation({ summary: 'Update a movie' })
  @ApiResponse({ status: 200, description: 'Movie updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiBody({ type: UpdateMovieDto })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({ status: 200, description: 'Movie rated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiBody({ type: CreateRatingDto })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/rate')
  async rateMovie(
    @Param('id', ParseIntPipe) movieId: number,
    @Body() createRatingDto: CreateRatingDto,
    @Request() req: { user: { id: number } },
  ) {
    return this.moviesService.rateMovie(req.user.id, movieId, createRatingDto);
  }
}
