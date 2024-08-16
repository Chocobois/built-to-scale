import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";

export enum StationType {
	WaitingSeat,
	HornAndNails,
	ScalePolish,
	GoldBath,
	CashRegister,
}

export const StationTypeColors: { [key in StationType]: number } = {
	[StationType.WaitingSeat]: 0x777777,
	[StationType.HornAndNails]: 0xff0000,
	[StationType.ScalePolish]: 0x00ff00,
	[StationType.GoldBath]: 0x0000ff,
	[StationType.CashRegister]: 0xffff00,
};

export class Station extends Button {
	public stationType: StationType;
	public currentCustomer: Customer | null; // The customer using the station
	public taskDuration: number; // Time it takes to complete a task
	public admissionFee: number; // Cost to use the station

	private sprite: Phaser.GameObjects.Rectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number, type: StationType) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.stationType = type;

		this.currentCustomer = null;
		this.taskDuration = 3000;
		this.admissionFee = 10;

		/* Sprite */
		const size = 150;
		const color = StationTypeColors[type];
		this.sprite = this.scene.add.rectangle(0, 0, size, size, color);
		this.sprite.alpha = 0.5;
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

		this.sprite.alpha = customer ? 0.75 : 0.5;
		this.text.setText(customer ? "Click me!" : "Available");
	}

	startTask() {
		this.sprite.alpha = 1.0;
		this.text.setText("Working");

		this.scene.addEvent(this.taskDuration, () => {
			this.emit("taskend");
			this.sprite.alpha = this.currentCustomer ? 0.75 : 0.5;
			this.text.setText("Click me!");
		});
	}
}
