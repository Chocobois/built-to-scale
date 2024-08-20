import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { Button } from "./elements/Button";
import { Color } from "@/utils/colors";

export class TextButton extends Button {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number, width: number, height: number, text: string, textSize: number = 48) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		this.border = new RoundRectangle(scene, {
			width: width + 20,
			height: height + 20,
			radius: 20 + 10,
			color: Color.White,
		});
		this.add(this.border);

		this.background = new RoundRectangle(scene, {
			width,
			height,
			radius: 20,
			color: Color.Green700,
		});
		this.add(this.background);

		this.text = this.scene.addText({
			size: textSize,
			color: "#FFFFFF",
			text,
		});
		this.text.setOrigin(0.5);
		// this.text.setStroke("black", 8);
		this.add(this.text);

		this.bindInteractive(this.border);
	}

	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}

	setText(text: string) {
		this.text.setText(text);
	}

	setEnabled(enabled: boolean) {
		this.setAlpha(enabled ? 1 : 0.5);
		this.border.input!.enabled = enabled;
		this.background.setColor(enabled ? Color.Green700 : Color.Gray500);
	}
}
