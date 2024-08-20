import { GameScene } from "@/scenes/GameScene";
import { Timer } from "./Timer";
import { TextButton } from "./TextButton";
import { Level } from "./Levels";
import { RoundRectangle } from "./elements/RoundRectangle";
import { numberWithCommas } from "@/utils/functions";
import { Color, ColorStr } from "@/utils/colors";

export class UI extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private panel: Phaser.GameObjects.Container;
	private background: Phaser.GameObjects.Image;
	private dayProgressTimer: Timer;
	private clockText: Phaser.GameObjects.Text;
	private dayText: Phaser.GameObjects.Text;
	private moneyTitle: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private nextButton: TextButton;
	private newLocationButton: TextButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		const panelWidth = 330;
		const panelHeight = 500;
		const pad = 13;

		this.panel = this.scene.add.container(
			scene.W - panelWidth / 2 - pad,
			panelHeight / 2 + pad
		);
		this.add(this.panel);

		const rect = new RoundRectangle(scene, {
			x: 0,
			y: 0,
			width: panelWidth,
			height: panelHeight,
			radius: 20,
			color: 0x000000,
			alpha: 0.6,
		});
		this.panel.add(rect);

		this.dayProgressTimer = new Timer(
			scene,
			0,
			-panelHeight / 2 + 215,
			370,
			0xff7700
		);
		this.panel.add(this.dayProgressTimer);

		this.clockText = this.scene.addText({
			x: 0,
			y: this.dayProgressTimer.y,
			size: 35,
			color: "#FFFFFF",
			text: "09:00",
		});
		this.clockText.setOrigin(0.5);
		this.clockText.setStroke("black", 6);
		this.panel.add(this.clockText);

		this.dayText = this.scene.addText({
			x: 0,
			y: -panelHeight / 2 + 70,
			size: 60,
			color: "#FFFFFF",
			text: "Day 1",
		});
		this.dayText.setOrigin(0.5);
		this.dayText.setStroke("black", 8);
		this.panel.add(this.dayText);

		this.moneyTitle = this.scene.addText({
			x: 0,
			y: 105,
			size: 30,
			color: "#FFFFFF",
			text: "Money",
		});
		this.moneyTitle.setStroke("black", 6);
		this.moneyTitle.setOrigin(0.5);
		this.panel.add(this.moneyTitle);

		this.moneyText = this.scene.addText({
			x: 0,
			y: this.moneyTitle.y + 55,
			size: 60,
			color: "#FFFFFF",
			text: "$0",
		});
		this.moneyText.setStroke("black", 8);
		this.moneyText.setOrigin(0.5);
		this.panel.add(this.moneyText);

		this.nextButton = new TextButton(scene, 0, 600, 300, 90, "Start day");
		this.panel.add(this.nextButton);
		this.nextButton.on("click", () => {
			this.scene.sound.play("scroll", { volume: 0.3 });
			this.emit("nextDay");
		});

		this.newLocationButton = new TextButton(scene, 0, 400, 300, 200, "...");
		this.panel.add(this.newLocationButton);
		this.newLocationButton.on("click", () => {
			this.scene.sound.play("score", { volume: 1.0 });
			this.emit("nextLevel");
		});
	}

	update(time: number, delta: number) {
		this.nextButton.update(time, delta);
		this.newLocationButton.update(time, delta);
	}

	setDay(day: number) {
		this.dayText.setText(`Day ${day}`);
	}

	setTimeOfDay(time: number) {
		this.dayProgressTimer.redraw(time);

		const startHour = 9;
		const endHour = 16;
		const hour = startHour + time * (endHour - startHour);
		const minute = (hour % 1) * 60;
		const hourStr = Math.floor(hour).toString().padStart(2, "0");
		const minuteStr = (Math.floor(minute / 10) * 10)
			.toString()
			.padStart(2, "0");
		this.clockText.setText(`${hourStr}:${minuteStr}`);

		if (time == 1) {
			this.clockText.setText(`Closed`);
		}
	}

	setLevel(level: Level) {
		this.newLocationButton.setData("cost", level.upgradeCost);
		this.newLocationButton.setVisible(level.upgradeCost !== undefined);
		this.newLocationButton.setText(
			`Upgrade\n     shop\n   $${numberWithCommas(level.upgradeCost ?? 0)}`
		);
	}

	setMoney(money: number) {
		this.moneyText.setText(`$${numberWithCommas(money)}`);

		const upgradeCost = this.newLocationButton.getData("cost");
		const canUpgrade = money >= upgradeCost;
		this.newLocationButton.setEnabled(canUpgrade);
	}

	setShoppingMode(isShopping: boolean) {
		this.nextButton.setVisible(isShopping);

		const canUpgrade = this.newLocationButton.getData("cost") !== undefined;
		this.newLocationButton.setVisible(isShopping && canUpgrade);
	}
}
