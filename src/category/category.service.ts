import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	async getByStoreId(storeId: string) {
		return this.prisma.category.findMany({
			where: {
				storeId
			}
		});
	}

	async getById(categoryId: string) {
		const category = await this.prisma.category.findUnique({
			where: { id: categoryId }
		});

		if (!category) throw new NotFoundException('Категория не найдена');

		return category;
	}

	async create(storeId: string, dto: CategoryDto) {
		return this.prisma.category.create({
			data: {
				...dto,
				storeId
			}
		});
	}

	async update(categoryId: string, dto: CategoryDto) {
		await this.getById(categoryId);

		return this.prisma.category.update({
			where: { id: categoryId },
			data: dto
		});
	}

	async delete(categoryId: string) {
		await this.getById(categoryId);

		return this.prisma.category.delete({
			where: { id: categoryId }
		});
	}
}
