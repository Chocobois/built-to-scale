import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";
import { Timer } from "./Timer";

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

export const StationDuration: { [key in StationType]: number } = {
	[StationType.WaitingSeat]: 0,
	[StationType.HornAndNails]: 3000,
	[StationType.ScalePolish]: 4000,
	[StationType.GoldBath]: 2000,
	[StationType.CashRegister]: 500,
};

export class Station extends Button {
	public stationType: StationType;
	public currentCustomer: Customer | null; // The customer using the station
	public taskDuration: number; // Time it takes to complete a task
	public admissionFee: number; // Cost to use the station

	private sprite: Phaser.GameObjects.Rectangle;
	private text: Phaser.GameObjects.Text;

	private progressTimer: Timer;

	constructor(scene: GameScene, x: number, y: number, type: StationType) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.stationType = type;

		this.currentCustomer = null;
		this.taskDuration = StationDuration[type];
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
		this.text.setVisible(false);
		this.text.setStroke("#000000", 4);
		this.add(this.text);

		this.progressTimer = new Timer(
			scene,
			-0.4 * size,
			0.4 * size,
			0.8 * size,
			0xed51a4
		);
		this.progressTimer.setVisible(false);
		this.add(this.progressTimer);
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

		this.scene.tweens.addCounter({
			from: 1,
			to: 0,
			duration: this.taskDuration,
			onStart: () => {
				this.progressTimer.setVisible(true);
			},
			onUpdate: (tween) => {
				this.progressTimer.redraw(tween.getValue());
			},
			onComplete: () => {
				this.emit("taskend");
				this.progressTimer.setVisible(false);
				this.sprite.alpha = this.currentCustomer ? 0.75 : 0.5;
				this.text.setText("Click me!");
			},
		});
	}
}
