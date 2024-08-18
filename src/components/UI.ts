import { GameScene } from "@/scenes/GameScene";
import { Timer } from "./Timer";
import { TextButton } from "./TextButton";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private dayProgressTimer: Timer;
	private dayText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private nextButton: TextButton;
	private newLocationButton: TextButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelWidth = 300;
		const panelHeight = 600;

		this.panel = this.scene.add.container(
			scene.W - panelWidth / 2 - 50,
			panelHeight / 2 + 50
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
			y: 100,
			size: 40,
			color: "#FFFFFF",
			text: "Money: $0",
		});
		this.moneyText.setStroke("black", 4);
		this.moneyText.setOrigin(0.5);
		this.panel.add(this.moneyText);

		this.nextButton = new TextButton(scene, 0, 300, 240, 80, "Next day");
		this.panel.add(this.nextButton);
		this.nextButton.on("click", () => {
			this.emit("nextDay");
		});

		this.newLocationButton = new TextButton(scene, 0, 440, 240, 80, "Move");
		this.panel.add(this.newLocationButton);
		this.newLocationButton.on("click", () => {
			this.emit("nextLevel");
		});
		this.newLocationButton.setVisible(false);
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

	setShoppingMode(isShopping: boolean) {
		this.nextButton.setVisible(isShopping);
	}
}
