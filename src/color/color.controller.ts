import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ColorService } from './color.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ColorDto } from './dto/color.dto';

@Controller('colors')
export class ColorController {
	constructor(private readonly colorService: ColorService) {}

	@Auth()
	@Get('by-storeId/:storeId')
	async getByStoreId(@Param('storeId') storeId: string) {
		return this.colorService.getByStoreId(storeId);
	}

	@Auth()
	@Get('by-id/:id')
	async getById(@Param('id') colorId: string) {
		return this.colorService.getById(colorId);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Post(':storeId')
	async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
		return this.colorService.create(storeId, dto);
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@Put(':id')
	async update(@Param('id') colorId: string, @Body() dto: ColorDto) {
		return this.colorService.update(colorId, dto);
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') colorId: string) {
		return this.colorService.delete(colorId);
	}
}
