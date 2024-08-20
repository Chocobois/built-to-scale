/* Employee category data */

export enum EmployeeType {
	RaccoonGray,
	RaccoonBrown,
	RaccoonYellow,
	RaccoonPurple,
	RaccoonGreen,
	Human, // Temporary. Replace with whatever.
}

export interface EmployeeTypeInterface {
	spriteKeys: {
		idle: string;
		walk: string[];
		work: string[];
	};
}

export const EmployeeTypeData: {
	[key in EmployeeType]: EmployeeTypeInterface;
} = {
	[EmployeeType.RaccoonGray]: {
		spriteKeys: {
			idle: "worker",
			walk: ["workerWalk1", "workerWalk2", "workerWalk3", "workerWalk2"],
			work: ["workerWork1", "workerWork2"],
		},
	},
	[EmployeeType.RaccoonBrown]: {
		spriteKeys: {
			idle: "workerAlt1",
			walk: [
				"workerAlt1Walk1",
				"workerAlt1Walk2",
				"workerAlt1Walk3",
				"workerAlt1Walk2",
			],
			work: ["workerAlt1Work1", "workerAlt1Work2"],
		},
	},
	[EmployeeType.RaccoonYellow]: {
		spriteKeys: {
			idle: "workerAlt2",
			walk: [
				"workerAlt2Walk1",
				"workerAlt2Walk2",
				"workerAlt2Walk3",
				"workerAlt2Walk2",
			],
			work: ["workerAlt2Work1", "workerAlt2Work2"],
		},
	},
	[EmployeeType.RaccoonPurple]: {
		spriteKeys: {
			idle: "workerAlt3",
			walk: [
				"workerAlt3Walk1",
				"workerAlt3Walk2",
				"workerAlt3Walk3",
				"workerAlt3Walk2",
			],
			work: ["workerAlt3Work1", "workerAlt3Work2"],
		},
	},
	[EmployeeType.RaccoonGreen]: {
		spriteKeys: {
			idle: "workerAlt4",
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
		spriteKeys: {
			idle: "player",
			walk: ["player"],
			work: ["player"],
		},
	},
};

/* Specific employee instance data */

export enum EmployeeId {
	RaccoonGrayTier1,
	RaccoonGrayTier2,
	RaccoonGrayTier3,
	RaccoonBrownTier1,
	RaccoonBrownTier2,
	RaccoonBrownTier3,
	RaccoonYellowTier1,
	RaccoonYellowTier2,
	RaccoonYellowTier3,
	RaccoonPurpleTier1,
	RaccoonPurpleTier2,
	RaccoonPurpleTier3,
	RaccoonGreenTier1,
	RaccoonGreenTier2,
	RaccoonGreenTier3,
	HumanTier1,
	HumanTier2,
	HumanTier3,
}

export interface EmployeeInterface {
	type: EmployeeType; // Employee type
	name: string; // Employee name
	tier: number; // Tier number
	walkSpeed: number; // Speed of the employee walking
	workSpeed: number; // Speed of the employee working
	cost: number; // Cost to purchase that tier of employee
	upgradeTo?: EmployeeId; // Employee to upgrade to
}

export const EmployeeData: { [key in EmployeeId]: EmployeeInterface } = {
	[EmployeeId.RaccoonGrayTier1]: {
		type: EmployeeType.RaccoonGray,
		name: "Washbear employee",
		tier: 1,
		walkSpeed: 2,
		workSpeed: 1,
		cost: 300,
		upgradeTo: EmployeeId.RaccoonGrayTier2,
	},
	[EmployeeId.RaccoonGrayTier2]: {
		type: EmployeeType.RaccoonGray,
		name: "Washbear employee",
		tier: 2,
		walkSpeed: 3,
		workSpeed: 1.25,
		cost: 400,
		upgradeTo: EmployeeId.RaccoonGrayTier3,
	},
	[EmployeeId.RaccoonGrayTier3]: {
		type: EmployeeType.RaccoonGray,
		name: "Washbear employee",
		tier: 3,
		walkSpeed: 4,
		workSpeed: 1.5,
		cost: 800,
	},

	[EmployeeId.RaccoonBrownTier1]: {
		type: EmployeeType.RaccoonBrown,
		name: "Tanuki employee",
		tier: 1,
		walkSpeed: 2.5,
		workSpeed: 1,
		cost: 350,
		upgradeTo: EmployeeId.RaccoonBrownTier2,
	},
	[EmployeeId.RaccoonBrownTier2]: {
		type: EmployeeType.RaccoonBrown,
		name: "Tanuki employee",
		tier: 2,
		walkSpeed: 4,
		workSpeed: 1.125,
		cost: 475,
		upgradeTo: EmployeeId.RaccoonBrownTier3,
	},
	[EmployeeId.RaccoonBrownTier3]: {
		type: EmployeeType.RaccoonBrown,
		name: "Tanuki employee",
		tier: 3,
		walkSpeed: 5.5,
		workSpeed: 1.25,
		cost: 950,
	},

	[EmployeeId.RaccoonYellowTier1]: {
		type: EmployeeType.RaccoonYellow,
		name: "Bunny employee",
		tier: 1,
		walkSpeed: 1,
		workSpeed: 1,
		cost: 375,
		upgradeTo: EmployeeId.RaccoonYellowTier2,
	},
	[EmployeeId.RaccoonYellowTier2]: {
		type: EmployeeType.RaccoonYellow,
		name: "Bunny employee",
		tier: 2,
		walkSpeed: 2.5,
		workSpeed: 1.5,
		cost: 525,
		upgradeTo: EmployeeId.RaccoonYellowTier3,
	},
	[EmployeeId.RaccoonYellowTier3]: {
		type: EmployeeType.RaccoonYellow,
		name: "Bunny employee",
		tier: 3,
		walkSpeed: 4,
		workSpeed: 2,
		cost: 1050,
	},

	[EmployeeId.RaccoonPurpleTier1]: {
		type: EmployeeType.RaccoonPurple,
		name: "Kobold employee",
		tier: 1,
		walkSpeed: 2,
		workSpeed: 1,
		cost: 600,
		upgradeTo: EmployeeId.RaccoonPurpleTier2,
	},
	[EmployeeId.RaccoonPurpleTier2]: {
		type: EmployeeType.RaccoonPurple,
		name: "Kobold employee",
		tier: 2,
		walkSpeed: 3.5,
		workSpeed: 1.5,
		cost: 900,
		upgradeTo: EmployeeId.RaccoonPurpleTier3,
	},
	[EmployeeId.RaccoonPurpleTier3]: {
		type: EmployeeType.RaccoonPurple,
		name: "Kobold employee",
		tier: 3,
		walkSpeed: 6,
		workSpeed: 2,
		cost: 1800,
	},

	[EmployeeId.RaccoonGreenTier1]: {
		type: EmployeeType.RaccoonGreen,
		name: "Cat employee",
		tier: 4,
		walkSpeed: 3,
		workSpeed: 1,
		cost: 800,
		upgradeTo: EmployeeId.RaccoonGreenTier2,
	},
	[EmployeeId.RaccoonGreenTier2]: {
		type: EmployeeType.RaccoonGreen,
		name: "Cat employee",
		tier: 2,
		walkSpeed: 6,
		workSpeed: 2,
		cost: 1600,
		upgradeTo: EmployeeId.RaccoonGreenTier3,
	},
	[EmployeeId.RaccoonGreenTier3]: {
		type: EmployeeType.RaccoonGreen,
		name: "Cat employee",
		tier: 3,
		walkSpeed: 9,
		workSpeed: 3,
		cost: 2400,
	},

	[EmployeeId.HumanTier1]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 1,
		walkSpeed: 1,
		workSpeed: 1,
		cost: 2500,
		upgradeTo: EmployeeId.HumanTier2,
	},
	[EmployeeId.HumanTier2]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 2,
		walkSpeed: 1.25,
		workSpeed: 1.05,
		cost: 5000,
		upgradeTo: EmployeeId.HumanTier3,
	},
	[EmployeeId.HumanTier3]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 3,
		walkSpeed: 1.5,
		workSpeed: 1.15,
		cost: 9999,
	},
};
