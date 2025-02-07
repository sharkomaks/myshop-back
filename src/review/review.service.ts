import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ReviewDto } from './dto/review.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class ReviewService {
	constructor(
		private prisma: PrismaService,
		private productService: ProductService
	) {}

	async getByStoreId(storeId: string) {
		return this.prisma.review.findMany({
			where: {
				storeId
			},
			include: {
				user: true
			}
		});
	}

	async getById(reviewId: string, userId: string) {
		const review = await this.prisma.review.findUnique({
			where: {
				id: reviewId,
				userId
			},
			include: {
				user: true
			}
		});

		if (!review) throw new NotFoundException('Отзыв не найден или вы не являетесь его владельцем');

		return reviewId;
	}

	async create(userId: string, productId: string, storeId: string, dto: ReviewDto) {
		await this.productService.getById(productId);

		return this.prisma.review.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId
					}
				},
				product: {
					connect: {
						id: productId
					}
				},
				store: {
					connect: {
						id: storeId
					}
				}
			}
		});
	}

	async delete(reviewId: string, userId: string) {
		await this.getById(reviewId, userId);

		return this.prisma.review.delete({
			where: {
				id: reviewId
			}
		});
	}
}
