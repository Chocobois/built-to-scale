/* Station category data */

export enum StationType {
	Waiting,
	Nail,
	Wax,
	Bath,
	Register,
}

export type StationSymbol = "seat" | "nail" | "wax" | "bath" | "money";

export interface StationTypeInterface {
	symbolKey: StationSymbol; // Image to be shown in the thoughtbubble
	color: number; // Debug color
}

export const StationTypeData: { [key in StationType]: StationTypeInterface } = {
	[StationType.Waiting]: {
		symbolKey: "seat",
		color: 0x227777,
	},
	[StationType.Nail]: {
		symbolKey: "nail",
		color: 0xff0000,
	},
	[StationType.Wax]: {
		symbolKey: "wax",
		color: 0xffff00,
	},
	[StationType.Bath]: {
		symbolKey: "bath",
		color: 0x0000ff,
	},
	[StationType.Register]: {
		symbolKey: "money",
		color: 0x00ff00,
	},
};

/* Specific station instance data */

export enum StationId {
	Waiting_1,
	Waiting_2,
	Waiting_3,
	Nail_1,
	Nail_2,
	Nail_3,
	Wax_1,
	Wax_2,
	Wax_3,
	Bath_1,
	Bath_2,
	Bath_3,
	Register_1,
	Register_2,
	Register_3,
}

export interface StationInterface {
	type: StationType; // Station type
	name: string; // Station name
	tier: number; // Tier number
	spriteKey: string; // Station image key
	spriteScale: number; // Multiplier for sprite size
	spriteOffsetX?: number; // Sprite offset X to center sitting location
	spriteOffsetY?: number; // Sprite offset Y to center sitting location
	taskDuration?: number; // Time it takes to complete a task
	admissionFee?: number; // Customer pays this amount to use the station
	cost: number; // Cost to purchase the station
	upgradeTo?: StationId; // Station to upgrade to
}

export const StationData: { [key in StationId]: StationInterface } = {
	[StationId.Waiting_1]: {
		type: StationType.Waiting,
		name: "Waiting seat",
		tier: 1,
		spriteKey: "waitchair_1",
		spriteScale: 1.0,
		cost: 100,
		upgradeTo: StationId.Waiting_2,
	},
	[StationId.Waiting_2]: {
		type: StationType.Waiting,
		name: "Waiting armchair",
		tier: 2,
		spriteKey: "waitchair_2",
		spriteScale: 1.25,
		spriteOffsetX: -0.03,
		spriteOffsetY: -0.07,
		cost: 250,
		upgradeTo: StationId.Waiting_3,
	},
	[StationId.Waiting_3]: {
		type: StationType.Waiting,
		name: "Waiting throne",
		tier: 3,
		spriteKey: "waitchair_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.12,
		cost: 500,
	},

	[StationId.Nail_1]: {
		type: StationType.Nail,
		name: "Talonicure pillow",
		tier: 1,
		spriteKey: "nail_1",
		spriteScale: 1.0,
		spriteOffsetY: 0.06,
		taskDuration: 3000,
		admissionFee: 20,
		cost: 150,
		upgradeTo: StationId.Nail_2,
	},
	[StationId.Nail_2]: {
		type: StationType.Nail,
		name: "Talonicure beanbag",
		tier: 2,
		spriteKey: "nail_2",
		spriteScale: 1.25,
		spriteOffsetX: 0.01,
		spriteOffsetY: -0.05,
		taskDuration: 2500,
		admissionFee: 40,
		cost: 250,
		upgradeTo: StationId.Nail_3,
	},
	[StationId.Nail_3]: {
		type: StationType.Nail,
		name: "Talonicure bed",
		tier: 3,
		spriteKey: "nail_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.05,
		taskDuration: 2000,
		admissionFee: 60,
		cost: 400,
	},

	[StationId.Wax_1]: {
		type: StationType.Wax,
		name: "Scalicure chair",
		tier: 1,
		spriteKey: "wax_1",
		spriteScale: 1.0,
		taskDuration: 2000,
		admissionFee: 10,
		cost: 100,
		upgradeTo: StationId.Wax_2,
	},
	[StationId.Wax_2]: {
		type: StationType.Wax,
		name: "Scalicure station",
		tier: 2,
		spriteKey: "wax_2",
		spriteScale: 1.25,
		spriteOffsetX: 0.08,
		spriteOffsetY: -0.1,
		taskDuration: 1500,
		admissionFee: 20,
		cost: 250,
		upgradeTo: StationId.Wax_3,
	},
	[StationId.Wax_3]: {
		type: StationType.Wax,
		name: "Scalicure divan",
		tier: 3,
		spriteKey: "wax_3",
		spriteScale: 1.4,
		spriteOffsetX: 0.01,
		spriteOffsetY: -0.1,
		taskDuration: 1000,
		admissionFee: 30,
		cost: 500,
	},

	[StationId.Bath_1]: {
		type: StationType.Bath,
		name: "Draconic bath",
		tier: 1,
		spriteKey: "bath_1",
		spriteScale: 1.0,
		spriteOffsetY: -0.15,
		taskDuration: 4000,
		admissionFee: 20,
		cost: 200,
		upgradeTo: StationId.Bath_2,
	},
	[StationId.Bath_2]: {
		type: StationType.Bath,
		name: "Draconic shower",
		tier: 2,
		spriteKey: "bath_2",
		spriteScale: 1.25,
		spriteOffsetY: -0.08,
		taskDuration: 3000,
		admissionFee: 30,
		cost: 350,
		upgradeTo: StationId.Bath_3,
	},
	[StationId.Bath_3]: {
		type: StationType.Bath,
		name: "Dracuzzi",
		tier: 3,
		spriteKey: "bath_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.13,
		taskDuration: 2000,
		admissionFee: 40,
		cost: 600,
	},

	[StationId.Register_1]: {
		type: StationType.Register,
		name: "Cash register",
		tier: 1,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.05,
		taskDuration: 1500,
		cost: 0,
		upgradeTo: StationId.Register_2,
	},
	[StationId.Register_2]: {
		type: StationType.Register,
		name: "Cash register",
		tier: 2,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.05,
		taskDuration: 1000,
		cost: 400,
		upgradeTo: StationId.Register_3,
	},
	[StationId.Register_3]: {
		type: StationType.Register,
		name: "Cash register",
		tier: 3,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.05,
		taskDuration: 500,
		cost: 800,
	},
};
