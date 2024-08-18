/* Specific customer instance data */
export enum CustomerId {
	TypeA,
	TypeB,
	TypeC,
	TypeD,
	TypeE,
	TypeF
}

export interface CustomerInterface {
	spriteKeys: {
		walk: string;
		sit: string;
	};
	walkSpeed: number; // Speed of the customer walking
	workMultiplier: number; // Penalty multiplier for work (bigger is slower)
	tags:string[];
	antitags:string[];
	budget:number;
	baseTips: number,
}

export const CustomerData: { [key in CustomerId]: CustomerInterface } = {
	[CustomerId.TypeA]: {
		spriteKeys: {
			walk: "raptor",
			sit: "raptor",
		},
		walkSpeed: 1,
		workMultiplier: 1,
		tags:["raptor","meat","fluffy"],
		antitags:["veggie","healthy","horny","cold","weird"],
		budget:100,
		baseTips:10,
	},
	[CustomerId.TypeB]: {
		spriteKeys: {
			walk: "triceratops",
			sit: "triceratops",
		},
		walkSpeed: 3,
		workMultiplier: 3,
		tags:["triceratops","veggie","healthy","stinky"],
		antitags:["meat","fluffy","horny","tech","nerd"],
		budget:150,
		baseTips:10,
	},
	[CustomerId.TypeC]: {
		spriteKeys: {
			walk: "protogen",
			sit: "protogen",
		},
		walkSpeed: 1.5,
		workMultiplier: 1.5,
		tags:["protogen","nerd","tech"],
		antitags:["meat","veggie","weeb","chocolate"],
		budget:150,
		baseTips:15,
	},
	[CustomerId.TypeD]: {
		spriteKeys: {
			walk: "dragon",
			sit: "dragon",
		},
		walkSpeed: 5,
		workMultiplier: 5,
		tags:["dragon","horny","creamy"],
		antitags:["veggie","cold","ball","nerd","tech"],
		budget:999,
		baseTips:50,
	},
	[CustomerId.TypeE]: {
		spriteKeys: {
			walk: "lugia",
			sit: "lugia",
		},
		walkSpeed: 3.5,
		workMultiplier: 3.5,
		tags:["lugia","cold","ball"],
		antitags:["meat","gluten","tech","nerd","sweet","chocolate"],
		budget:750,
		baseTips:20,
	},
	[CustomerId.TypeF]: {
		spriteKeys: {
			walk: "boykisser",
			sit: "boykisser",
		},
		walkSpeed: 2,
		workMultiplier: 2,
		tags:["boykisser","weeb","sweet","horny","creamy"],
		antitags:["veggie","stinky","cold","ball"],
		budget:500,
		baseTips:15,
	},
};

/*
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
*/