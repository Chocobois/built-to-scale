import { BaseScene } from "@/scenes/BaseScene";

export class SquishButton extends Phaser.GameObjects.Container {
	public scene: BaseScene;
	private _hold: boolean;
	private _hover: boolean;
	protected blocked: boolean;
	public liftSmooth: number;
	public hoverSmooth: number;
	public holdSmooth: number;
	public category: number;
	public aliveValue: number;
	private hoverTween: Phaser.Tweens.Tween;
	private holdTween: Phaser.Tweens.Tween;
	public enabled: boolean;
	public hitSprite:Phaser.GameObjects.Sprite;

	constructor(scene: BaseScene, x: number, y: number, spr:string) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this._hover = false;
		this._hold = false;
		this.blocked = false;
		this.enabled = true;

		this.liftSmooth = 0;
		this.hoverSmooth = 0;
		this.holdSmooth = 0;
		this.aliveValue = 0;

		this.hitSprite = new Phaser.GameObjects.Sprite(this.scene,0,0,spr);
		this.bindInteractive(this.hitSprite);
		this.hitSprite.input!.enabled = true;
		this.add(this.hitSprite);
	}

	bindInteractive(
		gameObject: Phaser.GameObjects.GameObject,
		draggable = false
	) {
		gameObject.removeInteractive();
		gameObject
			.setInteractive({ useHandCursor: true, draggable: draggable })
			.on("pointerout", this.onOut, this)
			.on("pointerover", this.onOver, this)
			.on("pointerdown", this.onDown, this)
			.on("pointerup", this.onUp, this)
			.on("dragstart", this.onDragStart, this)
			.on("drag", this.onDrag, this)
			.on("dragend", this.onDragEnd, this);
		return gameObject;
	}

	setOrigin(x: number, y: number){
		this.hitSprite.setOrigin(x,y);
	}

	setFrame(n: number){
		this.hitSprite.setFrame(n);
	}

	get hover(): boolean {
		return this._hover;
	}

	set hover(value: boolean) {
		if (value != this._hover) {
			if (this.hoverTween) {
				this.hoverTween.stop();
			}
			if (value) {
				this.hoverTween = this.scene.tweens.add({
					targets: this,
					hoverSmooth: { from: 0.0, to: 1.0 },
					ease: 'Cubic.Out',
					duration: 100
				});
			}
			else {
				this.hoverTween = this.scene.tweens.add({
					targets: this,
					hoverSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 500
				});
			}
		}

		this._hover = value;
	}

	get hold(): boolean {
		return this._hold;
	}

	set hold(value: boolean) {
		if (value != this._hold) {
			if (this.holdTween) {
				this.holdTween.stop();
			}
			if (value) {
				this.holdTween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 0.0, to: 1.0 },
					ease: 'Cubic.Out',
					duration: 100
				});
			}
			else {
				this.holdTween = this.scene.tweens.add({
					targets: this,
					holdSmooth: { from: 1.0, to: 0.0 },
					ease: (v: number) => {
						return Phaser.Math.Easing.Elastic.Out(v, 1.5, 0.5);
					},
					duration: 500
				});
			}
		}

		this._hold = value;
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		this.hover = false;
		this.hold = false;
	}

	onOver(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		this.hover = true;
	}

	onDown(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		this.hold = true;
		this.blocked = false;
		this.emit("down");
	}

	onUp(pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) {
		if (this.hold && !this.blocked) {
			this.hold = false;
			this.emit('click');
		}
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		// this.hold = false;
		// if (Math.abs(dragY) > 8) {
		// 	this.hold = false;
		// }
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {}



	block() {
		this.blocked = true;
	}
}