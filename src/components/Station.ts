import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";
import { Timer } from "./Timer";
import {
	StationData,
	StationId,
	StationType,
	StationTypeData,
} from "./StationData";
import { interpolateColor } from "@/functions";

export class Station extends Button {
	public stationId: StationId;
	public currentCustomer: Customer | null; // The customer using the station

	private sprite: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private progressTimer: Timer;

	constructor(scene: GameScene, x: number, y: number, id: StationId) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.stationId = id;

		this.currentCustomer = null;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.image(0, 0, this.spriteKey);
		this.sprite.setScale(size / this.sprite.width);
		this.sprite.setTint(interpolateColor(0xffffff, this.stationTypeColor, 0.5));
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

		this.text.setText(customer ? "Click me!" : "Available");
	}

	startTask() {
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
				this.text.setText("Click me!");
			},
		});
	}

	/* Getters */

	get stationType(): StationType {
		return StationData[this.stationId].type;
	}

	get spriteKey(): string {
		return StationData[this.stationId].spriteKey;
	}

	get taskDuration(): number {
		return StationData[this.stationId].taskDuration ?? 0;
	}

	get admissionFee(): number {
		return StationData[this.stationId].admissionFee ?? 0;
	}

	get upgradeCost(): number {
		return StationData[this.stationId].upgradeCost ?? 0;
	}

	get upgradeTo(): StationId | undefined {
		return StationData[this.stationId].upgradeTo;
	}

	get stationTypeSymbolKey(): string {
		return StationTypeData[this.stationType].symbolKey;
	}

	get stationTypeColor(): number {
		return StationTypeData[this.stationType].color;
	}
}
