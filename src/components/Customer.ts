import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station } from "./Station";
import { Employee } from "./Employee";
import { Timer } from "./Timer";
import { interpolateColor } from "@/functions";
import { ThoughtBubble } from "./ThoughtBubble";
import { StationType } from "./StationData";

export interface CustomerType {
	spr: string;
	tags: string[];
	antitags: string[];
	budget: number;
	
}

export class Customer extends Button {
	// Movement
	public lastX: number; // Last position on the grid
	public lastY: number;
	public dragX: number; // Current drag position
	public dragY: number;
	public tags: string[];
	public currentStation: Station | null;
	public currentEmployee: Employee | null;
	public cdata: CustomerType;
	// Requests
	public itinerary: StationType[]; // List of stations to visit
	public requestedStation: StationType | null;

	// Happiness variables
	public baseTip: number;
	public tipMultiplier: number;
	public tipBonus: number;
	public happinessStage: number; //0-6, rounds down
	public minHappiness: number = 0; // bonuses
	public maxHappiness: number = 6; // bonuses

	public patience: number;
	public minPatience: number; // bonuses
	public lockPatience: boolean; // bonuses

	// Stats
	public doingCuteThing: boolean;
	public tasksCompleted: number;
	public moneySpent: number;
	public happiness: number;

	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private thoughtBubble: ThoughtBubble;
	private angryImage: Phaser.GameObjects.Image;
	private happinessTimer: Timer;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

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
		this.happiness = 1;

		/* Sprite */
		const size = 120;
		this.sprite = this.scene.add.sprite(0, 0, "small_customer_walk1");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += size / 2;
		this.sprite.setScale(size / this.sprite.width);
		this.add(this.sprite);

		this.angryImage = this.scene.add.image(0, -0.3 * size, "angyv");
		this.angryImage.setScale(0.25);
		this.angryImage.setVisible(false);
		this.add(this.angryImage);

		this.thoughtBubble = new ThoughtBubble(
			scene,
			0.4 * size,
			-0.6 * size,
			size
		);
		this.add(this.thoughtBubble);

		this.happinessTimer = new Timer(
			scene,
			-0.3 * size,
			-0.3 * size,
			0.6 * size,
			0xfa9425
		);
		this.happinessTimer.setAlpha(0);
		this.add(this.happinessTimer);

		this.bindInteractive(this.sprite, true);
	}

	update(time: number, delta: number) {
		// Smooth follow the drag point
		this.x += (this.dragX - this.x) * 0.5;
		this.y += (this.dragY - this.y) * 0.5;

		const wobble = this.doingCuteThing ? 0.1 : 0.02;
		const squish = 1.0 + wobble * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish - 0.2 * this.holdSmooth);
		this.sprite.setTint(
			interpolateColor(0xffffff, 0xff0000, 1 - this.happiness)
		);

		if (this.isWaiting) {
			this.happinessTimer.setVisible(true);
			if (!this.dragged) {
				// 20 seconds
				this.happiness -= (1 / 20) * (delta / 1000);
			}

			this.happinessTimer.setColor(
				interpolateColor(0xff0000, 0x00ff00, this.happiness)
			);
			this.happinessTimer.redraw(this.happiness);
			this.angryImage.setVisible(this.happiness <= 0.5);

			if (this.happiness <= 0) {
				this.leave();
				this.thoughtBubble.showSymbol("sad");
			}
		} else {
			this.happinessTimer.setVisible(false);
			this.angryImage.setVisible(false);
		}
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("pickup");
		this.dragged = true;
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
	}

	snapTo(x: number, y: number) {
		this.dragX = x;
		this.dragY = y;
	}

	setStation(station: Station | null) {
		this.currentStation = station;

		if (station) {
			this.lastX = station.x;
			this.lastY = station.y;
			this.happiness = 1;

			if (this.requestedStation === station.stationType) {
				this.thoughtBubble.showSymbol("exclamation");
			}
		}
	}

	setEmployee(employee: Employee | null) {
		this.currentEmployee = employee;

		this.sprite.input!.enabled = !employee;

		this.thoughtBubble.showSymbol(Phaser.Math.RND.pick(["happy", "love"]));
	}

	setAction(temp: boolean) {
		this.doingCuteThing = temp;
		this.thoughtBubble.hide();
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
		} else {
			this.emit("pay", this.moneySpent);
			this.leave();
		}
	}

	leave() {
		this.sprite.input!.enabled = false;

		this.setRequest(null);
		this.happinessTimer.setVisible(false);

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
	}

	get isWaiting(): boolean {
		return this.currentStation !== null && this.currentEmployee === null;
	}
}
