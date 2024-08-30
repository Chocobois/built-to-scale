export enum LevelId {
	Level1,
	Level2,
	Level3,
}

export interface Level {
	id: LevelId;
	background: string;
	foreground: string;
	width: number;
	height: number;
	cellSize: number;
	grid: number[][];
	upgradeCost?: number;
}

export enum BlockType {
	Empty = 0,
	Wall = 1,
	WaitingSeat = 2,
	HornAndNails = 3,
	ScalePolish = 4,
	GoldBath = 5,
	CashRegister = 6,

	EmployeeGray = 11,
	EmployeeBrown = 12,
	EmployeeYellow = 13,
	EmployeePurple = 14,
	EmployeeGreen = 15,
}

const _ = BlockType.Empty;
const X = BlockType.Wall;

const A = BlockType.EmployeeGray;
const B = BlockType.EmployeeBrown;
const C = BlockType.EmployeeYellow;
const D = BlockType.EmployeePurple;
const E = BlockType.EmployeeGreen;

export const LevelData: Level[] = [
	{
		id: LevelId.Level1,
		background: "6x4_bg",
		foreground: "6x4_fg",
		width: 6 + 2,
		height: 4 + 2,
		cellSize: 191,
		grid: [
			[X, X, X, X, X, X, X, X],
			[X, 2, _, A, B, C, 4, X],
			[X, 2, _, 3, 3, _, 4, X],
			[_, _, _, _, _, _, _, X],
			[X, _, 5, 5, _, 6, _, _],
			[X, X, X, X, X, X, X, X],
		],
		upgradeCost: 1000,
	},
	{
		id: LevelId.Level2,
		background: "7x5_bg",
		foreground: "7x5_fg",
		width: 7 + 2,
		height: 5 + 2,
		cellSize: 150,
		grid: [
			[X, X, X, X, X, X, X, X, X],
			[X, 2, _, A, B, C, D, _, X],
			[X, 2, _, 3, 3, 3, _, 4, X],
			[X, 2, _, _, _, _, _, 4, X],
			[_, _, _, 5, 5, 5, _, _, X],
			[X, _, _, _, _, _, 6, _, _],
			[X, X, X, X, X, X, X, X, X],
		],
		upgradeCost: 2000,
	},
	{
		id: LevelId.Level3,
		background: "8x6_bg",
		foreground: "8x6_fg",
		width: 8 + 2,
		height: 6 + 2,
		cellSize: 138,
		grid: [
			[X, X, X, X, X, X, X, X, X, X],
			[X, 2, _, A, B, C, D, E, _, X],
			[X, 2, _, 3, _, 3, _, 4, 4, X],
			[X, 2, _, 3, _, 3, _, _, _, X],
			[X, 2, _, _, _, _, _, 4, 4, X],
			[_, _, _, 5, 5, 5, _, _, _, X],
			[X, _, _, _, _, _, _, 6, _, _],
			[X, X, X, X, X, X, X, X, X, X],
		],
	},
];
