import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station } from "./Station";
import { Employee } from "./Employee";
import { Timer } from "./Timer";
import { interpolateColor } from "@/utils/functions";
import { ThoughtBubble } from "./ThoughtBubble";
import { StationType } from "./StationData";
import { CustomerData, CustomerId } from "./CustomerData";
import { Effect } from "./Effect";
import { TextEffect } from "./TextEffect";
import { PatienceTimer } from "./PatienceTimer";
import { Color } from "@/utils/colors";

export interface CustomerType {
	spr: string;
	tags: string[];
	antitags: string[];
	budget: number;
}

export class Customer extends Button {
	public customerId: CustomerId;
	public scene: GameScene;
	// Movement
	public lastX: number; // Last position on the grid
	public lastY: number;
	public dragX: number; // Current drag position
	public dragY: number;
	public currentStation: Station | null;
	public currentEmployee: Employee | null;
	//public cdata: CustomerType;
	// Requests
	public itinerary: StationType[]; // List of stations to visit
	public requestedStation: StationType | null;
	public hasEnteredShop: boolean = false;
	public hasCompleted: boolean = false;

	// Happiness variables
	public tips = 0;
	public tipMultiplier: number = 1;
	public tipBonus: number = 0;
	public happiness: number = 1.01;
	//public happinessStage: number; //0-6, rounds down
	public happinessBonus: number = 0;
	public rockBonus: number = 0;
	public minHappiness: number = 1.01; // bonuses
	public maxHappiness: number = 6.01; // bonuses

	public patience: number = 1;
	public minPatience: number; // bonuses
	public maxPatience: number = 1; // bonuses
	public lockPatience: boolean; // bonuses

	public actionsComplete: boolean = false;

	// Stats
	public doingCuteThing: boolean;
	public tasksCompleted: number;
	public moneySpent: number;

	// Graphics
	private cellSize: number;
	private spriteCont: Phaser.GameObjects.Container;
	private sprite: Phaser.GameObjects.Sprite;
	private customColor: number;
	// private graphics: Phaser.GameObjects.Graphics;
	private thoughtBubble: ThoughtBubble;
	private angryImage: Phaser.GameObjects.Sprite;
	private patienceTimer: Timer;
	private spriteList: string[];

	public itemList: number[];
	public sprList: Phaser.GameObjects.Sprite[];

	private garchomp: boolean;

	private testTimer: PatienceTimer;

	private eatDelay: number = 0;
	private playFail: boolean = false;

	//testing stuff
	constructor(
		scene: GameScene,
		x: number,
		y: number,
		id: CustomerId,
		cellSize: number
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.customerId = id;
		this.cellSize = cellSize;

		this.lastX = x;
		this.lastY = y;
		this.dragX = x;
		this.dragY = y;
		this.currentStation = null;
		this.currentEmployee = null;

		this.itinerary = [];
		this.requestedStation = null;

		this.doingCuteThing = false;
		this.tasksCompleted = 0;
		this.moneySpent = 0;
		//this.happiness = 3;

		/* Sprite */
		this.spriteCont = this.scene.add.container(0, this.spriteOffset);
		this.add(this.spriteCont);

		this.sprite = this.scene.add.sprite(0, 0, (this.spriteKeys.sit));
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.spriteCont.add(this.sprite);

		const colors = [
			Color.Red600,
			Color.Orange600,
			Color.Amber600,
			Color.Yellow600,
			Color.Lime600,
			Color.Green600,
			Color.Emerald600,
			Color.Teal600,
			Color.Cyan600,
			Color.Sky600,
			Color.Blue600,
			Color.Indigo600,
			Color.Violet600,
			Color.Purple600,
			Color.Fuchsia600,
			Color.Pink600,
			Color.Rose600,
		];
		// White wash
		this.customColor = interpolateColor(
			Phaser.Math.RND.pick(colors),
			0xffffff,
			0.8
		);

		// this.graphics = this.scene.add.graphics();

		const s = this.spriteSize;
		this.angryImage = this.scene.add.sprite(-0.2 * s, -0.5 * s, "anger");
		this.angryImage.setScale(1.0);
		this.angryImage.setVisible(false);
		this.add(this.angryImage);

		this.testTimer = new PatienceTimer(this.scene, -80, -40, 1, 0xff0000);
		this.add(this.testTimer);
		this.thoughtBubble = new ThoughtBubble(
			scene,
			0.4 * cellSize,
			-0.6 * cellSize,
			cellSize
		);
		this.add(this.thoughtBubble);

		this.patienceTimer = new Timer(
			scene,
			-0.3 * cellSize,
			-0.3 * cellSize,
			0.6 * cellSize,
			0xfa9425
		);
		this.patienceTimer.setAlpha(0);
		this.add(this.patienceTimer);

		this.itemList = [];
		this.sprList = [];

		this.bindInteractive(this.sprite, true);
		this.sprite.input!.enabled = false;
	}

