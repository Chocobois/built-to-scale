import { BaseScene } from "@/scenes/BaseScene";
import { SimpleButton } from "./SimpleButton";
import { ShopInventory } from "../ShopInventory";
import { GameScene } from "@/scenes/GameScene";


export class BuyButton extends SimpleButton{
    public scene:GameScene;
    public parent:ShopInventory;
    private ONE: number = 1;
    private FIVE: number = 5;
    private TEN: number = 10;
    private ALL: number = -99;
    public mode: number = 1;

    constructor(scene: GameScene, x: number, y: number, v: string, spr: string, pr: ShopInventory, state: number, fsize: number = 40) {
        super(scene,x,y,v,spr,fsize);
        this.scene=scene;
        this.parent = pr;
        this.mode = state;
    }

	onOver(	pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData){
			super.onOver(pointer,localX,localY,event);
            this.parent.updatePriceDisp(this.mode);
	}

	onOut(pointer: Phaser.Input.Pointer, event: Phaser.Types.Input.EventData) {
		super.onOut(pointer,event);
        this.parent.clearPriceDisp();
	}
}