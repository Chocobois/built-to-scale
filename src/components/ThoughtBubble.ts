import { GameScene } from "@/scenes/GameScene";
import { StationSymbol, StationType, StationTypeData } from "./StationData";

export class ThoughtBubble extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Image;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.background = this.scene.add.sprite(0, 0, "bubble");
		this.background.setScale(0.5);
		this.add(this.background);

		this.image = this.scene.add.image(0, -4, "blanksq");
		this.add(this.image);

		this.setVisible(false);
	}

	setRequest(symbolKey: StationSymbol) {
		this.setVisible(true);
		this.image.setTexture(symbolKey);
		this.image.setScale(70 / this.image.width);
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
			| "h1"
			| "h2"
			| "h3"
			| "h4"
			| "h5"
			| "h6"
	) {
		this.setVisible(true);
		this.image.setTexture(key);
		this.image.setScale(70 / this.image.width);
	}
}
