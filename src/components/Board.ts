import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";

export class Board extends Button {
	private grid: Phaser.GameObjects.Grid;
	private things: any[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.things = [];
	}

	update(time: number, delta: number) {
	}
}
