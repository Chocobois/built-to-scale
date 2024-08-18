export enum LevelId {
	Level1,
	Level2,
	Level3,
}

export interface Level {
	id: LevelId;
	background: string;
	width: number;
	height: number;
	cellSize: number;
	grid: number[][];
}

export enum BlockType {
	Empty = 0,
	Wall = 1,
	WaitingSeat = 2,
	HornAndNails = 3,
	ScalePolish = 4,
	GoldBath = 5,
	CashRegister = 6,
	Employee = 9,
}

const _ = BlockType.Empty;
const X = BlockType.Wall;

export const LevelData: Level[] = [
	{
		id: LevelId.Level1,
		background: "grid1",
		width: 6 + 2,
		height: 4 + 2,
		cellSize: 190,
		grid: [
			[X, X, X, X, X, X, X, X],
			[X, 2, _, 9, 9, _, 4, X],
			[X, 2, _, 3, 3, _, 4, X],
			[_, _, _, _, _, _, _, X],
			[X, _, 5, 5, _, 6, _, _],
			[X, X, X, X, X, X, X, X],
		],
	},
	{
		id: LevelId.Level2,
		background: "grid4",
		width: 7 + 2,
		height: 5 + 2,
		cellSize: 150,
		grid: [
			[X, X, X, X, X, X, X, X, X],
			[X, 2, _, _, _, _, _, _, X],
			[X, 2, _, 3, 3, 3, _, 4, X],
			[X, 2, _, _, _, _, _, 4, X],
			[_, _, _, 5, 5, 5, _, _, X],
			[X, 9, 9, 9, _, _, 6, _, _],
			[X, X, X, X, X, X, X, X, X],
		],
	},
	{
		id: LevelId.Level3,
		background: "grid2",
		width: 8 + 2,
		height: 6 + 2,
		cellSize: 138,
		grid: [
			[X, X, X, X, X, X, X, X, X, X],
			[X, 2, _, _, _, _, _, _, _, X],
			[X, 2, _, 3, _, 3, _, 4, 4, X],
			[X, 2, _, 3, _, 3, _, _, _, X],
			[X, 2, _, _, _, _, _, 4, 4, X],
			[_, _, _, 5, 5, 5, _, _, _, X],
			[X, 9, 9, 9, 9, _, _, 6, _, _],
			[X, X, X, X, X, X, X, X, X, X],
		],
	},
];
