import { GameScene } from "@/scenes/GameScene";

export class Board extends Phaser.GameObjects.Container {
	public size: number;

	private grid: Phaser.GameObjects.Grid;
	private things: any[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.size = 130;
		this.grid = this.scene.add.grid(
			0,
			0,
			8 * this.size,
			6 * this.size,
			this.size,
			this.size,
			0xffffff,
			0.2,
			0x000000,
			0.5
		);
		this.add(this.grid);

		this.things = [];
	}

	update(time: number, delta: number) {}

	// Return coordinates of the grid cell
	gridToCoord(gridX: number, gridY: number) {
		return {
			x: this.x - this.grid.width / 2 + gridX * this.size + this.size / 2,
			y: this.y - this.grid.height / 2 + gridY * this.size + this.size / 2,
		};
	}

	// Return grid cell of the coordinates
	coordToGrid(x: number, y: number) {
		const gridX = Math.floor((x - this.x + this.grid.width / 2) / this.size);
		const gridY = Math.floor((y - this.y + this.grid.height / 2) / this.size);
		return { gridX, gridY };
	}
}
