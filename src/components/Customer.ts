import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station, StationType, StationTypeColors } from "./Station";
import { Employee } from "./Employee";
import { Timer } from "./Timer";
import { interpolateColor } from "@/functions";
import { ThoughtBubble } from "./ThoughtBubble";

export class Customer extends Button {
	// Movement
	public lastX: number; // Last position on the grid
	public lastY: number;
	public dragX: number; // Current drag position
	public dragY: number;
	public currentStation: Station | null;
	public currentEmployee: Employee | null;

	// Requests
	public itinerary: StationType[]; // List of stations to visit
	public requestedStation: StationType | null;

	// Stats
	public doingCuteThing: boolean;
	public tasksCompleted: number;
	public moneySpent: number;
	public maxHappiness: number;
	public happiness: number;

	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private thoughtBubble: ThoughtBubble;
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
		this.maxHappiness = 100;
		this.happiness = 100;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += size / 2;
		this.sprite.setScale(size / this.sprite.width);
		this.add(this.sprite);

		this.thoughtBubble = new ThoughtBubble(scene, 0, -0.75 * size, size);
		this.add(this.thoughtBubble);

		this.happinessTimer = new Timer(
			scene,
			0.3 * size,
			-0.4 * size,
			0.6 * size,
			0xfa9425
		);
		this.add(this.happinessTimer);

		this.bindInteractive(this.sprite, true);
	}

	update(time: number, delta: number) {
		// Smooth follow the drag point
		this.x += (this.dragX - this.x) * 0.5;
		this.y += (this.dragY - this.y) * 0.5;

		const wobble = this.doingCuteThing ? 0.1 : 0.02;
		const squish =
			1.0 + wobble * Math.sin((6 * time) / 1000) - 0.2 * this.holdSmooth;
		this.setScale(1.0, squish);

		if (this.isWaiting) {
			this.happinessTimer.setVisible(true);
			if (!this.dragged) {
				this.happiness -= (100 / 20) * (delta / 1000);
			}

			const factor = this.happiness / this.maxHappiness;
			this.happinessTimer.setColor(
				interpolateColor(0xff0000, 0x00ff00, factor)
			);
			this.happinessTimer.redraw(factor);

			if (this.happiness <= 0) {
				this.leave();
			}
		} else {
			this.happinessTimer.setVisible(false);
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
			this.happiness = 100;

			if (this.requestedStation === station.stationType) {
				this.thoughtBubble.markAsReady();
			}
		}
	}

	setEmployee(employee: Employee | null) {
		this.currentEmployee = employee;

		this.sprite.input!.enabled = !employee;
	}

	setAction(temp: boolean) {
		this.doingCuteThing = temp;
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
