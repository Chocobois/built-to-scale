import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";
import { Timer } from "./Timer";
import {
	StationData,
	StationId,
	StationType,
	StationTypeData,
} from "./StationData";
import { interpolateColor } from "@/utils/functions";
import { SimpleButton } from "./elements/SimpleButton";
import { TextEffect } from "./TextEffect";
import { UpgradeIcon } from "./UpgradeIcon";

export class Station extends Button {
	public stationId: StationId;
	public hasBeenPurchased: boolean;
	public currentCustomer: Customer | null; // The customer using the station
	public taskSpeed: number = 1; // For permanent bonuses

	//temp variables
	public taskHaste: number = 1; // For temporary bonuses
	public refresh: boolean = false;
	public queueFail: boolean = false;
	public crit: number = 0;

	public clearButton: SimpleButton;

	public scene: GameScene;
	public taskTimer: number = 0;

	public appliedItems: number[];
	public appliedSprites: Phaser.GameObjects.Sprite[];
	//public admissionFee: number; // Cost to use the station

	private jolteon: boolean = false;

	private cellSize: number;
	private spriteCont: Phaser.GameObjects.Container;
	private sprite: Phaser.GameObjects.Image;

	private maskImage: Phaser.GameObjects.Image;
	public foregroundMask: Phaser.Display.Masks.BitmapMask;

	private progressTimer: Timer;
	private upgradeIcon: UpgradeIcon;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		id: StationId,
		cellSize: number
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.stationId = id;
		this.cellSize = cellSize;
		this.currentCustomer = null;

		// Initially not purchased
		this.hasBeenPurchased = false;

		/* Sprite */
		this.spriteCont = this.scene.add.container(
			this.spriteOffsetX,
			this.spriteOffsetY
		);
		this.add(this.spriteCont);

		this.sprite = this.scene.add.image(0, 0, this.spriteKey);
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.sprite.setTint(interpolateColor(0xffffff, this.stationTypeColor, 0.2));
		this.spriteCont.add(this.sprite);

		const frontKey = this.spriteKey + "_front";
		if (scene.textures.exists(frontKey)) {
			this.maskImage = this.scene.make
				.image({
					key: frontKey,
					add: false,
				})
				.setOrigin(0.5, 1);

			this.foregroundMask = this.maskImage.createBitmapMask();
			this.foregroundMask.invertAlpha = true;
		}

		this.upgradeIcon = new UpgradeIcon(
			scene,
			x + 0.3 * cellSize,
			y + 0.3 * cellSize,
			cellSize
		);

		this.progressTimer = new Timer(
			scene,
			-0.4 * cellSize,
			0.4 * cellSize,
			0.8 * cellSize,
			0xed51a4
		);
		this.progressTimer.setVisible(false);
		this.add(this.progressTimer);

		// Make station clickable during shopping
		this.bindInteractive(this.sprite);
		this.sprite.input!.enabled = false;

