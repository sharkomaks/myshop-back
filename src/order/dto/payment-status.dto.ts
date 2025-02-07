class AmountPayment {
	value: string;
	currency: string;
}

class PaymentMethod {
	type: string;
	id: string;
	saved: boolean;
	title: string;
	card: object;
}

class ObjectPayment {
	id: string;
	status: string;
	amount: AmountPayment;
	payment_method: PaymentMethod;
	created_at: string;
	updated_at: string;
	description: string;
}

export class PaymentStatusDto {
	event: 'payment.succeeded' | 'payment.waiting_for_capture' | 'payment.canceled' | 'refund.succeeded';
	type: string;
	object: ObjectPayment;
}
