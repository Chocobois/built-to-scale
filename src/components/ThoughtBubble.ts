import { GameScene } from "@/scenes/GameScene";
import { StationType, StationTypeData } from "./StationData";

export class ThoughtBubble extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Ellipse;
	private symbol: Phaser.GameObjects.Image;

	constructor(scene: GameScene, x: number, y: number, size: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.background = this.scene.add.sprite(0, 0, "bubble");
		this.background.setScale(0.5);
		this.background.setVisible(false);
		this.add(this.background);

		this.image = this.scene.add.ellipse(0, -0.05 * size, 40, 40, 0);
		this.image.setVisible(false);
		this.add(this.image);

		this.symbol = this.scene.add.image(0, -0.02 * size, "exclamation");
		this.symbol.setScale(70 / this.symbol.width);
		this.symbol.setVisible(false);
		this.add(this.symbol);
	}

	hide() {
		this.background.setVisible(false);
		this.image.setVisible(false);
		this.symbol.setVisible(false);
	}

	setRequest(type: StationType | null) {
		this.background.setVisible(type !== null);
		this.image.setVisible(type !== null);
		this.symbol.setVisible(false);

		if (type !== null) {
			this.image.fillColor = StationTypeData[type].color;
		}

		if (type === StationType.CashRegister) {
			this.showSymbol("money");
		}
	}

	showSymbol(
		key:
			| "exclamation"
			| "angyv"
			| "happy"
			| "love"
			| "money"
			| "question"
			| "sad"
	) {
		this.background.setVisible(true);
		this.image.setVisible(false);
		this.symbol.setVisible(true);

		this.symbol.setTexture(key);
	}
}
