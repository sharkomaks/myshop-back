import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ColorDto } from './dto/color.dto';

@Injectable()
export class ColorService {
	constructor(private prisma: PrismaService) {}

	async getByStoreId(storeId: string) {
		return this.prisma.color.findMany({
			where: {
				storeId
			}
		});
	}

	async getById(colorId: string) {
		const color = await this.prisma.color.findUnique({
			where: { id: colorId }
		});

		if (!color) throw new NotFoundException('Цвет не найден');

		return color;
	}

	async create(storeId: string, dto: ColorDto) {
		return this.prisma.color.create({
			data: {
				...dto,
				storeId
			}
		});
	}

	async update(colorId: string, dto: ColorDto) {
		await this.getById(colorId);

		return this.prisma.color.update({
			where: { id: colorId },
			data: dto
		});
	}

	async delete(colorId: string) {
		await this.getById(colorId);

		return this.prisma.color.delete({
			where: { id: colorId }
		});
	}
}
