import { EmployeeId } from "./EmployeeData";
import { StationId } from "./StationData";

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
	Waiting = 2,
	Nail = 3,
	Wax = 4,
	Bath = 5,
	Register = 6,

	Washbear = 11,
	Tanuki = 12,
	Bunny = 13,
	Kobold = 14,
	Cat = 15,
	Human = 16,
}

export const BlockTypeStations: { [key: number]: StationId } = {
	[BlockType.Waiting]: StationId.Waiting_1,
	[BlockType.Nail]: StationId.Nail_1,
	[BlockType.Wax]: StationId.Wax_1,
	[BlockType.Bath]: StationId.Bath_1,
	[BlockType.Register]: StationId.Register_1,
};

export const BlockTypeEmployees: { [key: number]: EmployeeId } = {
	[BlockType.Washbear]: EmployeeId.Washbear_1,
	[BlockType.Tanuki]: EmployeeId.Tanuki_1,
	[BlockType.Bunny]: EmployeeId.Bunny_1,
	[BlockType.Kobold]: EmployeeId.Kobold_1,
	[BlockType.Cat]: EmployeeId.Cat_1,
	[BlockType.Human]: EmployeeId.Human_1,
};

/* Level maps */

const _ = BlockType.Empty;
const X = BlockType.Wall;

const A = BlockType.Washbear;
const B = BlockType.Tanuki;
const C = BlockType.Bunny;
const D = BlockType.Kobold;
const E = BlockType.Cat;
const F = BlockType.Human;

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
