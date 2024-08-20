import { GameScene } from "@/scenes/GameScene";
import { Color, ColorStr } from "@/utils/colors";
import { Button } from "./elements/Button";
import { TextButton } from "./TextButton";

export const enum Mode {
	IntroCutscene1,
	IntroCutscene2,
	IntroCutscene3,

	NextLevelCutscene,

	TheEnd,
}

export class Intermission extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public mode: Mode;
	public transitionProgress: number;

	private graphics: Phaser.GameObjects.Graphics;
	private cutscene: Phaser.GameObjects.Image;

	private rect: Phaser.GameObjects.Rectangle;
	private subtitles: Phaser.GameObjects.Text;
	private queuedLines: { text: string; tint?: number }[];

	private button: Button;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;
		scene.add.existing(this);

		/* Masking */

		this.graphics = this.scene.make.graphics();
		this.graphics.fillStyle(Color.White);

		let mask = this.graphics.createGeometryMask();
		mask.setInvertAlpha(true);
		this.setMask(mask);

		// this.redrawMask(scene.CX, scene.CY, scene.W);

		/* Background */

		this.rect = scene.add.rectangle(
			scene.CX,
			scene.CY,
			scene.W,
			scene.H,
			Color.Black
		);
		this.rect.setInteractive();
		this.add(this.rect);

		/* Content */

		this.cutscene = scene.add.image(scene.CX, scene.CY, "cutscene_dummy1");
		this.cutscene.setVisible(false);
		this.scene.fitToScreen(this.cutscene);
		this.add(this.cutscene);

		this.subtitles = scene.addText({
			x: scene.CX,
			y: scene.H - 100,
			size: 64,
			color: ColorStr.Black,
			text: "subtitles",
		});
		this.subtitles.setOrigin(0.5);
		this.subtitles.setPadding(10);
		this.subtitles.setWordWrapWidth(0.7 * scene.W);
		this.subtitles.setStroke(ColorStr.White, 16);
		this.add(this.subtitles);

		this.queuedLines = [];
		this.transitionProgress = 0;

		/* Button */

		this.button = new TextButton(
			scene,
			scene.W - 240,
			scene.H - 120,
			280,
			120,
			">",
			130
		);
		this.add(this.button);
		this.button.on("click", this.proceed, this);

		/* Init */

		this.setMode(Mode.IntroCutscene1);
		this.scene.addEvent(500, () => {
			this.emit("restartLevel");
		});
	}

	update(time: number, delta: number) {
		this.button.setScale(1.0 - 0.1 * this.button.holdSmooth);
	}

	setMode(mode: Mode) {
		this.mode = mode;

		// Set content
		switch (mode) {
			case Mode.IntroCutscene1:
				this.cutscene.setTexture("cutscene_dummy1");
				this.queuedLines = [
					{ text: "Somewhere in Chocoland" },
					{ text: "What a nice day for a walk.", tint: 0xfff69b },
					{ text: "Nothing can go wrong...", tint: 0xffb8aa },
				];
				break;

			case Mode.IntroCutscene2:
				this.cutscene.setTexture("cutscene_dummy2");
				this.queuedLines = [
					{ text: "Oh no!", tint: 0xffb8aa },
					{ text: "Not the mud...!", tint: 0xffb8aa },
				];
				break;

			case Mode.IntroCutscene3:
				this.cutscene.setTexture("cutscene_dummy3");
				this.queuedLines = [
					{ text: "Are you OK?", tint: 0xfff69b },
					{ text: "My scales are all dirty.", tint: 0xffb8aa },
					{ text: "Let's get you cleaned up.", tint: 0xfff69b },
					{ text: "(*gasp* A customer!)", tint: 0xffd34f },
				];
				break;

			case Mode.NextLevelCutscene:
				this.cutscene.setTexture("cutscene_dummy4");
				this.queuedLines = [
					{ text: "Wow! A new location." },
					{ text: "Congratulations!" },
				];
				break;

			case Mode.TheEnd:
				this.queuedLines = [{ text: "The End" }];
		}

		// Show or hide elements
		switch (mode) {
			case Mode.IntroCutscene1:
			case Mode.IntroCutscene2:
			case Mode.IntroCutscene3:
			case Mode.NextLevelCutscene:
				// Fade in cutscene image
				this.cutscene.setVisible(true);
				this.cutscene.setAlpha(0);
				this.scene.tweens.add({
					targets: this.cutscene,
					alpha: { from: 0, to: 1 },
					duration: 500,
				});

				this.button.setVisible(false);
				this.subtitles.setVisible(false);
				this.scene.addEvent(1000, this.showNextLine, this);
				break;

			default:
				this.cutscene.setVisible(false);
				this.button.setVisible(false);
				this.subtitles.setVisible(false);
		}
	}

	showNextLine() {
		let line = this.queuedLines.shift();
		if (line) {
			this.subtitles.setText(line.text);
			this.subtitles.setTint(line.tint ?? 0xffffff);
			this.subtitles.setVisible(true);
			this.button.setVisible(true);
		}
	}

	proceed() {
		this.scene.sound.play("scroll", { volume: 0.3 });

		if (this.queuedLines.length > 0) {
			this.button.setVisible(false);
			this.subtitles.setVisible(false);
			this.scene.addEvent(500, this.showNextLine, this);
			return;
		}

		switch (this.mode) {
			case Mode.IntroCutscene1:
				this.setMode(Mode.IntroCutscene2);
				break;

			case Mode.IntroCutscene2:
				this.setMode(Mode.IntroCutscene3);
				break;

			case Mode.IntroCutscene3:
				this.emit("startDay");
				break;

			case Mode.NextLevelCutscene:
				this.emit("nextLevel");
				break;
		}
	}

	fadeToGame() {
		this.hideContent();

		// Reveal full screen
		this.scene.tweens.addCounter({
			duration: 1000,
			from: 0,
			to: 1,
			ease: Phaser.Math.Easing.Quintic.InOut,
			onUpdate: (tween, target, key, current: number) => {
				this.transitionProgress = current;
				let radius = current * 0.6 * this.scene.W;
				this.redrawMask(this.scene.CX, this.scene.CY, radius);
			},
			onComplete: () => {
				this.setVisible(false);
				this.transitionProgress = 0;
			},
		});
	}

	fadeToIntermission(mode: Mode) {
		this.setMode(mode);
		this.setVisible(true);

		this.scene.tweens.addCounter({
			duration: 1000,
			from: 1,
			to: 0,
			ease: Phaser.Math.Easing.Quintic.InOut,
			onUpdate: (tween, target, key, current: number) => {
				let radius = current * 0.6 * this.scene.W;
				this.redrawMask(this.scene.CX, this.scene.CY, radius);
			},
			onStart: () => {
				this.showContent();
			},
			onComplete: () => {
				// Automatic transitions
				// if (mode == Mode.LoadingNextLevel) {
				// 	this.emit("nextLevel");
				// }
			},
		});
	}

	redrawMask(x: number, y: number, radius: number) {
		this.graphics.clear();
		this.graphics.fillCircle(x, y, radius);
	}

	showContent() {
		this.scene.tweens.add({
			targets: [this.button, this.subtitles],
			alpha: { from: 0, to: 1 },
			duration: 500,
			ease: Phaser.Math.Easing.Sine.Out,
			onComplete: () => {
				this.button.enabled = true;
			},
		});
	}

	hideContent() {
		this.button.enabled = false;

		this.scene.tweens.add({
			targets: [this.button, this.subtitles],
			alpha: { from: 1, to: 0 },
			duration: 500,
			ease: Phaser.Math.Easing.Sine.Out,
		});
	}
}
