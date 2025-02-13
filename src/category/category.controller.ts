import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Auth()
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.categoryService.getByStoreId(storeId);
	}

	@Auth()
	@Get('by-id/:id')
	async getById(@Param('id') categoryId: string) {
		return this.categoryService.getById(categoryId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Post(':storeId')
	async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
		return this.categoryService.create(storeId, dto);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put(':id')
	async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
		return this.categoryService.update(categoryId, dto);
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') categoryId: string) {
		return this.categoryService.delete(categoryId);
	}
}
