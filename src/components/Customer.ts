import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station, StationType, StationTypeColors } from "./Station";
import { Employee } from "./Employee";

export class Customer extends Button {
	public lastX: number; // Last position on the grid
	public lastY: number;
	public dragX: number; // Current drag position
	public dragY: number;
	public currentStation: Station | null;
	public currentEmployee: Employee | null;
	public requestedStation: StationType | null;
	public doingCuteThing: boolean;

	// Customer sprite
	private sprite: Phaser.GameObjects.Sprite;

	// Request bubble
	private bubble: Phaser.GameObjects.Sprite;
	private bubbleImage: Phaser.GameObjects.Ellipse;

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
		this.requestedStation = null;

		/* Sprite */
		const size = 150;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += size / 2;
		this.sprite.setScale(size / this.sprite.width);
		this.add(this.sprite);

		this.bubble = this.scene.add.sprite(0, -0.75 * size, "bubble");
		this.bubble.setScale(0.5);
		this.bubble.setVisible(false);
		this.add(this.bubble);

		this.bubbleImage = this.scene.add.ellipse(0, -0.82 * size, 40, 40, 0);
		this.bubbleImage.setVisible(false);
		this.add(this.bubbleImage);

		this.bindInteractive(this.sprite, true);
	}

	update(time: number, delta: number) {
		// Smooth follow the drag point
		this.x += (this.dragX - this.x) * 0.5;
		this.y += (this.dragY - this.y) * 0.5;

		const factor = this.doingCuteThing ? 0.1 : 0.02;
		const squish = 1.0 + factor * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("pickup");
	}

	onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.hold = false;
		this.dragX = pointer.x;
		this.dragY = pointer.y;
		this.emit("drag");
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("drop");
	}

	snapTo(x: number, y: number) {
		this.dragX = x;
		this.dragY = y;
	}

	setStation(station: Station | null) {
		this.currentStation = station;
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

			this.bubble.setVisible(true);
			this.bubbleImage.setVisible(true);
			this.bubbleImage.fillColor = StationTypeColors[type];
		} else {
			this.bubble.setVisible(false);
			this.bubbleImage.setVisible(false);
		}
	}
}