		this.appliedItems = [];
		this.appliedSprites = [];
		this.clearButton = new SimpleButton(
			this.scene,
			0.45 * cellSize,
			-0.45 * cellSize,
			"",
			"redx",
			10
		);
		this.clearButton.on("click", () => {
			this.returnItems();
		});
		this.add(this.clearButton);
		this.clearButton.setScale(0.75, 0.75);
		this.clearButton.setDepth(5);
		this.clearButton.setVisible(false);
	}

	destroy(): void {
		this.upgradeIcon.destroy();
		super.destroy();
	}

	update(time: number, delta: number) {
		const amount = this.hasBeenPurchased ? 0.01 : 0;
		const squish = 1.0 + amount * Math.sin((6 * time) / 1000);
		this.spriteCont.setScale(1.0, squish - 0.2 * this.holdSmooth);

		if (this.maskImage) {
			const scale = this.spriteSize / this.maskImage.width;
			this.maskImage.setScale(scale, scale * (squish - 0.2 * this.holdSmooth));
		}

		this.upgradeIcon.update(time, delta);
	}

	setDepth(value: number): this {
		this.upgradeIcon.setDepth(value + 50);
		return super.setDepth(value);
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;
	}

	startTask() {
		this.currentCustomer
			? (this.taskHaste *= this.currentCustomer.workMultiplier)
			: (this.taskHaste *= 1);
		this.parseItems();
		if (this.queueFail) {
			this.scene.sound.play("rip", { volume: 0.5 });
		} else {
			this.playJingle();
		}
		this.clearItems();
		if (this.stationType == StationType.Register) {
			this.taskHaste = 1;
		}
		if (this.currentCustomer) {
			this.currentCustomer.recheckHappiness();
		}

		this.scene.tweens.addCounter({
			from: 1,
			to: 0,
			duration: this.taskDuration * this.taskHaste * this.taskSpeed,
			onStart: () => {
				this.progressTimer.setVisible(true);
			},
			onUpdate: (tween) => {
				this.progressTimer.redraw(tween.getValue());
			},
			onComplete: () => {
				this.parseTaskEndParams();
				this.resetTempVariables();
				this.emit("taskend");
				this.progressTimer.setVisible(false);
			},
		});
		this.setCrits(this.taskDuration * this.taskHaste * this.taskSpeed);
	}

	setCrits(t: number) {
		if (this.crit <= 0) {
			return;
		}
		let orcane = 1;
		for (let coom = 0; coom < 5; coom++) {
			if (Math.random() < this.crit) {
				orcane++;
			}
		}
		for (let algae = 0; algae < orcane; algae++) {
			this.scene.tweens.addCounter({
				from: 1,
				to: 0,
				duration: t * 0.1 + Math.trunc(Math.random() * (t * 0.8)),
				onStart: () => {},
				onUpdate: () => {},
				onComplete: () => {
					this.scene.addEffect(
						new TextEffect(
							this.scene,
							this.x - 80 + Math.random() * 160,
							this.y - 80 + Math.random() * 160,
							"Crit! +Happiness!",
							"cyan",
							30,
							true,
							"red",
							800,
							100,
							0.7,
							0
						)
					);
					this.scene.sound.play("crit", { volume: 0.5 });
					if (this.currentCustomer) {
						this.currentCustomer.happinessBonus += 0.75;
						this.currentCustomer.recheckHappiness();
					}
				},
			});
		}
	}

	parseTaskEndParams() {
		if (this.refresh) {
			if (this.currentCustomer) {
				this.currentCustomer.resetPatience();
			}
		}
	}

	resetTempVariables() {
		this.taskHaste = 1;
		this.refresh = false;
		this.queueFail = false;
		this.crit = 0;
	}

	setClickable(value: boolean) {
		this.sprite.input!.enabled = value;
		this.upgradeIcon.setVisible(value && this.upgradeTo !== undefined);
	}

	setMoney(value: number) {
		this.upgradeIcon.setAffordable(value >= this.upgradeCost);
	}

	pauseClickable() {
		if (!this.sprite.input!.enabled) {
			this.jolteon = true;
		} else {
			this.sprite.input!.enabled = false;
		}
	}

	resumeClickable() {
		if (this.jolteon) {
			this.jolteon = false;
		} else {
			this.sprite.input!.enabled = true;
		}
	}

	// Called upon the player purchasing an upgrade
	upgrade() {
		if (!this.hasBeenPurchased) {
			this.hasBeenPurchased = true;
			this.setAlpha(1.0);
			this.upgradeIcon.setPurchased(true);
		} else if (this.upgradeTo) {
			this.stationId = this.upgradeTo!;
			this.updateTexture();
		}

		if (this.upgradeTo === undefined) {
			this.upgradeIcon.setVisible(false);
		}
	}

	// Only used when loading levels
	forceUpgrade(id: StationId) {
		this.hasBeenPurchased = true;
		this.setAlpha(1.0);
		this.stationId = id;
		this.updateTexture();
		this.upgradeIcon.setPurchased(true);
	}

	updateTexture() {
		this.sprite.setTexture(this.spriteKey);
		this.spriteCont.x = this.spriteOffsetX;
		this.spriteCont.y = this.spriteOffsetY;
		this.sprite.setScale(this.spriteSize / this.sprite.width);

		if (this.maskImage) {
			this.maskImage.setTexture(this.spriteKey + "_front");
			this.maskImage.setPosition(
				this.x + this.spriteCont.x,
				this.y + this.spriteCont.y
			);
			this.maskImage.setScale(this.spriteSize / this.maskImage.width);
		}
	}

	applyItem(id: number, sp: string) {
		this.appliedItems.push(id);
		let st = new Phaser.GameObjects.Sprite(
			this.scene,
			-80 + 40 * this.appliedItems.length,
			60,
			sp
		);
		st.setOrigin(0.5, 0.5);
		st.setScale(0.4);
		st.setDepth(2);
		st.setAlpha(0.85);
		this.add(st);
		this.appliedSprites.push(st);
		this.clearButton.setVisible(true);
	}

	clearItems() {
		this.appliedItems = [];
		this.appliedSprites.forEach((sp) => sp.destroy());
		this.appliedSprites = [];
		this.clearButton.setVisible(false);
	}

	parseItems() {
		if (this.currentCustomer) {
			this.currentCustomer.miniRefresh();
			if (this.appliedItems.length > 0) {
				this.appliedItems.forEach((it) =>
					this.scene.parseItems(it, this, this.currentCustomer!)
				);
			}
		}
	}

	returnItems() {
		if (this.appliedItems.length > 0) {
			this.appliedItems.forEach((it) => this.scene.returnItem(it));
		}
		if (this.appliedSprites.length > 0) {
			this.appliedSprites.forEach((sp) => sp.destroy());
		}

		this.appliedItems = [];
		this.appliedSprites = [];
		this.scene.sound.play("return", { volume: 0.5 });
		this.clearButton.setVisible(false);
		//this.scene.sound.play("meme_explosion_sound", {volume: 0.5 });
	}

	playJingle() {
		switch (this.stationType) {
			case StationType.Wax: {
				this.scene.sound.play("polish", { volume: 0.5 });
				break;
			}
			case StationType.Bath: {
				this.scene.sound.play("goldbath", { volume: 0.5 });
				break;
			}
			case StationType.Nail: {
				this.scene.sound.play("snip", { volume: 0.5 });
				break;
			}
		}
	}

	/* Getters */

	get stationType(): StationType {
		return StationData[this.stationId].type;
	}

	get stationName(): string {
		return StationData[this.stationId].name;
	}

	get stationTier(): number {
		return StationData[this.stationId].tier;
	}

	get spriteKey(): string {
		return StationData[this.stationId].spriteKey;
	}

	get spriteScale(): number {
		return StationData[this.stationId].spriteScale;
	}

	get spriteSize(): number {
		return this.spriteScale * this.cellSize;
	}

	get spriteOffsetX(): number {
		const x = StationData[this.stationId].spriteOffsetX ?? 0;
		return x * this.spriteSize;
	}

	get spriteOffsetY(): number {
		const y = StationData[this.stationId].spriteOffsetY ?? 0;
		return (0.5 + y) * this.spriteSize;
	}

	get taskDuration(): number {
		return StationData[this.stationId].taskDuration ?? 0;
	}

	get admissionFee(): number {
		return StationData[this.stationId].admissionFee ?? 0;
	}

	get upgradeCost(): number {
		if (!this.hasBeenPurchased) {
			return StationData[this.stationId].cost;
		}
		if (this.upgradeTo) {
			return StationData[this.upgradeTo].cost;
		}
		return 0;
	}

	get upgradeTo(): StationId | undefined {
		return StationData[this.stationId].upgradeTo;
	}

	get stationTypeSymbolKey(): string {
		return StationTypeData[this.stationType].symbolKey;
	}

	get stationTypeColor(): number {
		return StationTypeData[this.stationType].color;
	}
}