	update(time: number, delta: number) {
		// Smooth follow the drag point
		this.x += (this.dragX - this.x) * 0.5;
		this.y += (this.dragY - this.y) * 0.5;

		const wobble = this.doingCuteThing ? 0.1 : 0.02;
		const squish = 1.0 + wobble * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish - 0.2 * this.holdSmooth);

		this.sprite.setTint(
			interpolateColor(0xff0000, 0xFFFFFF, 2 * this.patience)
		);

		if (this.isWaiting) {
			this.patienceTimer.setVisible(true);
			if (!this.dragged) {
				// 20 seconds
				if (!this.lockPatience) {
					this.patience -= (1 / 40) * (delta / 1000);
				}
			}

			this.patienceTimer.setColor(
				interpolateColor(0xff0000, 0x00ff00, this.patience)
			);
			this.patienceTimer.redraw(this.patience / this.maxPatience);
			this.testTimer.redraw(
				this.patience / this.maxPatience > 1
					? 1
					: this.patience / this.maxPatience
			);
			this.angryImage.setVisible(this.patience <= 0.25);
			this.angryImage.setFrame(Math.floor((time / 300) % 2));
			this.testTimer.update(time, delta);
			if (this.patience <= 0) {
				if (this.hasCompleted) {
					if (Math.random() > 0.2) {
						this.scene.sound.play("cashmoney", { volume: 0.4 });
						this.scene.addEffect(
							new TextEffect(
								this.scene,
								this.x - 70 + Math.random() * 80,
								this.y - 80,
								"+$" + this.moneySpent,
								"yellow",
								40,
								true,
								"red",
								2000,
								100,
								0.7,
								0
							)
						);
						this.emit("pay", this.moneySpent);
					} else {
						this.scene.sound.play("rip", { volume: 0.3 });
					}
				} else {
					this.scene.sound.play("rip", { volume: 0.3 });
				}
				this.leave();
				this.thoughtBubble.showSymbol("sad");
				this.emit("angry");
			}
		} else {
			this.patienceTimer.setVisible(false);
			this.angryImage.setVisible(false);
		}

