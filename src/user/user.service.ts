import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { hash } from 'argon2';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id
			},
			include: {
				stores: true,
				orders: true,
				favorites: {
					include: {
						category: true
					}
				}
			}
		});
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email
			},
			include: {
				stores: true,
				favorites: true,
				orders: true
			}
		});
	}

	async toggleFavorites(productId: string, userId: string) {
		const user = await this.getById(userId);
		if (!user) throw new NotFoundException('Пользователь не найден');

		const isExisted = user.favorites.some(product => product.id === productId);

		await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				favorites: {
					[isExisted ? 'disconnect' : 'connect']: {
						id: productId
					}
				}
			}
		});
		return true;
	}

	async create(dto: AuthDto) {
		return this.prisma.user.create({
			data: {
				...dto,
				password: await hash(dto.password)
			}
		});
	}
}
