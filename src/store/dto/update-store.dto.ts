import { CreateStoreDto } from './create-store.dto';
import { IsString } from 'class-validator';

export class UpdateStoreDto extends CreateStoreDto {
	@IsString({
		message: 'Описание обязательно'
	})
	description: string;
}
