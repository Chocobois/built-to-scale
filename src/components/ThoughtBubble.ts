import { GameScene } from "@/scenes/GameScene";
import { StationType, StationTypeData } from "./StationData";

export class ThoughtBubble extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Image;
	private symbol: Phaser.GameObjects.Image;

	constructor(scene: GameScene, x: number, y: number, size: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.background = this.scene.add.sprite(0, 0, "bubble");
		this.background.setScale(0.5);
		this.background.setVisible(false);
		this.add(this.background);

		this.image = this.scene.add.image(0, -0.02*size, "blanksq");
		this.image.setVisible(false);
		this.image.setScale(0.1);
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
			switch(StationTypeData[type].color) {
				case 0xff0000: {
					this.image.setTexture("nail");
					break;
				} case 0xffff00: {
					this.image.setTexture("wax");
					break;
				} case 0x0000ff: {
					this.image.setTexture("bath");
					break;
				}
			}
			//this.image.fillColor = StationTypeData[type].color;
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
			| "h1"
			| "h2"
			| "h3"
			| "h4"
			| "h5"
			| "h6"
	) {
		this.background.setVisible(true);
		this.image.setVisible(false);
		this.symbol.setVisible(true);

		this.symbol.setTexture(key);
	}
}
