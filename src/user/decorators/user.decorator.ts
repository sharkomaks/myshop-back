import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
	const request: { user: User } = ctx.switchToHttp().getRequest();
	const user = request.user;

	return data ? user[data] : user;
});
