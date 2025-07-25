import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Rating } from '@prisma/client';

@Injectable()
export class RatingsRepository {
  constructor(private prisma: PrismaService) {}

  async upsertRating(
    userId: number,
    movieId: number,
    score: number,
  ): Promise<Rating> {
    return this.prisma.rating.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: {
        score,
        updatedAt: new Date(),
      },
      create: {
        userId,
        movieId,
        score,
      },
    });
  }

  async updateMovieAverageRating(movieId: number): Promise<void> {
    // SELECT AVG(score) as "_avg_score", COUNT(score) as "_count_score" FROM "Rating"  WHERE "movieId" = $1
    const result = await this.prisma.rating.aggregate({
      where: { movieId },
      _avg: { score: true },
      _count: { score: true },
    });

    const avgScore = result._avg.score;
    const ratingCount = result._count.score;

    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        avgRatingScore: avgScore,
        ratingCount: ratingCount,
      },
    });
  }
}
