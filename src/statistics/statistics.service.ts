import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	async getMainStatistics(storeId: string) {
		const totalRevenue = await this.calculateTotalRevenue(storeId);

		const productsCount = await this.countProducts(storeId);
		const categoriesCount = await this.countCategories(storeId);

		const averageRating = (await this.calculateAverageRating(storeId)) || 0;

		return [
			{ id: 1, name: 'Выручка', value: totalRevenue },
			{ id: 2, name: 'Товары', value: productsCount },
			{ id: 3, name: 'Категории', value: categoriesCount },
			{ id: 4, name: 'Средний рейтинг', value: averageRating }
		];
	}

	async getMiddleStatistics(storeId: string) {
		const monthlySales = await this.calculateMonthlySales(storeId);

		const lastUsers = await this.getLastUser(storeId);

		return { monthlySales, lastUsers };
	}

	private async calculateTotalRevenue(storeId: string) {
		const orders = await this.prisma.order.findMany({
			where: {
				items: {
					some: {
						store: {
							id: storeId
						}
					}
				}
			},
			include: {
				items: {
					where: {
						storeId
					}
				}
			}
		});

		return orders.reduce((acc, order) => {
			const total = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
			return acc + total;
		}, 0);
	}

	private async countProducts(storeId: string) {
		return this.prisma.product.count({
			where: { storeId }
		});
	}

	private async countCategories(storeId: string) {
		return this.prisma.category.count({
			where: { storeId }
		});
	}

	private async calculateAverageRating(storeId: string) {
		const averageRating = await this.prisma.review.aggregate({
			where: { storeId },
			_avg: { rating: true }
		});

		return averageRating._avg.rating;
	}

	private async calculateMonthlySales(storeId: string) {
		const startDate = dayjs().subtract(30, 'days').startOf('day').toDate();
		const endDate = dayjs().endOf('day').toDate();

		const salesRaw = await this.prisma.order.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate
				},
				items: {
					some: { storeId }
				}
			},
			include: { items: true }
		});

		const formatDate = (date: Date): string => {
			return `${date.getDate()} ${monthNames[date.getMonth()]}`;
		};

		const salesByDate = new Map<string, number>();

		salesRaw.forEach(order => {
			const formattedDate = formatDate(new Date(order.createdAt));

			const total = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

			if (salesByDate.has(formattedDate)) {
				salesByDate.set(formattedDate, salesByDate.get(formattedDate)! + total);
			} else {
				salesByDate.set(formattedDate, total);
			}
		});

		return Array.from(salesByDate, ([date, value]) => ({
			date,
			value
		}));
	}

	private async getLastUser(storeId: string) {
		const lastUsers = await this.prisma.user.findMany({
			where: {
				orders: {
					some: {
						items: { some: { storeId } }
					}
				}
			},
			orderBy: { createdAt: 'desc' },
			take: 5,
			include: {
				orders: {
					where: {
						items: { some: { storeId } }
					},
					include: {
						items: {
							where: { storeId },
							select: { price: true }
						}
					}
				}
			}
		});

		return lastUsers.map(user => {
			const lastOrder = user.orders[user.orders.length - 1];

			const total = lastOrder.items.reduce((acc, item) => acc + item.price, 0);

			return {
				id: user.id,
				name: user.name,
				email: user.email,
				picture: user.picture,
				total
			};
		});
	}
}
