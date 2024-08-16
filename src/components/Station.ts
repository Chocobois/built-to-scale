import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";

export class Station extends Button {
	public currentCustomer: Customer | null;

	private sprite: Phaser.GameObjects.Rectangle;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		// The customer using the station
		this.currentCustomer = null;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.rectangle(0, 0, size, size, 0xff0000);
		this.add(this.sprite);
	}

	update(time: number, delta: number) {
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;

        this.sprite.fillColor = customer ? 0x00ff00 : 0xff0000;
	}
}
