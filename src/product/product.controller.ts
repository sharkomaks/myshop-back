import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.productService.getAll(searchTerm);
	}

	@Auth()
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.productService.getByStoreId(storeId);
	}

	@Get('by-id/:id')
	async getById(@Param('id') id: string) {
		return this.productService.getById(id);
	}

	@Get('by-category/:categoryId')
	async getByCategory(@Param('categoryId') categoryId: string) {
		return this.productService.getByCategory(categoryId);
	}

	@Get('most-popular')
	async getMostPopular() {
		return this.productService.getMostPopular();
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(id);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Post(':storeId')
	async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
		return this.productService.create(storeId, dto);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(id, dto);
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.productService.delete(id);
	}
}
