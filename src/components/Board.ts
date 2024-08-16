import { GameScene } from "@/scenes/GameScene";

export class Board extends Phaser.GameObjects.Container {
	private grid: Phaser.GameObjects.Grid;
	private things: any[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		const size = 130;
		this.grid = this.scene.add.grid(
			0,
			0,
			8*size,
			6*size,
			size,
			size,
			0xffffff,
			0.5,
			0x000000,
			0.5
		);
		this.add(this.grid);

		this.things = [];
	}

	update(time: number, delta: number) {}
}
