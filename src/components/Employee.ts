import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Customer } from "./Customer";
import {
	EmployeeData,
	EmployeeId,
	EmployeeType,
	EmployeeTypeData,
} from "./EmployeeData";

export class Employee extends Button {
	public employeeId: EmployeeId;
	public hasBeenPurchased: boolean;
	public currentCustomer: Customer | null;
	public isWorking: boolean;

	private cellSize: number;
	private spriteCont: Phaser.GameObjects.Container;
	private sprite: Phaser.GameObjects.Sprite;
	// private graphics: Phaser.GameObjects.Graphics;

	private linoone: boolean = false;

	public startX: number;
	public startY: number;

	/** Uses alt. idle sprite. To be toggled externally */
	public isSinging: boolean;

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
		this.isWorking = false;
		this.isSinging = false;

		this.startX = x;
		this.startY = y;

		// Initially not purchased
		this.hasBeenPurchased = false;

		/* Sprite */
		this.spriteCont = this.scene.add.container(0, this.spriteOffset);
		this.add(this.spriteCont);

		this.sprite = this.scene.add.sprite(0, 0, this.spriteKeys.idle);
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.spriteCont.add(this.sprite);

		// this.graphics = this.scene.add.graphics();

		// Make employee clickable during shopping
		this.bindInteractive(this.sprite);
		this.sprite.input!.enabled = false;
	}

	update(time: number, delta: number) {
		const factor = this.isWorking ? 0.1 : this.hasBeenPurchased ? 0.02 : 0;
		const squish = 1.0 + factor * Math.sin((6 * time) / 1000);
		this.spriteCont.setScale(1.0, squish - 0.2 * this.holdSmooth);

		if (this.hasBeenPurchased) {
			const currentKey = this.sprite.frame.source.texture.key;
			if (currentKey == this.spriteKeys.idle || currentKey == this.spriteKeys.sing) {
				this.sprite.setTexture(this.idleFrame());
			}
		}

		if (this.isWorking) {
			const count = this.spriteKeys.work.length;
			const index = Math.floor(time / 200) % count;
			const frame = this.spriteKeys.work[index];
			this.sprite.setTexture(frame);
		}
	}

	setCustomer(customer: Customer | null) {
		this.currentCustomer = customer;
		if(this.currentCustomer){
			if(this.currentCustomer.currentStation) {
				this.currentCustomer.currentStation.taskHaste*=this.workSpeed;
			}
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
				this.setPosition(pos.x, pos.y);

				const count = this.spriteKeys.walk.length;
				const index = Math.floor((progress * distance) / 40) % count;
				const frame = this.spriteKeys.walk[index];
				this.sprite.setTexture(frame);
			},

			onComplete: () => {
				const pos = path.getPoint(1);
				this.setPosition(pos.x, pos.y);

				// this.graphics.clear();
				this.sprite.setTexture(this.idleFrame());
				this.emit("walkend");
			},
		});
	}

	setAction(isWorking: boolean) {
		this.isWorking = isWorking;
		if (!isWorking) {
			this.sprite.setTexture(this.idleFrame());
		}
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
			this.sprite.setTexture(this.idleFrame());
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
		this.sprite.setTexture(this.idleFrame());
	}

	idleFrame() {
		return this.isSinging ? this.spriteKeys.sing : this.spriteKeys.idle;
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

	get spriteKeys() {
		return EmployeeTypeData[this.employeeType].spriteKeys;
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
