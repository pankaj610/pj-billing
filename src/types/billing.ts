export interface Customer {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	unique_code: string;
	lastVisit: string;
}

export const enum MetalType {
	GOLD = 'gold',
	SILVER = 'silver',
	ARTIFICIAL = 'artificial',
	STONE = 'stone',
}

export const enum ShowLabour {
	checked = 'checked',
	unchecked = 'unchecked',
}

export interface BillItem {
	item_name: string;
	price: number;
	quantity: number;
	discount: number;
	weight_in_gram: number;
	weight_in_milligram: number;
	labour: number;
	isShowLabour: ShowLabour;
	total: number;
	finalAmount: number;
	metalType: MetalType;
}

export interface Billing {
	datetime: number;
	isHideLabour: boolean;
	taxable: string;
	goldPrice: number;
	silverPrice: number;
	items: BillItem[];
	totalBeforeTax: number;
	totalAfterTax: number;
	tax: number;
	totalDiscount: number;
	discountReason: string;
	pdfLink: string;
}

export enum PaymentMode {
	CASH = 'CASH',
	UPI = 'UPI',
	CARD = 'CARD',
}

export enum PaymentType {
	PAID = 'paid',
	SALE = 'sale',
}

export interface Payment {
	datetime: string;
	mode: PaymentMode;
	amount: number;
	type: PaymentType;
	receipt_link: string;
}

export interface Stock {
	name: string;
	metalType: MetalType;
	quantity: number;
}

export interface MetalConfig {
	gold: {
		price: number;
		isManualAmountEnter: boolean;
		isWeightNeeded: boolean;
	};
	silver: {
		price: number;
		isManualAmountEnter: boolean;
		isWeightNeeded: boolean;
	};
	stone: {
		isManualAmountEnter: boolean;
		isWeightNeeded: boolean;
	};
	artificial: {
		isManualAmountEnter: boolean;
		isWeightNeeded: boolean;
	};
}
