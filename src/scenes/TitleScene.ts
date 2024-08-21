import { BaseScene } from "@/scenes/BaseScene";
import { Music } from "@/utils/Music";

import { title, version } from "@/version.json";

const creditsLeft = `Golen
Lumie
Luxx
ArcticFqx
Mato
Kiso
Soulsong
Nemi
Dreeda
Frassy`;

const creditsRight = `code
code & art
art
code
music
art
art
art
code
QA`;

export class TitleScene extends BaseScene {
	public background: Phaser.GameObjects.Image;
	public chairs: Phaser.GameObjects.Image;
	public bath: Phaser.GameObjects.Image;
	public washbear_tail: Phaser.GameObjects.Image;
	public washbear_hand: Phaser.GameObjects.Image;
	public tail: Phaser.GameObjects.Image;
	public hand: Phaser.GameObjects.Image;
	public sparkles: Phaser.GameObjects.Particles.ParticleEmitter;
	public logo: Phaser.GameObjects.Image;

	public credits: Phaser.GameObjects.Container;
	public subtitle: Phaser.GameObjects.Text;
	public tap: Phaser.GameObjects.Text;
	public version: Phaser.GameObjects.Text;

	public musicTitle: Phaser.Sound.WebAudioSound;
	public select: Phaser.Sound.WebAudioSound;
	public select2: Phaser.Sound.WebAudioSound;

	public isStarting: boolean;

