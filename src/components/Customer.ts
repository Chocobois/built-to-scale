import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";

export class Customer extends Button {
	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 150;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		// this.sprite = this.scene.add.ellipse(0, 0, 100, 100, 0x000000);
		// this.add(this.sprite);

		this.bindInteractive(this.sprite, true);
	}

	update(time: number, delta: number) {
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.x = pointer.x;
		this.y = pointer.y;
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}
}
