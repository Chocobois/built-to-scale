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

export class Station extends Button {
	public stationId: StationId;
	public currentCustomer: Customer | null; // The customer using the station
	//public taskDuration: number; // Time it takes to complete a task
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

	private cellSize: number;
	private spriteCont: Phaser.GameObjects.Container;
	private sprite: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private progressTimer: Timer;

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

		/* Sprite */
		this.spriteCont = this.scene.add.container(0, this.spriteOffset);
		this.add(this.spriteCont);

		this.sprite = this.scene.add.image(0, 0, this.spriteKey);
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.sprite.setTint(interpolateColor(0xffffff, this.stationTypeColor, 0.5));
		this.spriteCont.add(this.sprite);

		this.text = this.scene.addText({
			x: 0,
			y: cellSize / 2,
			size: 32,
			text: "Available",
		});
		this.text.setOrigin(0.5);
		this.text.setVisible(false);
		this.text.setStroke("#000000", 4);
		this.add(this.text);

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

	update(time: number, delta: number) {
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.spriteCont.setScale(1.0, squish - 0.2 * this.holdSmooth);
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;
		this.text.setText(customer ? "Click me!" : "Available");
	}

	startTask() {
		this.text.setText("Working");
		this.currentCustomer
			? (this.taskHaste *= this.currentCustomer.workMultiplier)
			: (this.taskHaste *= 1);
		this.parseItems();
		if(this.queueFail) {
			this.scene.sound.play("rip");
		} else {
			this.playJingle();
		}
		this.clearItems();
		if (this.stationType == StationType.CashRegister) {
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
				this.text.setText("Click me!");
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
					this.scene.sound.play("crit");
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
	}

	upgrade() {
		if (this.upgradeTo) {
			this.stationId = this.upgradeTo!;
			this.sprite.setTexture(this.spriteKey);
			this.spriteCont.y = this.spriteOffset;
			this.sprite.setScale(this.spriteSize / this.sprite.width);
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
		this.scene.sound.play("return");
		this.clearButton.setVisible(false);
		//this.scene.sound.play("meme_explosion_sound");
	}

	playJingle(){
		switch(this.stationType){
			case StationType.ScalePolish: {
				this.scene.sound.play("polish");
				break;
			} case StationType.GoldBath: {
				this.scene.sound.play("goldbath");
				break;
			} case StationType.HornAndNails: {
				this.scene.sound.play("snip");
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

	get spriteOffset(): number {
		return 0.3 * this.spriteSize;
	}

	get taskDuration(): number {
		return StationData[this.stationId].taskDuration ?? 0;
	}

	get admissionFee(): number {
		return StationData[this.stationId].admissionFee ?? 0;
	}

	get upgradeCost(): number {
		return StationData[this.stationId].upgradeCost ?? 0;
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