		this.testTimer.update(time, delta);
		if (this.itemList.length > 0) {
			if (this.eatDelay <= 0) {
				this.eatDelay = 100 + Math.random() * 200;
			}
		}
		if (this.eatDelay > 0) {
			this.eatDelay -= delta;
			if (this.eatDelay <= 0) {
				this.eatDelay = 0;
				if (this.itemList.length > 0) {
					this.scene.parseCustomerItems(this.itemList.shift()!, this);
					if (this.sprList[0]) {
						this.sprList[0].destroy();
						this.sprList.shift();
					}
				}
			}
		}
		if (this.playFail) {
			this.scene.sound.play("rip", { volume: 0.3 });
			this.playFail = false;
		}
	}

	onOver(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {
		super.onOver(pointer, localX, localY, event);
		this.toggleTimer();
	}


	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		super.onOut(pointer, event);
		this.untoggleTimer();
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("pickup");
		this.dragged = true;
		this.sprite.setTexture(this.spriteKeys.sit);
		this.scene.sound.play("grab", { volume: 0.4 });
	}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.hold = false;
		this.dragX = pointer.x;
		this.dragY = pointer.y;
		this.emit("drag");
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.dragged = false;
		this.emit("drop");
		this.sprite.setTexture(this.spriteKeys.sit);
		this.scene.sound.play("letgo1", { volume: 0.4 });
	}

	resetPatience() {
		this.patience = this.maxPatience * 1.25;
	}

	miniRefresh() {
		if (!this.lockPatience) {
			this.patience += 0.125;
			if (this.patience > 1.25) {
				this.patience = 1.25;
			}
		}
	}

	toggleTimer() {
		this.testTimer.unveil();
	}

	untoggleTimer() {
		this.testTimer.veil();
	}

	lockTimer() {
		this.testTimer.lockTimer();
	}

	unlockTimer() {
		this.testTimer.unlockTimer();
	}

	snapTo(x: number, y: number, instant: boolean = false) {
		this.dragX = x;
		this.dragY = y;

		if (instant) {
			this.x = x;
			this.y = y;
		}
	}

	walk(path: Phaser.Curves.Path) {
		// Debug draw path
		// this.graphics.clear();
		// this.graphics.lineStyle(8, 0xff0000);
		// path.draw(this.graphics);
		// this.graphics.fillStyle(0xff0000);
		// this.graphics.fillCircle(path.getPoint(0).x, path.getPoint(0).y, 12);
		// this.graphics.fillCircle(path.getPoint(1).x, path.getPoint(1).y, 12);

		const distance = path.getLength();

		// Add tween to move from current position to the target
		this.scene.tweens.addCounter({
			duration: (10 * distance) / this.walkSpeed,
			ease: "Linear",

			onUpdate: ({ progress }) => {
				const pos = path.getPoint(progress);
				this.dragX = pos.x;
				this.dragY = pos.y;

				const count = this.spriteKeys.walk.length;
				const index = Math.floor((progress * distance) / 50) % count;
				const frame = this.spriteKeys.walk[index];
				this.sprite.setTexture(frame);
				this.sprite.flipX = this.dragX < this.x + 0.1;
			},

			onComplete: () => {
				const pos = path.getPoint(1);
				this.dragX = pos.x;
				this.dragY = pos.y;

				// this.graphics.clear();
				this.sprite.setTexture(this.spriteKeys.sit);
				this.sprite.flipX = false;
				this.hasEnteredShop = true;
				this.sprite.input!.enabled = true;
				this.scene.sound.play("letgo1", { volume: 0.2 });
				this.emit("seated");
			},
		});
	}

	setStation(station: Station | null) {
		this.currentStation = station;

		if (station) {
			this.lastX = station.x;
			this.lastY = station.y;

			if (
				this.patience < 0.25 &&
				this.requestedStation !== station.stationType
			) {
				this.patience = 0.25;
			}

			if (this.requestedStation === station.stationType) {
				this.thoughtBubble.showSymbol("exclamation");
			}
		}
	}

	setEmployee(employee: Employee | null) {
		this.currentEmployee = employee;

		this.sprite.input!.enabled = !employee;

		if (employee) {
			this.untoggleTimer();
			this.lockTimer();
		}
		this.thoughtBubble.showSymbol("love");
	}

	setAction(temp: boolean) {
		this.doingCuteThing = temp;
		//this.thoughtBubble.hide();
	}

	setRequest(type: StationType | null) {
		if (type !== null) {
			this.requestedStation = type;
			this.thoughtBubble.setRequest(type);
		} else {
			this.thoughtBubble.setRequest(null);
		}
	}

	nextActivity() {
		if (this.itinerary.length > 0) {
			this.setRequest(this.itinerary.shift() || null);
		} else if (!this.hasCompleted) {
			this.hasCompleted = true;
			this.setRequest(StationType.Register);
		} else {
			this.actionsComplete = true;
			this.parseMoney();
			this.scene.sound.play("cashmoney", { volume: 0.4 });
			this.scene.addEffect(
				new TextEffect(
					this.scene,
					this.x - 70 + Math.random() * 80,
					this.y - 80,
					"+$" + this.moneySpent,
					"yellow",
					40,
					true,
					"red",
					2000,
					100,
					0.7,
					0
				)
			);
			this.scene.addEffect(
				new TextEffect(
					this.scene,
					this.x - 40 + Math.random() * 80,
					this.y - 20,
					"Tips +$" + this.tips,
					"yellow",
					40,
					true,
					"red",
					2000,
					100,
					0.7,
					0
				)
			);
			this.emit("pay", this.moneySpent);
			this.emit("tip", this.tips);
			this.leave();
		}
	}

	leave() {
		this.sprite.input!.enabled = false;
		this.testTimer.setVisible(false);
		this.setRequest(null);
		this.patienceTimer.setVisible(false);

		if (this.currentStation) {
			this.currentStation.setCustomer(null);
			this.setStation(null);
		}

		if (this.currentEmployee) {
			this.currentEmployee.setCustomer(null);
			this.setEmployee(null);
		}

		this.scene.tweens.add({
			targets: this,
			dragX: "+=1920",
			dragY: this.lastY,
			duration: 2000,
			ease: "Linear",
			onComplete: () => {
				this.emit("offscreen");
			},
		});

		// this.scene.moveCustomerToEntrance(this);
	}
	recheckHappiness() {
		if (this.hasCompleted) {
			return;
		}
		let tempeh = this.happiness;
		//console.log("Base Happiness " + tempeh);
		this.patience > 0.5
			? (tempeh += 2)
			: (tempeh += (4 * this.patience) / this.maxPatience);
		//console.log("With Patience Happiness " + tempeh);

		if (this.patience >= 1) {
			tempeh += 1;
		}
		//console.log("With Bonus Patience Happiness " + tempeh);
		tempeh += this.rockBonus;
		if (tempeh > 4.01) {
			tempeh = 4.01;
		}
		//console.log("With Rock Happiness " + tempeh);
		tempeh += this.happinessBonus;

		if (tempeh < this.minHappiness) {
			tempeh = this.minHappiness;
		}
		if (tempeh > this.maxHappiness) {
			tempeh = this.maxHappiness;
		}

		let rt = Math.trunc(tempeh);
		switch (rt) {
			case 1: {
				this.thoughtBubble.showSymbol("h1");
				break;
			}
			case 2: {
				this.thoughtBubble.showSymbol("h2");
				break;
			}
			case 3: {
				this.thoughtBubble.showSymbol("h3");
				break;
			}
			case 4: {
				this.thoughtBubble.showSymbol("h4");
				break;
			}
			case 5: {
				this.thoughtBubble.showSymbol("h5");
				break;
			}
			case 6: {
				this.thoughtBubble.showSymbol("h6");
				break;
			}
		}
	}
	parseHappiness() {
		let yiff = this.happiness;
		//console.log("Base Happiness " + tempeh);
		this.patience > 0.5
			? (yiff += 2)
			: (yiff += (4 * this.patience) / this.maxPatience);
		//console.log("With Patience Happiness " + tempeh);

		if (this.patience >= 1) {
			yiff += 1;
		}
		//console.log("With Bonus Patience Happiness " + tempeh);
		yiff += this.rockBonus;
		if (yiff > 4.01) {
			yiff = 4.01;
		}
		//console.log("With Rock Happiness " + tempeh);
		yiff += this.happinessBonus;

		if (yiff < this.minHappiness) {
			yiff = this.minHappiness;
		}
		if (yiff > this.maxHappiness) {
			yiff = this.maxHappiness;
		}

		this.tips = this.baseTips * (1 + this.tipBonus);

		let bleistiftspitzer = Math.trunc(yiff);
		switch (bleistiftspitzer) {
			case 1: {
				this.thoughtBubble.showSymbol("h1");
				this.tips += (0 + this.tipBonus) * this.moneySpent;
				break;
			}
			case 2: {
				this.thoughtBubble.showSymbol("h2");
				this.tips += (0.05 + this.tipBonus) * this.moneySpent;
				break;
			}
			case 3: {
				this.thoughtBubble.showSymbol("h3");
				this.tips += (0.1 + this.tipBonus) * this.moneySpent;
				break;
			}
			case 4: {
				this.thoughtBubble.showSymbol("h4");
				this.tips += (0.25 + this.tipBonus) * this.moneySpent;
				break;
			}
			case 5: {
				this.thoughtBubble.showSymbol("h5");
				this.tips += (0.5 + this.tipBonus) * this.moneySpent;
				break;
			}
			case 6: {
				this.thoughtBubble.showSymbol("h6");
				this.tips += (1 + this.tipBonus) * this.moneySpent;
				break;
			}
		}
		//console.log("TIPS: " + this.tips);
		this.tips *= this.tipMultiplier;
		this.tips = Math.trunc(this.tips);
	}

	applyItem(i: number, s: string) {
		this.itemList.push(i);
		let st = new Phaser.GameObjects.Sprite(
			this.scene,
			-80 + 40 * this.itemList.length,
			60,
			s
		);
		st.setOrigin(0.5, 0.5);
		st.setScale(0.4);
		st.setDepth(4);
		st.setAlpha(0.85);
		this.add(st);
		this.sprList.push(st);
	}

	queueFail() {
		this.playFail = true;
	}

	parseMoney() {
		this.parseHappiness();
	}

	pauseClickable() {
		if (!this.sprite.input!.enabled) {
			this.garchomp = true;
		} else {
			this.sprite.input!.enabled = false;
		}
	}

	resumeClickable() {
		if (this.garchomp) {
			this.garchomp = false;
		} else {
			this.sprite.input!.enabled = true;
		}
	}

	getColorTags(){

	}

	getColorAntiTags(){

	}

	/* Getters */

	get isWaiting(): boolean {
		return (
			this.hasEnteredShop &&
			this.currentStation !== null &&
			this.currentEmployee === null
		);
	}

	get spriteKeys() {
		return CustomerData[this.customerId].spriteKeys;
	}

	get spriteScale(): number {
		return CustomerData[this.customerId].spriteScale;
	}

	get spriteSize(): number {
		return this.spriteScale * this.cellSize;
	}

	get spriteOffset(): number {
		return 0.2 * this.spriteSize;
	}

	get walkSpeed(): number {
		return CustomerData[this.customerId].walkSpeed;
	}

	get workMultiplier(): number {
		return CustomerData[this.customerId].workMultiplier;
	}

	get tags(): string[] {
		return CustomerData[this.customerId].tags;
	}

	get antitags(): string[] {
		return CustomerData[this.customerId].antitags;
	}

	get budget(): number {
		return CustomerData[this.customerId].budget;
	}

	get baseTips(): number {
		return CustomerData[this.customerId].baseTips;
	}
}
