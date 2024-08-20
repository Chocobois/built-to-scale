import { GameScene } from "@/scenes/GameScene";

export class PatienceTimer extends Phaser.GameObjects.Container {
	private background: Phaser.GameObjects.Image;
    private bar: Phaser.GameObjects.Rectangle;
    private anger: Phaser.GameObjects.Sprite;
    private sparks: Phaser.GameObjects.Sprite
	private graphics: Phaser.GameObjects.Graphics;
	private size: number;
	private color: number;
    private veiled: boolean = true;
    private vTimer: number = 0;
    private vfTimer: number = 0;
    private critical:boolean = false;
    private DEFAULT_ALPHA: number = 0.8;
    private workingAlpha: number = 0.8;
    private lock: boolean = false;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		scale: number,
		color: number
	) {
		super(scene, x, y);
		scene.add.existing(this);

		this.scene = scene;
		this.scale = scale;
		this.color = color;
        this.bar = this.scene.add.rectangle(0,-60,16,128,0x00FF00);
        this.bar.setOrigin(0.5,0);
        this.anger = new Phaser.GameObjects.Sprite(this.scene,0,-80,"ellipse");
        this.sparks = new Phaser.GameObjects.Sprite(this.scene,0,64,"defaultspark");
        this.sparks.setTint(0x00FF00);
        this.sparks.setScale(0.5);
        this.anger.setVisible(false);
        
        this.add(this.bar);
        this.add(this.sparks);
        this.add(this.anger);
        this.updateAlpha(this.DEFAULT_ALPHA);
		//this.background = this.scene.add.image(0, 0, "timer");
		//this.background.setScale(size / this.background.width);
		//this.add(this.background);

		this.graphics = this.scene.add.graphics();
		this.add(this.graphics);
        this.setVisible(false);
	}

	setColor(color: number) {
		this.color = color;
	}

    update(t:number,d:number){
        if(Math.sin(t/120) > 0){
            this.anger.setFrame(0);
            this.sparks.setFrame(0);
        } else {
            this.anger.setFrame(1);
            this.sparks.setFrame(1);
        }

        if(this.critical) {
            this.bar.fillColor = 0xFF0000;
            this.sparks.setTint(0xFF0000);
        } else {
            this.bar.fillColor = 0x00FF00;
            this.sparks.setTint(0x00FF00);
        }



        if(this.veiled) {
            if(this.vTimer > 0) {
                this.vTimer -= d;
                if(this.vTimer <= 0) {
                    this.setVisible(false);
                    this.updateAlpha(this.DEFAULT_ALPHA);
                    this.vTimer = 0;
                } else {
                    this.updateAlpha(this.DEFAULT_ALPHA*this.vTimer/500);
                }
            }
        } else if (!this.veiled) {
            if(this.vfTimer > 0) {
                this.vfTimer -= d;
                if(this.vfTimer <= 0) {
                    this.vfTimer = 0;
                    this.updateAlpha(this.DEFAULT_ALPHA);
                } else {
                    this.updateAlpha(this.DEFAULT_ALPHA*((200-this.vfTimer)/200));
                }
            }
        }
    }

    lockTimer(){
        this.lock = true;
    }

    unlockTimer() {
        this.lock = false;
    }

    unveil(){
        if(this.lock) {
            return;
        }
        this.setVisible(true);
        this.vTimer = 0;
        this.vfTimer = 200;
        this.veiled = false;
    }

    veil(){
        if(this.lock){
            return;
        }
        this.updateAlpha(this.DEFAULT_ALPHA);
        this.vTimer = 500;
        this.veiled = true;
    }

    updateAlpha(n: number){
        this.sparks.setAlpha(n);
        this.bar.setAlpha(n);
        this.anger.setAlpha(n);
    }

    resetAlpha(){
        if(this.critical){
            this.sparks.setAlpha(1);
            this.bar.setAlpha(1);
            this.anger.setAlpha(1);
        } else {
            this.sparks.setAlpha(0.5);
            this.bar.setAlpha(0.5);
            this.anger.setAlpha(0.5);
        }
    }

	redraw(factor: number) {

        /*
		const radius = 0.24 * this.size;
		const border = 0.055 * this.size;

		this.graphics.clear();
		this.graphics.beginPath();
		this.graphics.fillStyle(this.color);
		this.graphics.moveTo(0, 0);
		this.graphics.arc(
			0,
			0,
			radius - border,
			-Math.PI / 2,
			-Math.PI / 2 + factor * 2 * Math.PI
		);
		this.graphics.closePath();
		this.graphics.fillPath();
        */
       this.bar.setScale(1,factor);
       this.sparks.setY(-64+(128*factor));
       if((factor < 0.5) && !(this.critical)){
            this.critical = true;
            this.anger.setTexture("anger");
            this.sparks.setTint(0xFF0000);
            this.sparks.setAlpha(1);
            this.bar.setAlpha(1);
            this.anger.setAlpha(1);
            this.bar.fillColor = 0xFF0000;
       }
	}
}
