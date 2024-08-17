/* Specific customer instance data */

export enum CustomerId {
	Small,
	Medium,
	Large,
}

export interface CustomerInterface {
	spriteKeys: {
		walk: string;
		sit: string;
	};
	walkSpeed: number; // Speed of the customer walking
	workMultiplier: number; // Penalty multiplier for work (bigger is slower)
}

export const CustomerData: { [key in CustomerId]: CustomerInterface } = {
	[CustomerId.Small]: {
		spriteKeys: {
			walk: "small_customer_walk1",
			sit: "small_customer_sit1",
		},
		walkSpeed: 1,
		workMultiplier: 1,
	},
	[CustomerId.Medium]: {
		spriteKeys: {
			walk: "medium_customer_walk1",
			sit: "medium_customer_sit1",
		},
		walkSpeed: 2,
		workMultiplier: 2,
	},
	[CustomerId.Large]: {
		spriteKeys: {
			walk: "large_customer_walk1",
			sit: "large_customer_sit1",
		},
		walkSpeed: 3,
		workMultiplier: 3,
	},
};
