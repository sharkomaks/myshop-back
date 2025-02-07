import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ReviewDto } from './dto/review.dto';
import { CurrentUser } from '../user/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Auth()
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.reviewService.getByStoreId(storeId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Post(':productId/:storeId')
	async create(
		@CurrentUser('id') userId: string,
		@Param('productId') productId: string,
		@Param('storeId') storeId: string,
		@Body() dto: ReviewDto
	) {
		return this.reviewService.create(userId, productId, storeId, dto);
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') reviewId: string, @CurrentUser('id') userId: string) {
		return this.reviewService.delete(reviewId, userId);
	}
}
