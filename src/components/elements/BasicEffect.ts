import { BaseScene } from "@/scenes/BaseScene";

export class BasicEffect {
    public sp: Phaser.GameObjects.Sprite;
    private isLooped: boolean;
    private frameLength: number;
    private myScene: BaseScene;
    private timer: number = 0;
    private totalFrames: number;
    private startingFrame: number;
    private currentFrame: number = 0;
    public deleteFlag: boolean = false;
    public velocityX: number = 0;
    public velocityY: number = 0;

	// private hover: boolean;
	constructor(scene: BaseScene, value: string, x: number, y: number, tFrames: number, fLen: number = 100, loop: boolean = false, sFrame: number = 0) {
		this.sp = scene.add.sprite(x,y,value);
        this.frameLength = fLen;
        this.isLooped = loop;
        this.totalFrames = tFrames;
        this.startingFrame = sFrame;
        this.currentFrame = this.startingFrame;
        this.sp.setFrame(this.startingFrame);
       // scene.add.existing(this.sp);
	}

    setPosition(xx: number, yy: number){
        this.sp.setX(xx);
        this.sp.setY(yy);
    }

    setVelocityX(v: number){
        this.velocityX = v;
    }

    setVelocityY(v: number) {
        this.velocityY = v;
    }

    stopMovement(){
        this.velocityX = 0;
        this.velocityY = 0;
    }

    update(d: number){
        if(this.deleteFlag){
            return;
        }
        if (this.timer <= this.frameLength) {
            this.timer += d;
            this.sp.setX(this.sp.x + (this.velocityX*(d/1000)));
            this.sp.setY(this.sp.y + (this.velocityY*(d/1000)));
            if (this.timer >= this.frameLength) {
                this.timer = 0;
                if(this.currentFrame < (this.totalFrames-1)) {
                    this.currentFrame++;
                    this.sp.setFrame(this.currentFrame);
                } else if (this.currentFrame >= (this.totalFrames-1)) {
                    if(this.isLooped) {
                        this.currentFrame = 0;
                        this.sp.setFrame(this.currentFrame);
                    } else {
                        this.deleteFlag = true;
                        this.sp.setAlpha(0);
                    }
                }
                
            }
        }
    }
}
