import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';

@Module({
	controllers: [OrderController],
	providers: [OrderService, PrismaService]
})
export class OrderModule {}
