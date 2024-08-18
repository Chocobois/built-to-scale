/* Employee category data */

export enum EmployeeType {
	Raccoon,
	Human, // Temporary. Replace with whatever.
}

/* Specific employee instance data */

export enum EmployeeId {
	RaccoonTier1,
	RaccoonTier2,
	RaccoonTier3,
	HumanTier1,
	HumanTier2,
	HumanTier3,
}

export interface EmployeeInterface {
	type: EmployeeType; // Employee type
	name: string; // Employee name
	tier: number; // Tier number
	spriteKey: string; // Employee image key
	walkSpeed: number; // Speed of the employee walking
	workSpeed: number; // Speed of the employee working
	cost: number; // Cost to purchase that tier of employee
	upgradeTo?: EmployeeId; // Employee to upgrade to
}

export const EmployeeData: { [key in EmployeeId]: EmployeeInterface } = {
	[EmployeeId.RaccoonTier1]: {
		type: EmployeeType.Raccoon,
		name: "Raccoon employee",
		tier: 1,
		spriteKey: "worker",
		walkSpeed: 1,
		workSpeed: 1,
		cost: 1000,
		upgradeTo: EmployeeId.RaccoonTier2,
	},
	[EmployeeId.RaccoonTier2]: {
		type: EmployeeType.Raccoon,
		name: "Raccoon employee",
		tier: 2,
		spriteKey: "worker",
		walkSpeed: 2,
		workSpeed: 2,
		cost: 400,
		upgradeTo: EmployeeId.RaccoonTier3,
	},
	[EmployeeId.RaccoonTier3]: {
		type: EmployeeType.Raccoon,
		name: "Raccoon employee",
		tier: 3,
		spriteKey: "worker",
		walkSpeed: 3,
		workSpeed: 3,
		cost: 800,
	},

	[EmployeeId.HumanTier1]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 1,
		spriteKey: "player",
		walkSpeed: 1,
		workSpeed: 1,
		cost: 1000,
		upgradeTo: EmployeeId.HumanTier2,
	},
	[EmployeeId.HumanTier2]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 2,
		spriteKey: "player",
		walkSpeed: 2,
		workSpeed: 2,
		cost: 400,
		upgradeTo: EmployeeId.HumanTier3,
	},
	[EmployeeId.HumanTier3]: {
		type: EmployeeType.Human,
		name: "Human employee",
		tier: 3,
		spriteKey: "player",
		walkSpeed: 3,
		workSpeed: 3,
		cost: 800,
	},
};
