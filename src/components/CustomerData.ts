/* Specific customer instance data */
/*
export enum CustomerId {
	TypeA,
	TypeB,
	TypeC,
	TypeD,
	TypeE,
	TypeF
}
*/

export enum CustomerId {
	Small,
	Medium,
	Large,
}

export interface CustomerInterface {
	tier: number;
	spriteKeys: {
		walk: string[];
		sit: string;
	};
	spriteScale: number;
	walkSpeed: number; // Speed of the customer walking
	workMultiplier: number; // Penalty multiplier for work (bigger is slower)
	tags: string[];
	antitags: string[];
	budget: number;
	baseTips: number;
}

/*
export const CustomerData: { [key in CustomerId]: CustomerInterface } = {
	[CustomerId.TypeA]: {
		spriteKeys: {
			walk: ["raptor"],
			sit: "raptor",
		},
		spriteScale: 1.0,
		walkSpeed: 1,
		workMultiplier: 1,
		tags:["raptor","meat","fluffy"],
		antitags:["veggie","healthy","horny","cold","weird"],
		budget:100,
		baseTips:10,
	},
	[CustomerId.TypeB]: {
		spriteKeys: {
			walk: ["triceratops"],
			sit: "triceratops",
		},
		spriteScale: 1.0,
		walkSpeed: 3,
		workMultiplier: 3,
		tags:["triceratops","veggie","healthy","stinky"],
		antitags:["meat","fluffy","horny","tech","nerd"],
		budget:150,
		baseTips:10,
	},
	[CustomerId.TypeC]: {
		spriteKeys: {
			walk: ["protogen"],
			sit: "protogen",
		},
		spriteScale: 1.0,
		walkSpeed: 1.5,
		workMultiplier: 1.5,
		tags:["protogen","nerd","tech"],
		antitags:["meat","veggie","weeb","chocolate"],
		budget:150,
		baseTips:15,
	},
	[CustomerId.TypeD]: {
		spriteKeys: {
			walk: ["dragon"],
			sit: "dragon",
		},
		spriteScale: 1.0,
		walkSpeed: 5,
		workMultiplier: 5,
		tags:["dragon","horny","creamy"],
		antitags:["veggie","cold","ball","nerd","tech"],
		budget:999,
		baseTips:50,
	},
	[CustomerId.TypeE]: {
		spriteKeys: {
			walk: ["lugia"],
			sit: "lugia",
		},
		spriteScale: 1.0,
		walkSpeed: 3.5,
		workMultiplier: 3.5,
		tags:["lugia","cold","ball"],
		antitags:["meat","gluten","tech","nerd","sweet","chocolate"],
		budget:750,
		baseTips:20,
	},
	[CustomerId.TypeF]: {
		spriteKeys: {
			walk: ["boykisser"],
			sit: "boykisser",
		},
		spriteScale: 1.0,
		walkSpeed: 2,
		workMultiplier: 2,
		tags:["boykisser","weeb","sweet","horny","creamy"],
		antitags:["veggie","stinky","cold","ball"],
		budget:500,
		baseTips:15,
	},
};
*/

export const CustomerData: { [key in CustomerId]: CustomerInterface } = {
	[CustomerId.Small]: {
		tier: 1,
		spriteKeys: {
			walk: [
				"small_customer_walk1",
				"small_customer_walk2",
				"small_customer_walk1",
				"small_customer_walk3",
			],
			sit: "small_customer_sit1",
		},
		spriteScale: 1.0,
		walkSpeed: 3,
		workMultiplier: 1,
		tags: [],
		antitags: [],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.Medium]: {
		tier: 2,
		spriteKeys: {
			walk: [
				"medium_customer_walk1",
				"medium_customer_walk2",
				"medium_customer_walk1",
				"medium_customer_walk3",
			],
			sit: "medium_customer_sit1",
		},
		spriteScale: 1.4,
		walkSpeed: 2,
		workMultiplier: 2,
		tags: [],
		antitags: [],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.Large]: {
		tier: 3,
		spriteKeys: {
			walk: [
				"large_customer_walk1",
				"large_customer_walk2",
				"large_customer_walk1",
				"large_customer_walk3",
			],
			sit: "large_customer_sit1",
		},
		spriteScale: 1.7,
		walkSpeed: 1.5,
		workMultiplier: 3,
		tags: [],
		antitags: [],
		budget: 100,
		baseTips: 10,
	},
};
