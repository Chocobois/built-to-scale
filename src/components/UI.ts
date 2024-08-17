import { GameScene } from "@/scenes/GameScene";
import { Timer } from "./Timer";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private moneyText: Phaser.GameObjects.Text;
	private dayText: Phaser.GameObjects.Text;
	private dayProgressTimer: Timer;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelHeight = 200;

		this.panel = this.scene.add.container(0, 0);
		this.add(this.panel);

		this.background = this.scene.add.image(0, 0, "hud");
		this.background.setScale(panelHeight / this.background.height);
		this.background.setVisible(false);
		this.panel.add(this.background);

		this.dayText = this.scene.addText({
			x: 100,
			y: 200,
			size: 60,
			color: "#FFFFFF",
			text: "Day 1",
		});
		this.dayText.setOrigin(0.5);
		this.dayText.setStroke("black", 4);
		this.panel.add(this.dayText);

		this.moneyText = this.scene.addText({
			x: 0,
			y: 240,
			size: 40,
			color: "#FFFFFF",
			text: "Money: $0",
		});
		this.moneyText.setStroke("black", 4);
		this.panel.add(this.moneyText);

		this.dayProgressTimer = new Timer(scene, 100, 100, 200, 0xff7700);
		this.add(this.dayProgressTimer);
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
