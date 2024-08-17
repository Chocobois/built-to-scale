import { GameScene } from "@/scenes/GameScene";
import { StationType, StationTypeData } from "./StationData";

export class ThoughtBubble extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Ellipse;
	private exclamation: Phaser.GameObjects.Image;

	constructor(scene: GameScene, x: number, y: number, size: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.background = this.scene.add.sprite(0, 0, "bubble");
		this.background.setScale(0.5);
		this.background.setVisible(false);
		this.add(this.background);

		this.image = this.scene.add.ellipse(0, -0.07 * size, 40, 40, 0);
		this.image.setVisible(false);
		this.add(this.image);

		this.exclamation = this.scene.add.image(0, -0.07 * size, "exclamation");
		this.exclamation.setScale(60 / this.exclamation.width);
		this.exclamation.setVisible(false);
		this.add(this.exclamation);
	}

	setRequest(type: StationType | null) {
		this.background.setVisible(type !== null);
		this.image.setVisible(type !== null);
		this.exclamation.setVisible(false);

		if (type !== null) {
			this.image.fillColor = StationTypeData[type].color;
		}
	}

	markAsReady() {
		this.image.setVisible(false);
		this.exclamation.setVisible(true);
	}
}
