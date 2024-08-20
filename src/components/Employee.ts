import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";
import { EmployeeData, EmployeeId, EmployeeType } from "./EmployeeData";

export class Employee extends Button {
	public employeeId: EmployeeId;
	public hasBeenPurchased: boolean;
	public currentCustomer: Customer | null;
	public doingCuteThing: boolean;

	private cellSize: number;
	private spriteCont: Phaser.GameObjects.Container;
	private sprite: Phaser.GameObjects.Sprite;

	private linoone: boolean = false;

	public startX: number;
	public startY: number;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		id: EmployeeId,
		cellSize: number
	) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.employeeId = id;
		this.cellSize = cellSize;
		this.currentCustomer = null;
		this.doingCuteThing = false;

		this.startX = x;
		this.startY = y;

		// Initially not purchased
		this.hasBeenPurchased = false;

		/* Sprite */
		this.spriteCont = this.scene.add.container(0, this.spriteOffset);
		this.add(this.spriteCont);

		this.sprite = this.scene.add.sprite(0, 0, this.spriteKey);
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.spriteCont.add(this.sprite);

		// Make employee clickable during shopping
		this.bindInteractive(this.sprite);
		this.sprite.input!.enabled = false;
	}

	update(time: number, delta: number) {
		const factor = this.doingCuteThing ? 0.1 : this.hasBeenPurchased ? 0.02 : 0;
		const squish = 1.0 + factor * Math.sin((6 * time) / 1000);
		this.spriteCont.setScale(1.0, squish - 0.2 * this.holdSmooth);
	}

	setCustomer(customer: Customer | null) {
		if (customer) {
			this.scene.sound.play("sqk");
		}

		this.currentCustomer = customer;
	}

	walkTo(targetX: number, targetY: number) {
		// TODO: Replace with pathfinding algorithm

		// Temporary: set duration based on distance
		const distance = Phaser.Math.Distance.Between(
			this.x,
			this.y,
			targetX,
			targetY
		);

		// Add tween to move from current position to the target
		this.scene.tweens.add({
			targets: this,
			x: targetX,
			y: targetY,
			duration: 2 * distance,
			ease: "Linear",

			onComplete: () => {
				this.emit("walkend");
			},
		});
	}

	setAction(temp: boolean) {
		this.doingCuteThing = temp;
	}

	setClickable(value: boolean) {
		this.sprite.input!.enabled = value;
	}

	upgrade() {
		// this.scene.sound.play("upgrade");

		if (!this.hasBeenPurchased) {
			this.hasBeenPurchased = true;
			this.setAlpha(1.0);
		} else if (this.upgradeTo) {
			this.employeeId = this.upgradeTo!;
			this.sprite.setTexture(this.spriteKey);
		}
	}

	pauseClickable(){
		if(!(this.sprite.input!.enabled)){
			this.linoone = true;
		} else {
			this.sprite.input!.enabled = false;
		}
	}

	resumeClickable(){
		if(this.linoone) {
			this.linoone = false;
		} else {
			this.sprite.input!.enabled = true;
		}
	}

	// Only used when loading levels
	forceUpgrade(id: EmployeeId) {
		this.hasBeenPurchased = true;
		this.setAlpha(1.0);
		this.employeeId = id;
		this.sprite.setTexture(this.spriteKey);
	}

	/* Getters */

	get employeeType(): EmployeeType {
		return EmployeeData[this.employeeId].type;
	}

	get employeeName(): string {
		return EmployeeData[this.employeeId].name;
	}

	get employeeTier(): number {
		return EmployeeData[this.employeeId].tier;
	}

	get spriteKey(): string {
		return EmployeeData[this.employeeId].spriteKey;
	}

	get spriteScale(): number {
		return 1.4;
	}

	get spriteSize(): number {
		return this.spriteScale * this.cellSize;
	}

	get spriteOffset(): number {
		return 0.3 * this.spriteSize;
	}

	get walkSpeed(): number {
		return EmployeeData[this.employeeId].walkSpeed ?? 0;
	}

	get workSpeed(): number {
		return EmployeeData[this.employeeId].workSpeed ?? 0;
	}

	get upgradeCost(): number {
		if (!this.hasBeenPurchased) {
			return EmployeeData[this.employeeId].cost;
		}
		if (this.upgradeTo) {
			return EmployeeData[this.upgradeTo].cost;
		}
		return 0;
	}

	get upgradeTo(): EmployeeId | undefined {
		return EmployeeData[this.employeeId].upgradeTo;
	}
}
