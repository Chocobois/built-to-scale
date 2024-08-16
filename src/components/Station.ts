import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";

export class Station extends Button {
	// Sprites
	private sprite: Phaser.GameObjects.Rectangle;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.rectangle(0, 0, size, size, 0xFF0000);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}
}
