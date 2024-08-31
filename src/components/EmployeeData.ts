/* Employee category data */

export enum EmployeeType {
	Washbear,
	Tanuki,
	Bunny,
	Kobold,
	Cat,
	Human,
}

export interface EmployeeTypeInterface {
	name: string;
	spriteKeys: {
		idle: string;
		sing: string;
		walk: string[];
		work: string[];
	};
}

export const EmployeeTypeData: {
	[key in EmployeeType]: EmployeeTypeInterface;
} = {
	[EmployeeType.Washbear]: {
		name: "Washbear employee",
		spriteKeys: {
			idle: "worker",
			sing: "workerSing",
			walk: ["workerWalk1", "workerWalk2", "workerWalk3", "workerWalk2"],
			work: ["workerWork1", "workerWork2"],
		},
	},
	[EmployeeType.Tanuki]: {
		name: "Tanuki employee",
		spriteKeys: {
			idle: "workerAlt1",
			sing: "workerAlt1Sing",
			walk: [
				"workerAlt1Walk1",
				"workerAlt1Walk2",
				"workerAlt1Walk3",
				"workerAlt1Walk2",
			],
			work: ["workerAlt1Work1", "workerAlt1Work2"],
		},
	},
	[EmployeeType.Bunny]: {
		name: "Bunny employee",
		spriteKeys: {
			idle: "workerAlt2",
			sing: "workerAlt2Sing",
			walk: [
				"workerAlt2Walk1",
				"workerAlt2Walk2",
				"workerAlt2Walk3",
				"workerAlt2Walk2",
			],
			work: ["workerAlt2Work1", "workerAlt2Work2"],
		},
	},
	[EmployeeType.Kobold]: {
		name: "Kobold employee",
		spriteKeys: {
			idle: "workerAlt3",
			sing: "workerAlt3Sing",
			walk: [
				"workerAlt3Walk1",
				"workerAlt3Walk2",
				"workerAlt3Walk3",
				"workerAlt3Walk2",
			],
			work: ["workerAlt3Work1", "workerAlt3Work2"],
		},
	},
	[EmployeeType.Cat]: {
		name: "Cat employee",
		spriteKeys: {
			idle: "workerAlt4",
			sing: "workerAlt4Sing",
			walk: [
				"workerAlt4Walk1",
				"workerAlt4Walk2",
				"workerAlt4Walk3",
				"workerAlt4Walk2",
			],
			work: ["workerAlt4Work1", "workerAlt4Work2"],
		},
	},
	[EmployeeType.Human]: {
		name: "Human employee",
		spriteKeys: {
			idle: "player",
			sing: "player",
			walk: ["player"],
			work: ["player"],
		},
	},
};

/* Specific employee instance data */

export enum EmployeeId {
	Washbear_1,
	Washbear_2,
	Washbear_3,
	Tanuki_1,
	Tanuki_2,
	Tanuki_3,
	Bunny_1,
	Bunny_2,
	Bunny_3,
	Kobold_1,
	Kobold_2,
	Kobold_3,
	Cat_1,
	Cat_2,
	Cat_3,
	Human_1,
	Human_2,
	Human_3,
}

export interface EmployeeInterface {
	type: EmployeeType; // Employee type
	tier: number; // Tier number
	walkSpeed: number; // Speed of the employee walking
	workSpeed: number; // Speed of the employee working
	cost: number; // Cost to purchase that tier of employee
	upgradeTo?: EmployeeId; // Employee to upgrade to
}

