import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { TextButton } from "./TextButton";

export class Overlay extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Rectangle;
	private panel: RoundRectangle;
	private dayText: Phaser.GameObjects.Text;
	private moneyText: Phaser.GameObjects.Text;
	private okButton: TextButton;

	constructor(scene: GameScene) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;

		// Fullscreen blackness
		this.background = this.scene.add.rectangle(0, 0, scene.W, scene.H, 0, 0.75);
		this.background.setOrigin(0);
		this.add(this.background);

		this.panel = new RoundRectangle(scene, {
			x: scene.W / 2,
			y: scene.H / 2,
			width: 1000,
			height: 800,
			radius: 20,
			color: 0xffffff,
		});
		this.add(this.panel);

		const panelWidth = 300;
		const panelHeight = 400;

		this.dayText = this.scene.addText({
			x: 0,
			y: -300,
			size: 60,
			color: "#FFFFFF",
			text: "Day 1",
		});
		this.dayText.setOrigin(0.5);
		this.dayText.setStroke("black", 4);
		this.panel.add(this.dayText);

		this.moneyText = this.scene.addText({
			x: 0,
			y: -100,
			size: 40,
			color: "#FFFFFF",
			text: "Money earned: $123\nCustomers served: 12\nAngry customers: 1",
		});
		this.moneyText.setStroke("black", 4);
		this.moneyText.setOrigin(0.5);
		this.panel.add(this.moneyText);

		this.okButton = new TextButton(scene, 0, 300, "OK");
		this.panel.add(this.okButton);
		this.okButton.on("click", () => {
			this.emit("progress");
		});
	}

	update(time: number, delta: number) {
		this.okButton.update(time, delta);
	}
}
