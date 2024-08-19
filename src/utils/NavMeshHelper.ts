import type { Board } from "@/components/Board";
import { Level, BlockType } from "@/components/Levels";
import { StationId } from "@/components/StationData";
import type { Station } from "@/components/Station";
import NavMesh, { buildPolysFromGridMap } from "navmesh";

const subdivision = 7;

const _ = true;
const X = false;
const stationMask = [
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
	[_, X, X, X, X, X, _],
];

function stationToGrid(board: Board, station: Station) {
	const { x, y } = board.coordToGrid(station.x, station.y);
	return [x, y];
}

function Array2DFromGrid(board: Board, subdivision: number): boolean[][] {
	return new Array(board.height * subdivision)
		.fill(true)
		.map(() => new Array(board.width * subdivision).fill(true));
}

export function centerOnSubdividedCoord(
	board: Board,
	station: Station,
	subdivision: number
) {
	const [x, y] = stationToGrid(board, station);
	const center = Math.floor(subdivision / 2);
	return [x + center, y + center];
}

export function GenerateNavMesh(board: Board, level: Level) {
	const nav = Array2DFromGrid(board, subdivision);

	for (let y = 0; y < level.height; y++) {
		for (let x = 0; x < level.width; x++) {
			const block = level.grid[y][x];

			switch (block) {
				case BlockType.Wall:
					for (let sy = 0; sy < subdivision; sy++) {
						for (let sx = 0; sx < subdivision; sx++) {
							nav[y * subdivision + sy][x * subdivision + sx] = false;

							// Special case for employees, cave out upper wall
							if (
								y == 0 &&
								sy == subdivision - 1 &&
								x > 0 &&
								x < level.width - 1
							) {
								nav[y * subdivision + sy][x * subdivision + sx] = true;
							}
						}
					}
					break;
				case BlockType.HornAndNails:
				case BlockType.ScalePolish:
				case BlockType.GoldBath:
				case BlockType.CashRegister:
					for (let sy = 0; sy < stationMask.length; sy++) {
						for (let sx = 0; sx < stationMask.length; sx++) {
							if (!stationMask[sy][sx]) {
								nav[y * subdivision + sy][x * subdivision + sx] = false;
							}
						}
					}
					break;
			}
		}
	}

	debugPrintNav(nav);

	return new NavMesh(buildPolysFromGridMap(nav));
}

function debugPrintNav(nav: any) {
	// Print nav as a 2d string ascii art
	let text = "";
	for (let y = 0; y < nav.length; y++) {
		let row = "";
		for (let x = 0; x < nav[0].length; x++) {
			row += nav[y][x] ? "·" : "X";
		}
		text += row + "\n";
	}
	console.log(text);
}
