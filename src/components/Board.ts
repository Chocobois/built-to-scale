import { GameScene } from "@/scenes/GameScene";

export type GridPoint = {
	x: number;
	y: number;
};

export class Board extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public size: number;
	public width: number;
	public height: number;

	private grid: Phaser.GameObjects.Grid;
	private things: any[];

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		width: number,
		height: number,
		cellSize: number
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		// this.size = scene.H / (height + 2);
		this.size = cellSize;
		this.width = width;
		this.height = height;

		this.grid = this.scene.add.grid(
			0,
			0,
			width * this.size,
			height * this.size,
			this.size,
			this.size,
			0xffffff,
			0.1,
			0x000000,
			0.2
		);
		this.add(this.grid);

		this.things = [];
	}

	update(time: number, delta: number) {}

	// Resize the board to new level
	resize(width: number, height: number, cellSize: number) {
		// this.size = this.scene.H / height;
		this.size = cellSize;
		this.width = width;
		this.height = height;

		this.grid.destroy();
		this.grid = this.scene.add.grid(
			0,
			0,
			width * this.size,
			height * this.size,
			this.size,
			this.size,
			0xffffff,
			0,
			0xff0000,
			0
		);
		this.add(this.grid);
	}

	// Return coordinates of the grid cell
	gridToCoord(gridX: number, gridY: number) {
		return {
			x: this.x - this.grid.width / 2 + gridX * this.size + this.size / 2,
			y: this.y - this.grid.height / 2 + gridY * this.size + this.size / 2,
		};
	}

	// Return coordinates of the nav grid cell
	navGridToCoord(gridX: number, gridY: number) {
		return {
			x: this.x - this.grid.width / 2 + gridX * (this.size / 7),
			y: this.y - this.grid.height / 2 + gridY * (this.size / 7),
		};
	}

	// Return grid cell of the coordinates
	coordToGrid(x: number, y: number): GridPoint {
		const gridX = Math.floor((x - this.x + this.grid.width / 2) / this.size);
		const gridY = Math.floor((y - this.y + this.grid.height / 2) / this.size);
		return { x: gridX, y: gridY };
	}

	// Return nav grid cell of the coordinates
	coordToNavGrid(x: number, y: number): GridPoint {
		const gridX = Math.floor(
			(x - this.x + this.grid.width / 2) / (this.size / 7)
		);
		const gridY = Math.floor(
			(y - this.y + this.grid.height / 2) / (this.size / 7)
		);
		return { x: gridX, y: gridY };
	}

	// Return nav coord of world coords, not rounded
	coordToNav(x: number, y: number): GridPoint {
		return {
			x: (x - this.x + this.grid.width / 2) / (this.size / 7),
			y: (y - this.y + this.grid.height / 2) / (this.size / 7),
		};
	}
}
