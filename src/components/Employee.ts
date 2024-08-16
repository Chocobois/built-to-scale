import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";

export class Employee extends Button {
	public currentCustomer: Customer | null;
	public doingCuteThing: boolean;

	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.currentCustomer = null;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "worker");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {
		const factor = this.doingCuteThing ? 0.1 : 0.02;
		const squish = 1.0 + factor * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;
	}

	walkTo(targetX: number, targetY: number) {
		// TODO: Replace with pathfinding algorithm

		// Temporary: set duration based on distance
		const distance = Phaser.Math.Distance.Between(
			this.x,
			this.y,
			targetX,
			targetY
		);

		// Add tween to move from current position to the target
		this.scene.tweens.add({
			targets: this,
			x: targetX,
			y: targetY,
			duration: 2 * distance,
			ease: "Linear",

			onComplete: () => {
				this.emit("walkend");
			},
		});
	}

	setAction(temp: boolean) {
		this.doingCuteThing = temp;
	}
}
