import { GameScene } from "@/scenes/GameScene";
import { StationType, StationTypeData } from "./StationData";
import { ColorStr } from "@/utils/colors";

export class UpgradeIcon extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private size: number;
	private upText: Phaser.GameObjects.Text;
	private plusText: Phaser.GameObjects.Text;

	private affordable: boolean = false;

	constructor(scene: GameScene, x: number, y: number, cellSize: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.size = cellSize / 190;

		this.upText = this.scene
			.addText({
				size: 80,
				text: `⬆`,
				color: ColorStr.Green600,
			})
			.setOrigin(0.5)
			.setStroke(ColorStr.White, 12);
		this.upText.setVisible(false);
		this.add(this.upText);

		this.plusText = this.scene
			.addText({
				size: 120,
				text: `+`,
				color: ColorStr.Sky600,
			})
			.setOrigin(0.5)
			.setStroke(ColorStr.White, 12);
		this.add(this.plusText);
	}

	update(time: number, delta: number) {
		if (!this.visible) return;

		const bounce = this.affordable ? 1 + 0.07 * Math.sin(time / 200) : 1;
		this.upText.setScale(bounce);
		this.plusText.setScale(bounce);
	}

	setPurchased(isPurchased: boolean) {
		this.upText.setVisible(isPurchased);
		this.plusText.setVisible(!isPurchased);
	}

	setAffordable(isAffordable: boolean) {
		this.affordable = isAffordable;

		this.upText.setColor(
			this.affordable ? ColorStr.Green600 : ColorStr.Gray700
		);
		this.plusText.setColor(
			this.affordable ? ColorStr.Sky600 : ColorStr.Gray700
		);
		this.setAlpha(isAffordable ? 1 : 0.3);
		this.setScale(isAffordable ? this.size : 0.75 * this.size);
	}
}
