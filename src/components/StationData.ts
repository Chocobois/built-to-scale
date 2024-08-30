/* Station category data */

export enum StationType {
	WaitingSeat,
	HornAndNails,
	ScalePolish,
	GoldBath,
	CashRegister,
}

export interface StationTypeInterface {
	symbolKey: string; // Image to be shown in the thoughtbubble
	color: number; // Debug color
}

export const StationTypeData: { [key in StationType]: StationTypeInterface } = {
	[StationType.WaitingSeat]: {
		symbolKey: "seat",
		color: 0x227777,
	},
	[StationType.HornAndNails]: {
		symbolKey: "nail",
		color: 0xff0000,
	},
	[StationType.ScalePolish]: {
		symbolKey: "wax",
		color: 0xffff00,
	},
	[StationType.GoldBath]: {
		symbolKey: "gold",
		color: 0x0000ff,
	},
	[StationType.CashRegister]: {
		symbolKey: "cash",
		color: 0x00ff00,
	},
};

/* Specific station instance data */

export enum StationId {
	WaitingSeatTier1,
	WaitingSeatTier2,
	WaitingSeatTier3,
	HornAndNailsTier1,
	HornAndNailsTier2,
	HornAndNailsTier3,
	ScalePolishTier1,
	ScalePolishTier2,
	ScalePolishTier3,
	GoldBathTier1,
	GoldBathTier2,
	GoldBathTier3,
	CashRegisterTier1,
	CashRegisterTier2,
	CashRegisterTier3,
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
	[StationId.WaitingSeatTier1]: {
		type: StationType.WaitingSeat,
		name: "Waiting seat",
		tier: 1,
		spriteKey: "waitchair_1",
		spriteScale: 1.0,
		cost: 100,
		upgradeTo: StationId.WaitingSeatTier2,
	},
	[StationId.WaitingSeatTier2]: {
		type: StationType.WaitingSeat,
		name: "Waiting armchair",
		tier: 2,
		spriteKey: "waitchair_2",
		spriteScale: 1.25,
		spriteOffsetX: -0.03,
		spriteOffsetY: -0.07,
		cost: 250,
		upgradeTo: StationId.WaitingSeatTier3,
	},
	[StationId.WaitingSeatTier3]: {
		type: StationType.WaitingSeat,
		name: "Waiting throne",
		tier: 3,
		spriteKey: "waitchair_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.12,
		cost: 500,
	},

	[StationId.HornAndNailsTier1]: {
		type: StationType.HornAndNails,
		name: "Talonicure pillow",
		tier: 1,
		spriteKey: "nail_1",
		spriteScale: 1.0,
		spriteOffsetY: 0.06,
		taskDuration: 3000,
		admissionFee: 20,
		cost: 150,
		upgradeTo: StationId.HornAndNailsTier2,
	},
	[StationId.HornAndNailsTier2]: {
		type: StationType.HornAndNails,
		name: "Talonicure beanbag",
		tier: 2,
		spriteKey: "nail_2",
		spriteScale: 1.25,
		spriteOffsetX: 0.01,
		spriteOffsetY: -0.05,
		taskDuration: 2500,
		admissionFee: 40,
		cost: 250,
		upgradeTo: StationId.HornAndNailsTier3,
	},
	[StationId.HornAndNailsTier3]: {
		type: StationType.HornAndNails,
		name: "Talonicure bed",
		tier: 3,
		spriteKey: "nail_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.05,
		taskDuration: 2000,
		admissionFee: 60,
		cost: 400,
	},

	[StationId.ScalePolishTier1]: {
		type: StationType.ScalePolish,
		name: "Scalicure chair",
		tier: 1,
		spriteKey: "wax_1",
		spriteScale: 1.0,
		taskDuration: 2000,
		admissionFee: 10,
		cost: 100,
		upgradeTo: StationId.ScalePolishTier2,
	},
	[StationId.ScalePolishTier2]: {
		type: StationType.ScalePolish,
		name: "Scalicure station",
		tier: 2,
		spriteKey: "wax_2",
		spriteScale: 1.25,
		spriteOffsetX: 0.08,
		spriteOffsetY: -0.1,
		taskDuration: 1500,
		admissionFee: 20,
		cost: 250,
		upgradeTo: StationId.ScalePolishTier3,
	},
	[StationId.ScalePolishTier3]: {
		type: StationType.ScalePolish,
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

	[StationId.GoldBathTier1]: {
		type: StationType.GoldBath,
		name: "Draconic bath",
		tier: 1,
		spriteKey: "bath_1",
		spriteScale: 1.0,
		taskDuration: 4000,
		admissionFee: 20,
		cost: 200,
		upgradeTo: StationId.GoldBathTier2,
	},
	[StationId.GoldBathTier2]: {
		type: StationType.GoldBath,
		name: "Draconic shower",
		tier: 2,
		spriteKey: "bath_2",
		spriteScale: 1.25,
		taskDuration: 3000,
		admissionFee: 30,
		cost: 350,
		upgradeTo: StationId.GoldBathTier3,
	},
	[StationId.GoldBathTier3]: {
		type: StationType.GoldBath,
		name: "Dracuzzi",
		tier: 3,
		spriteKey: "bath_3",
		spriteScale: 1.4,
		spriteOffsetY: -0.05,
		taskDuration: 2000,
		admissionFee: 40,
		cost: 600,
	},

	[StationId.CashRegisterTier1]: {
		type: StationType.CashRegister,
		name: "Cash register",
		tier: 1,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.1,
		taskDuration: 1500,
		cost: 0,
		upgradeTo: StationId.CashRegisterTier2,
	},
	[StationId.CashRegisterTier2]: {
		type: StationType.CashRegister,
		name: "Cash register",
		tier: 2,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.1,
		taskDuration: 1000,
		cost: 400,
		upgradeTo: StationId.CashRegisterTier3,
	},
	[StationId.CashRegisterTier3]: {
		type: StationType.CashRegister,
		name: "Cash register",
		tier: 3,
		spriteKey: "checkout",
		spriteScale: 1.4,
		spriteOffsetY: 0.1,
		taskDuration: 500,
		cost: 800,
	},
};