	constructor() {
		super({ key: "TitleScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);

		this.background = this.add
			.image(0, 0, "title_background")
			.setOrigin(0)
			.setAlpha(0)
			.setVisible(false);
		this.chairs = this.add
			.image(70 + 214, 220 + (226*1.8), "title_chairs")
			.setOrigin(0.5, 0.9)
			.setAlpha(0)
			.setVisible(false);
		this.bath = this.add
			.image(425 + 173, 430 + (155*1.9), "title_bath")
			.setOrigin(0.5, 0.9)
			.setAlpha(0)
			.setVisible(false);
		this.washbear_tail = this.add
			.image(630 + 156, 590 + (190*1.8), "title_washbear_tail")
			.setOrigin(0.5, 0.9)
			.setAlpha(0)
			.setVisible(false);
		this.tail = this.add.image(0, 0, "title_tail").setAlpha(0).setOrigin(0);
		this.hand = this.add.image(this.W, 0, "title_hand").setAlpha(0).setOrigin(1, 0);
		this.sparkles = this.add.particles(0, 0, "sparklesyass", sparkleConfig);
		this.washbear_hand = this.add
			.image(1180 + 195, 600 + (240*1.8), "title_washbear_hand")
			.setOrigin(0.5, 0.9)
			.setAlpha(0)
			.setVisible(false);
		this.logo = this.add
			.image(this.CX, 270, "title_logo")
			.setScale(1)
			.setAlpha(0)
			.setVisible(false);

		this.containToScreen(this.background);

		this.tail.x -= 400;
		this.hand.x += 400;
		this.sparkles.stop(true);
		// this.sparkles.onParticleEmit( () =>
		// 	this.sparkles.setFrequency(Phaser.Math.RND.between(200, 400))
		// );

		this.subtitle = this.addText({
			x: this.CX,
			y: 0.87 * this.H,
			size: 120,
			color: "#000",
			text: "Tap to start",
		});
		this.subtitle.setOrigin(0.5);
		this.subtitle.setStroke("#FFF", 16);
		this.subtitle.setPadding(2);
		this.subtitle.setVisible(false);
		this.subtitle.setAlpha(0);

		this.tap = this.addText({
			x: this.CX,
			y: this.CY,
			size: 140,
			color: "#000",
			text: "Tap to focus",
		});
		this.tap.setOrigin(0.5);
		this.tap.setAlpha(-1);
		this.tap.setStroke("#FFF", 16);
		this.tap.setPadding(2);

		this.version = this.addText({
			x: this.W,
			y: this.H,
			size: 40,
			color: "#000",
			text: version,
		});
		this.version.setOrigin(1, 1);
		this.version.setAlpha(-1);
		this.version.setStroke("#FFF", 6);
		this.version.setPadding(2);

		this.credits = this.add.container(0, 0);
		this.credits.setVisible(false);
		this.credits.setAlpha(0);

		let credits1 = this.addText({
			x: 0.76 * this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsLeft,
		});
		credits1.setStroke("#FFF", 8);
		credits1.setPadding(2);
		credits1.setLineSpacing(0);
		this.credits.add(credits1);

		let credits2 = this.addText({
			x: this.W,
			y: 0,
			size: 40,
			color: "#c2185b",
			text: creditsRight,
		});
		credits2.setOrigin(1, 0);
		credits2.setStroke("#FFF", 8);
		credits2.setPadding(2);
		credits2.setLineSpacing(0);
		this.credits.add(credits2);

		// Music
		if (!this.musicTitle) {
			this.musicTitle = new Music(this, "m_main_menu", { volume: 0.4 });
			this.musicTitle.on("bar", this.onBar, this);
			this.musicTitle.on("beat", this.onBeat, this);

			// this.select = this.sound.add("dayShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
			// this.select2 = this.sound.add("nightShift", { volume: 0.8, rate: 1.0 }) as Phaser.Sound.WebAudioSound;
		}
		this.musicTitle.play({ loop: false });

		// Input

		this.input.keyboard
			?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
			.on("down", this.progress, this);
		this.input.on(
			"pointerdown",
			(pointer: PointerEvent) => {
				if (pointer.button == 0) {
					this.progress();
				}
			},
			this
		);
		this.isStarting = false;
	}

	update(time: number, delta: number) {
		if (this.background.visible) {
			this.tail.x += 0.03 * (0 - this.tail.x);
			this.hand.x += 0.03 * (this.W - this.hand.x);

			this.tail.alpha += 0.05 * (1 - this.tail.alpha);
			this.hand.alpha += 0.05 * (1 - this.hand.alpha);
			if (this.background.visible)
				this.background.alpha += 0.1 * (1 - this.background.alpha);
			if (this.chairs.visible)
				this.chairs.alpha += 0.1 * (1 - this.chairs.alpha);
			if (this.bath.visible) this.bath.alpha += 0.1 * (1 - this.bath.alpha);
			if (this.washbear_tail.visible)
				this.washbear_tail.alpha += 0.1 * (1 - this.washbear_tail.alpha);
			if (this.washbear_hand.visible)
				this.washbear_hand.alpha += 0.1 * (1 - this.washbear_hand.alpha);
			if (this.tail.visible) this.tail.alpha += 0.1 * (1 - this.tail.alpha);
			if (this.hand.visible) this.hand.alpha += 0.1 * (1 - this.hand.alpha);
			if (this.logo.visible) this.logo.alpha += 0.1 * (1 - this.logo.alpha);

			// Wobble
			this.washbear_hand.setScale(1, 1 + 0.02 * Math.sin((3 * time) / 1000));
			this.washbear_tail.setScale(1, 1 - 0.02 * Math.sin((3 * time) / 1000));
			this.bath.setScale(1, 1 + 0.02 * Math.cos((3 * time) / 1000));
			this.chairs.setScale(1, 1 - 0.02 * Math.cos((3 * time) / 1000));

			this.subtitle.alpha +=
				0.02 * ((this.subtitle.visible ? 1 : 0) - this.subtitle.alpha);
			this.version.alpha +=
				0.02 * ((this.version.visible ? 1 : 0) - this.version.alpha);

			if (this.credits.visible) {
				this.credits.alpha += 0.02 * (1 - this.credits.alpha);
			}
		} else {
			this.tap.alpha += 0.01 * (1 - this.tap.alpha);

			if (this.musicTitle.seek > 0) {
				this.background.setVisible(true);
				this.tap.setVisible(false);
			}
		}

		this.subtitle.setScale(1 + 0.02 * Math.sin((5 * time) / 1000));

		if (this.isStarting) {
			this.subtitle.setAlpha(0.6 + 0.4 * Math.sin((50 * time) / 1000));
		}
	}

	progress() {
		if (!this.background.visible) {
			this.onBar(1);
		} else if (!this.subtitle.visible) {
			this.subtitle.setVisible(true);
			this.subtitle.setAlpha(1);
		} else if (!this.isStarting) {
			this.sound.play("t_rustle", { volume: 0.3 });
			// this.sound.play("m_slice", { volume: 0.3 });
			// this.sound.play("u_attack_button", { volume: 0.5 });
			// this.select2.play();
			this.isStarting = true;
			this.flash(3000, 0xffffff, 0.6);

			this.addEvent(1000, () => {
				this.fade(true, 1000, 0x000000);
				this.addEvent(1050, () => {
					this.musicTitle.stop();
					this.scene.start("GameScene");
				});
			});
		}
	}

	onBar(bar: number) {
		if (bar >= 3) this.chairs.setVisible(true);
		if (bar >= 4) this.bath.setVisible(true);
		if (bar >= 7) this.washbear_tail.setVisible(true);
		if (bar >= 8) this.washbear_hand.setVisible(true);
		if (bar >= 8) this.sparkles.start();
		if (bar >= 10) this.logo.setVisible(true);
		if (bar == 11) this.tweens.add({
			targets: this.logo,
			angle: {from: 0, to: -3},
			duration: 800,
			ease: Phaser.Math.Easing.Sine.InOut,
		})
		if (bar == 13) this.tweens.add({
			targets: this.logo,
			scale: {from: 1.03, to: 1},
			angle: {from: 3, to: 0},
			duration: 500,
			delay: 150,
			ease: Phaser.Math.Easing.Cubic.Out,
		})
		if (bar >= 14) {
			this.subtitle.setVisible(true);
			this.credits.setVisible(true);
		}
	}

	onBeat(time: number) {
		// this.select.play();
	}
}

const sparkleConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
	lifespan: {min: 700, max: 1300},
	blendMode: "ADD",
	speed: 0,
	scale: { start: 1.1, end: 0.9 },
	alpha: { start: 1,   end: 0 },
	frequency: 200,
	frame: [0, 1, 2, 3],
	emitting: true,
	emitZone: new Phaser.GameObjects.Particles.Zones.RandomZone({
		getRandomPoint(point) {
			const shape = new Phaser.Geom.Rectangle(1360, 380, 440, 500);
			const shape2 = new Phaser.Geom.Polygon("1440 470 1615 410 1740 610 1655 715 1610 855 1490 820 1400 640");
			for (let i = 0; i < 10; i++) {
				const newPoint = shape.getRandomPoint();
				if (shape2.contains(newPoint.x, newPoint.y)) {
					point.x = newPoint.x;
					point.y = newPoint.y;
				}
			}
			point.x = point.x ?? 1450;
			point.y = point.y ?? 550;
		},
	}),
};
