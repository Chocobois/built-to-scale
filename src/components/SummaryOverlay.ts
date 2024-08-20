import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { TextButton } from "./TextButton";
import { Color } from "@/utils/colors";

export class SummaryOverlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Rectangle;
	private panel: RoundRectangle;
	private dayText: Phaser.GameObjects.Text;
	private statsLeftText: Phaser.GameObjects.Text;
	private statsRightText: Phaser.GameObjects.Text;
	private okButton: TextButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		this.setVisible(false);
		this.setAlpha(0);

		// Fullscreen blackness
		this.background = this.scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.75);
		this.background.setOrigin(0);
		this.add(this.background);
		this.background.setInteractive();

		this.panel = new RoundRectangle(scene, {
			x: scene.W / 2,
			y: scene.H / 2,
			width: 1000,
			height: 800,
			radius: 20,
			color: 0xffffff,
		});
		this.add(this.panel);

		this.dayText = this.scene.addText({
			x: 0,
			y: -300,
			size: 90,
			color: "#FFFFFF",
		});
		this.dayText.setOrigin(0.5);
		this.dayText.setStroke("black", 8);
		this.panel.add(this.dayText);

		let rect = this.scene.add.rectangle(0, 0, 2, 380, 0, 0.5);
		this.panel.add(rect);

		this.statsLeftText = this.scene.addText({
			x: -30,
			y: 0,
			size: 60,
			color: "#FFFFFF",
		});
		this.statsLeftText.setStroke("black", 6);
		this.statsLeftText.setOrigin(1, 0.5);
		this.statsLeftText.setAlign("right");
		this.panel.add(this.statsLeftText);

		this.statsRightText = this.scene.addText({
			x: 30,
			y: 0,
			size: 60,
			color: "#FFFFFF",
		});
		this.statsRightText.setStroke("black", 6);
		this.statsRightText.setOrigin(0, 0.5);
		this.panel.add(this.statsRightText);

		this.okButton = new TextButton(scene, 0, 300, 200, 100, "OK");
		this.panel.add(this.okButton);
		this.okButton.on("click", () => {
			this.emit("progress");
		});
	}

	update(time: number, delta: number) {
		this.okButton.update(time, delta);
	}

	open(
		day: number,
		dailyStats: {
			money: number;
			tip: number;
			happyCustomers: number;
			angryCustomers: number;
		}
	) {
		this.setVisible(true);
		this.setAlpha(0);
		this.scene.tweens.add({
			targets: this,
			alpha: 1,
			duration: 200,
		});

		this.dayText.setText(`Day ${day}`);

		let text = "";
		text += `Earnings\n`;
		text += `Tips\n`;
		text += `\n`;
		text += `Customers\n`;
		text += `Angered`;
		this.statsLeftText.setText(text);

		text = "";
		text += `$${dailyStats.money}\n`;
		text += `$${dailyStats.tip}\n`;
		text += `\n`;
		text += `${dailyStats.happyCustomers}\n`;
		text += `${dailyStats.angryCustomers}`;
		this.statsRightText.setText(text);

		this.scene.sound.play("flail", { volume: 0.3 });
	}

	close() {
		this.setVisible(true);
		this.setAlpha(1);
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 200,
			onComplete: () => {
				this.setVisible(false);
			},
		});
		this.scene.sound.play("missLand", { volume: 0.2 });
	}
}