export const EmployeeData: { [key in EmployeeId]: EmployeeInterface } = {
	[EmployeeId.Washbear_1]: {
		type: EmployeeType.Washbear,
		tier: 1,
		walkSpeed: 2,
		workSpeed: 1,
		cost: 300,
		upgradeTo: EmployeeId.Washbear_2,
	},
	[EmployeeId.Washbear_2]: {
		type: EmployeeType.Washbear,
		tier: 2,
		walkSpeed: 3,
		workSpeed: 1.25,
		cost: 400,
		upgradeTo: EmployeeId.Washbear_3,
	},
	[EmployeeId.Washbear_3]: {
		type: EmployeeType.Washbear,
		tier: 3,
		walkSpeed: 4,
		workSpeed: 1.5,
		cost: 800,
	},

	[EmployeeId.Tanuki_1]: {
		type: EmployeeType.Tanuki,
		tier: 1,
		walkSpeed: 2.5,
		workSpeed: 1,
		cost: 350,
		upgradeTo: EmployeeId.Tanuki_2,
	},
	[EmployeeId.Tanuki_2]: {
		type: EmployeeType.Tanuki,
		tier: 2,
		walkSpeed: 4,
		workSpeed: 1.125,
		cost: 475,
		upgradeTo: EmployeeId.Tanuki_3,
	},
	[EmployeeId.Tanuki_3]: {
		type: EmployeeType.Tanuki,
		tier: 3,
		walkSpeed: 5.5,
		workSpeed: 1.25,
		cost: 950,
	},

	[EmployeeId.Bunny_1]: {
		type: EmployeeType.Bunny,
		tier: 1,
		walkSpeed: 1,
		workSpeed: 1,
		cost: 375,
		upgradeTo: EmployeeId.Bunny_2,
	},
	[EmployeeId.Bunny_2]: {
		type: EmployeeType.Bunny,
		tier: 2,
		walkSpeed: 2.5,
		workSpeed: 1.5,
		cost: 525,
		upgradeTo: EmployeeId.Bunny_3,
	},
	[EmployeeId.Bunny_3]: {
		type: EmployeeType.Bunny,
		tier: 3,
		walkSpeed: 4,
		workSpeed: 2,
		cost: 1050,
	},

	[EmployeeId.Kobold_1]: {
		type: EmployeeType.Kobold,
		tier: 1,
		walkSpeed: 2,
		workSpeed: 1,
		cost: 600,
		upgradeTo: EmployeeId.Kobold_2,
	},
	[EmployeeId.Kobold_2]: {
		type: EmployeeType.Kobold,
		tier: 2,
		walkSpeed: 3.5,
		workSpeed: 1.5,
		cost: 900,
		upgradeTo: EmployeeId.Kobold_3,
	},
	[EmployeeId.Kobold_3]: {
		type: EmployeeType.Kobold,
		tier: 3,
		walkSpeed: 6,
		workSpeed: 2,
		cost: 1800,
	},

	[EmployeeId.Cat_1]: {
		type: EmployeeType.Cat,
		tier: 4,
		walkSpeed: 3,
		workSpeed: 1,
		cost: 800,
		upgradeTo: EmployeeId.Cat_2,
	},
	[EmployeeId.Cat_2]: {
		type: EmployeeType.Cat,
		tier: 2,
		walkSpeed: 6,
		workSpeed: 2,
		cost: 1600,
		upgradeTo: EmployeeId.Cat_3,
	},
	[EmployeeId.Cat_3]: {
		type: EmployeeType.Cat,
		tier: 3,
		walkSpeed: 9,
		workSpeed: 3,
		cost: 2400,
	},

	[EmployeeId.Human_1]: {
		type: EmployeeType.Human,
		tier: 1,
		walkSpeed: 4,
		workSpeed: 4,
		cost: 2500,
		upgradeTo: EmployeeId.Human_2,
	},
	[EmployeeId.Human_2]: {
		type: EmployeeType.Human,
		tier: 2,
		walkSpeed: 6,
		workSpeed: 6,
		cost: 5000,
		upgradeTo: EmployeeId.Human_3,
	},
	[EmployeeId.Human_3]: {
		type: EmployeeType.Human,
		tier: 3,
		walkSpeed: 9,
		workSpeed: 9,
		cost: 9999,
	},
};
