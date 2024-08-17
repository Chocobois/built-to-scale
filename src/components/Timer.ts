import { GameScene } from "@/scenes/GameScene";

export class Timer extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
	private graphics: Phaser.GameObjects.Graphics;
	private size: number;
	private color: number;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		size: number,
		color: number
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.size = size;
		this.color = color;

		this.background = this.scene.add.image(0, 0, "timer");
		this.background.setScale(size / this.background.width);
		this.add(this.background);

		this.graphics = this.scene.add.graphics();
		this.add(this.graphics);
	}

	setColor(color: number) {
		this.color = color;
	}

	redraw(factor: number) {
		const radius = 0.24 * this.size;
		const border = 0.055 * this.size;

		this.graphics.clear();
		this.graphics.beginPath();
		this.graphics.fillStyle(this.color);
		this.graphics.moveTo(0, 0);
		this.graphics.arc(
			0,
			0,
			radius - border,
			-Math.PI / 2,
			-Math.PI / 2 + factor * 2 * Math.PI
		);
		this.graphics.closePath();
		this.graphics.fillPath();
	}
}
