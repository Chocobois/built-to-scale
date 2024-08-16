import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station } from "./Station";

export class Customer extends Button {
	public lastX: number; // Last position on the grid
	public lastY: number;
	public dragX: number; // Current drag position
	public dragY: number;
	public currentStation: Station | null;

	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.lastX = x;
		this.lastY = y;
		this.dragX = x;
		this.dragY = y;
		this.currentStation = null;

		/* Sprite */
		this.spriteSize = 150;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		this.bindInteractive(this.sprite, true);
	}

	update(time: number, delta: number) {
		// Smooth follow the drag point
		this.x += (this.dragX - this.x) * 0.5;
		this.y += (this.dragY - this.y) * 0.5;

		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("pickup");
	}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.dragX = pointer.x;
		this.dragY = pointer.y;
		this.emit("drag");
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("drop");
	}

	snapTo(x: number, y: number) {
		this.dragX = x;
		this.dragY = y;
	}

	setStation(station: Station | null) {
		this.currentStation = station;
	}
}
