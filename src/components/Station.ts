import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";

export class Station extends Button {
	public currentCustomer: Customer | null; // The customer using the station
	public taskDuration: number; // Time it takes to complete a task

	private sprite: Phaser.GameObjects.Rectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.currentCustomer = null;
		this.taskDuration = 3000;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.rectangle(0, 0, size, size, 0x777777);
		this.add(this.sprite);

		this.text = this.scene.addText({
			x: 0,
			y: size / 2,
            size: 32,
			text: "Available",
		});
        this.text.setOrigin(0.5);
        this.text.setStroke("#000000", 4);
        this.add(this.text);
	}

	update(time: number, delta: number) {
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;

		this.sprite.fillColor = customer ? 0x7777ff : 0x777777;
        this.text.setText(customer ? "Click me!" : "Available");
	}

	startTask() {
		this.sprite.fillColor = 0x0000ff;
        this.text.setText("Working");

		this.scene.addEvent(this.taskDuration, () => {
			this.emit("taskend");
			this.sprite.fillColor = this.currentCustomer ? 0x7777ff : 0xff0000;
            this.text.setText("Click me!");
		});
	}
}
