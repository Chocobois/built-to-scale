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
	SmallRed,
	SmallAqua,
	SmallGreen,
	MediumRed,
	MediumAqua,
	MediumGreen,
	LargeRed,
	LargeAqua,
	LargeGreen,
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
	[CustomerId.SmallRed]: {
		tier: 1,
		spriteKeys: {
			walk: [
				"small_customer_walk1_red",
				"small_customer_walk2_red",
				"small_customer_walk1_red",
				"small_customer_walk3_red",
			],
			sit: "small_customer_sit1_red",
		},
		spriteScale: 1.0,
		walkSpeed: 3,
		workMultiplier: 1,
		tags: ["red", "kobold"],
		antitags: ["aqua", "green", "dino", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.SmallAqua]: {
		tier: 1,
		spriteKeys: {
			walk: [
				"small_customer_walk1_aqua",
				"small_customer_walk2_aqua",
				"small_customer_walk1_aqua",
				"small_customer_walk3_aqua",
			],
			sit: "small_customer_sit1_aqua",
		},
		spriteScale: 1.0,
		walkSpeed: 3,
		workMultiplier: 1,
		tags: ["aqua", "kobold"],
		antitags: ["red", "green", "dino", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.SmallGreen]: {
		tier: 1,
		spriteKeys: {
			walk: [
				"small_customer_walk1_green",
				"small_customer_walk2_green",
				"small_customer_walk1_green",
				"small_customer_walk3_green",
			],
			sit: "small_customer_sit1_green",
		},
		spriteScale: 1.0,
		walkSpeed: 3,
		workMultiplier: 1,
		tags: ["green", "kobold"],
		antitags: ["red", "aqua", "dino", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.MediumRed]: {
		tier: 2,
		spriteKeys: {
			walk: [
				"medium_customer_walk1_red",
				"medium_customer_walk2_red",
				"medium_customer_walk1_red",
				"medium_customer_walk3_red",
			],
			sit: "medium_customer_sit1_red",
		},
		spriteScale: 1.4,
		walkSpeed: 2,
		workMultiplier: 2,
		tags: ["red", "dino"],
		antitags: ["aqua", "green", "kobold", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.MediumAqua]: {
		tier: 2,
		spriteKeys: {
			walk: [
				"medium_customer_walk1_aqua",
				"medium_customer_walk2_aqua",
				"medium_customer_walk1_aqua",
				"medium_customer_walk3_aqua",
			],
			sit: "medium_customer_sit1_aqua",
		},
		spriteScale: 1.4,
		walkSpeed: 2,
		workMultiplier: 2,
		tags: ["aqua", "dino"],
		antitags: ["red", "green", "kobold", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.MediumGreen]: {
		tier: 2,
		spriteKeys: {
			walk: [
				"medium_customer_walk1_green",
				"medium_customer_walk2_green",
				"medium_customer_walk1_green",
				"medium_customer_walk3_green",
			],
			sit: "medium_customer_sit1_green",
		},
		spriteScale: 1.4,
		walkSpeed: 2,
		workMultiplier: 2,
		tags: ["green", "dino"],
		antitags: ["red", "aqua", "kobold", "dragon"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.LargeRed]: {
		tier: 3,
		spriteKeys: {
			walk: [
				"large_customer_walk1_red",
				"large_customer_walk2_red",
				"large_customer_walk1_red",
				"large_customer_walk3_red",
			],
			sit: "large_customer_sit1_red",
		},
		spriteScale: 1.7,
		walkSpeed: 1.5,
		workMultiplier: 3,
		tags: ["red", "dragon"],
		antitags: ["aqua", "green", "kobold", "dino"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.LargeAqua]: {
		tier: 3,
		spriteKeys: {
			walk: [
				"large_customer_walk1_aqua",
				"large_customer_walk2_aqua",
				"large_customer_walk1_aqua",
				"large_customer_walk3_aqua",
			],
			sit: "large_customer_sit1_aqua",
		},
		spriteScale: 1.7,
		walkSpeed: 1.5,
		workMultiplier: 3,
		tags: ["aqua", "dragon"],
		antitags: ["red", "green", "kobold", "dino"],
		budget: 100,
		baseTips: 10,
	},
	[CustomerId.LargeGreen]: {
		tier: 3,
		spriteKeys: {
			walk: [
				"large_customer_walk1_green",
				"large_customer_walk2_green",
				"large_customer_walk1_green",
				"large_customer_walk3_green",
			],
			sit: "large_customer_sit1_green",
		},
		spriteScale: 1.7,
		walkSpeed: 1.5,
		workMultiplier: 3,
		tags: ["green", "dragon"],
		antitags: ["red", "aqua", "kobold", "dino"],
		budget: 100,
		baseTips: 10,
	},
};
