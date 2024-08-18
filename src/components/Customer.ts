import { GameScene } from "@/scenes/GameScene";
import { Button } from "./elements/Button";
import { Station } from "./Station";
import { Employee } from "./Employee";
import { Timer } from "./Timer";
import { interpolateColor } from "@/functions";
import { ThoughtBubble } from "./ThoughtBubble";
import { StationType } from "./StationData";
import { CustomerData, CustomerId } from "./CustomerData";
import { Effect } from "./Effect";
import { TextEffect } from "./TextEffect";

export interface CustomerType {
	spr: string;
	tags: string[];
	antitags: string[];
	budget: number;
	
}

export class Customer extends Button {
	public customerId: CustomerId;
	public scene:GameScene;
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

	// Stats
	public doingCuteThing: boolean;
	public tasksCompleted: number;
	public moneySpent: number;


	// Graphics
	private sprite: Phaser.GameObjects.Sprite;
	private thoughtBubble: ThoughtBubble;
	private angryImage: Phaser.GameObjects.Image;
	private patienceTimer: Timer;

	constructor(scene: GameScene, x: number, y: number, id: CustomerId) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;
		this.customerId = id;

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
		const size = 120;
		this.sprite = this.scene.add.sprite(0, 0, this.spriteKeys.sit);
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

		this.patienceTimer = new Timer(
			scene,
			-0.3 * size,
			-0.3 * size,
			0.6 * size,
			0xfa9425
		);
		//this.patienceTimer.setAlpha(0);
		this.add(this.patienceTimer);

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
			this.patienceTimer.setVisible(true);
			if (!this.dragged) {
				// 20 seconds
				if(!this.lockPatience){
					this.patience -= (1 / 40) * (delta / 1000);
				}
			}

			this.patienceTimer.setColor(
				interpolateColor(0xff0000, 0x00ff00, this.patience)
			);
			this.patienceTimer.redraw(this.patience/this.maxPatience);
			this.angryImage.setVisible(this.patience <= 0.5);

			if (this.patience <= 0) {
				this.leave();
				this.thoughtBubble.showSymbol("sad");
				this.emit("angry");
			}
		} else {
			this.patienceTimer.setVisible(false);
			this.angryImage.setVisible(false);
		}
	}

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.emit("pickup");
		this.dragged = true;
		this.sprite.setTexture(this.spriteKeys.walk);
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

	}

	resetPatience(){
		this.patience = this.maxPatience*1.25;
	}

	miniRefresh(){
		if(!this.lockPatience) {
			this.patience += 0.125;
			if(this.patience > 1.25){
				this.patience = 1.25;
			}
		}
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
			//this.happiness = 1;

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
			this.setRequest(StationType.CashRegister);
		} else {
			this.parseMoney();
			this.scene.sound.play("cashmoney");
			this.scene.addEffect(new TextEffect(this.scene, this.x-70+(Math.random()*80), this.y-80, "+" + this.moneySpent +" €", "yellow", 40, true, "red", 800, 100, 0.7, 0));
			this.scene.addEffect(new TextEffect(this.scene, this.x-40+(Math.random()*80), this.y-20, "Tips +" + this.tips +" €", "yellow", 40, true, "red", 800, 100, 0.7, 0));
			this.emit("pay", this.moneySpent);
			this.emit("tip", this.tips);
			this.leave();
		}
	}

	leave() {
		this.sprite.input!.enabled = false;

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
	}
	recheckHappiness(){
		if(this.hasCompleted){
			return;
		}
		let tempeh = this.happiness;
		//console.log("Base Happiness " + tempeh);
		(this.patience > 0.5) ? (tempeh += 2) : (tempeh += (4*this.patience/this.maxPatience));
		//console.log("With Patience Happiness " + tempeh);

		if(this.patience >= 1) {
			tempeh += 1;
		}
		//console.log("With Bonus Patience Happiness " + tempeh);
		tempeh += this.rockBonus;
		if(tempeh > 4.01) {
			tempeh = 4.01;
		}
		//console.log("With Rock Happiness " + tempeh);
		tempeh += this.happinessBonus;

		if(tempeh < this.minHappiness) {
			tempeh = this.minHappiness;
		}
		if(tempeh > this.maxHappiness) {
			tempeh = this.maxHappiness;
		}

		let rt = Math.trunc(tempeh);
		switch(rt) {
			case 1: {
				this.thoughtBubble.showSymbol("h1");
				break;
			} case 2: {
				this.thoughtBubble.showSymbol("h2");
				break;
			} case 3: {
				this.thoughtBubble.showSymbol("h3");
				break;
			} case 4: {
				this.thoughtBubble.showSymbol("h4");
				break;
			} case 5: {
				this.thoughtBubble.showSymbol("h5");
				break;
			} case 6: {
				this.thoughtBubble.showSymbol("h6");
				break;
			}
		}
	}
	parseHappiness(){
		let yiff = this.happiness;
		//console.log("Base Happiness " + tempeh);
		(this.patience > 0.5) ? (yiff += 2) : (yiff += (4*this.patience/this.maxPatience));
		//console.log("With Patience Happiness " + tempeh);

		if(this.patience >= 1) {
			yiff += 1;
		}
		//console.log("With Bonus Patience Happiness " + tempeh);
		yiff += this.rockBonus;
		if(yiff > 4.01) {
			yiff = 4.01;
		}
		//console.log("With Rock Happiness " + tempeh);
		yiff += this.happinessBonus;

		if(yiff < this.minHappiness) {
			yiff = this.minHappiness;
		}
		if(yiff > this.maxHappiness) {
			yiff = this.maxHappiness;
		}
		
		this.tips = (this.baseTips*(1+this.tipBonus));

		let bleistiftspitzer = Math.trunc(yiff);
		switch(bleistiftspitzer) {
			case 1: {
				this.thoughtBubble.showSymbol("h1");
				this.tips += (0+this.tipBonus)*this.moneySpent;
				break;
			} case 2: {
				this.thoughtBubble.showSymbol("h2");
				this.tips += (0.05+this.tipBonus)*this.moneySpent;
				break;
			} case 3: {
				this.thoughtBubble.showSymbol("h3");
				this.tips += (0.10+this.tipBonus)*this.moneySpent;
				break;
			} case 4: {
				this.thoughtBubble.showSymbol("h4");
				this.tips += (0.25+this.tipBonus)*this.moneySpent;
				break;
			} case 5: {
				this.thoughtBubble.showSymbol("h5");
				this.tips += (0.50+this.tipBonus)*this.moneySpent;
				break;
			} case 6: {
				this.thoughtBubble.showSymbol("h6");
				this.tips += (1+this.tipBonus)*this.moneySpent;
				break;
			}
		}
		console.log("TIPS: " + this.tips);
		this.tips *= this.tipMultiplier;
		this.tips = Math.trunc(this.tips);
	}

	parseMoney(){
		this.parseHappiness();
	}

	/* Getters */

	get isWaiting(): boolean {
		return this.currentStation !== null && this.currentEmployee === null;
	}

	get spriteKeys() {
		return CustomerData[this.customerId].spriteKeys;
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
