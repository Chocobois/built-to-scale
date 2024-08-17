import { GameScene } from "@/scenes/GameScene";
import { RoundRectangle } from "./elements/RoundRectangle";
import { Button } from "./elements/Button";

export class TextButton extends Button {
	public scene: GameScene;

	private border: RoundRectangle;
	private background: RoundRectangle;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number, text: string) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		const width = 200;
		const height = 80;

		this.border = new RoundRectangle(scene, {
			width: width + 20,
			height: height + 20,
			radius: 20 + 10,
			color: 0x777777,
		});
		this.add(this.border);

		this.background = new RoundRectangle(scene, {
			width,
			height,
			radius: 20,
			color: 0xffffff,
		});
		this.add(this.background);

		this.text = this.scene.addText({
			size: 40,
			color: "#FFFFFF",
			text,
		});
		this.text.setOrigin(0.5);
		this.text.setStroke("black", 4);
		this.add(this.text);

		this.bindInteractive(this.border);
	}

	update(time: number, delta: number) {
		this.setScale(1.0 - 0.1 * this.holdSmooth);
	}

    open() {
        
    }
}
