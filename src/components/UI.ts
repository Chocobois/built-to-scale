import { GameScene } from "@/scenes/GameScene";
import { Timer } from "./Timer";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private dayProgressTimer: Timer;
	private dayText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelWidth = 300;
		const panelHeight = 400;

		this.panel = this.scene.add.container(
			scene.W - panelWidth / 2,
			panelHeight / 2
		);
		this.add(this.panel);

		// this.background = this.scene.add.image(0, 0, "hud");
		// this.background.setScale(panelHeight / this.background.height);
		// this.background.setVisible(false);
		// this.panel.add(this.background);
		const rect = this.scene.add.rectangle(
			0,
			0,
			panelWidth,
			panelHeight,
			0x000000,
			0.5
		);
		this.panel.add(rect);

		this.dayProgressTimer = new Timer(
			scene,
			0,
			-0.3 * panelHeight,
			200,
			0xff7700
		);
		this.panel.add(this.dayProgressTimer);

		this.dayText = this.scene.addText({
			x: 0,
			y: 0,
			size: 60,
			color: "#FFFFFF",
			text: "Day 1",
		});
		this.dayText.setOrigin(0.5);
		this.dayText.setStroke("black", 4);
		this.panel.add(this.dayText);

		this.moneyText = this.scene.addText({
			x: 0,
			y: 0.3 * panelHeight,
			size: 40,
			color: "#FFFFFF",
			text: "Money: $0",
		});
		this.moneyText.setStroke("black", 4);
		this.moneyText.setOrigin(0.5);
		this.panel.add(this.moneyText);
	}

	update(time: number, delta: number) {}

	setDay(day: number) {
		this.dayText.setText(`Day ${day}`);
	}

	setTimeOfDay(time: number) {
		this.dayProgressTimer.redraw(time);
	}

	setMoney(money: number) {
		this.moneyText.setText(`Money: $${money}`);
	}
}
