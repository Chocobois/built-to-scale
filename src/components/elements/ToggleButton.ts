import { BaseScene } from "@/scenes/BaseScene";
import { Button } from "./Button";

export class ToggleButton extends Button{
    public scene:BaseScene;
    public spr:Phaser.GameObjects.Sprite
    public toggled: boolean = false;
    constructor(scene:BaseScene,x:number,y:number,spr:string){
        super(scene,x,y);
        this.scene=scene;
        this.spr=new Phaser.GameObjects.Sprite(this.scene,0,0,spr,0);
        this.spr.setOrigin(0.5,0.5);
        this.bindInteractive(this.spr);
        this.add(this.spr);
    }

    toggleForward(){
        this.toggled = true;
        this.spr.setFrame(1);
    }

    toggleBackward(){
        this.toggled = false;
        this.spr.setFrame(0);
    }

}