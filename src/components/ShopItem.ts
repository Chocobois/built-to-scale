import { Item, SnapType } from "./Item";
import { ShopInventory } from "./ShopInventory";
import { Button } from "./elements/Button";
import { BaseScene } from "@/scenes/BaseScene";

export class ShopItem extends Button {
    public id: number;
    public index: number;
    public sprname: string;
    public spr: Phaser.GameObjects.Sprite;
    public default: number[];
    public state: number = 0;
    public passivate: boolean = false;
    public dragX: number; // Current drag position
	public dragY: number;
    public doingCuteThing: boolean;
    private parent: ShopInventory;
    public qt: number;
    public qtDisp: Phaser.GameObjects.Text;
    constructor(scene:BaseScene,x:number,y:number,parent: ShopInventory, id:number, index:number, spr:string, qt: number){
        super(scene,x,y);
        this.parent = parent;
        this.default = [x,y];
        this.id=id;
        this.index=index;
        this.sprname = spr;
        this.spr = new Phaser.GameObjects.Sprite(this.scene,x,y,spr,0);
        this.spr.setOrigin(0.5,0.5);
        this.bindInteractive(this.spr, true);
        this.add(this.spr);
        this.parent.add(this);
        this.setDepth(4);
        this.qt = qt;

        this.qtDisp = this.scene.addText({
			x: x+30,
			y: y+40,
			size: 14,
			color: "#FFFFFF",
			text: "x" + qt,
		});
        this.add(this.qtDisp);
    }

    updateQt(qt: number){
        this.qtDisp.setText(""+qt);
    }

	onDown(
		pointer: Phaser.Input.Pointer,
		localX: number,
		localY: number,
		event: Phaser.Types.Input.EventData
	) {

        super.onDown(pointer,localX,localY,event);
        if(this.passivate){
            return;
        } else {
            this.parseClick();
        }

    }

    update(time: number, delta: number){
        if(this.state == 3) {
            this.x = this.dragX-this.default[0];
            this.y = this.dragY-this.default[1];

            /*
            this.x += (this.dragX - this.x) * 0.5;
            this.y += (this.dragY - this.y) * 0.5;
            */
        }
        /*
		const factor = this.doingCuteThing ? 0.1 : 0.02;
		const squish = 1.0 + factor * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
        */
    }

    parseClick(){
        if(this.state == 0) {
            this.parent.unhighlight();
            this.select();
            this.parent.highlight(this.id);
        }
    }

    select(){
        this.state = 1;
        this.spr.setFrame(1);
    }

    unselect(){
        if(this.parent.itemList[this.id].quant <= 0){
            this.shadow();
        } else {
            this.state = 0;
            this.spr.setFrame(0);
            this.passivate = false;
        }
    }

    updateAmt(n: number){
        this.qt = n;
        this.qtDisp.setText("x"+this.qt);
    }

    shadow(){
        this.spr.setFrame(2);
        this.qtDisp.setText("x"+0);
        this.qtDisp.setVisible(false);
        this.passivate = true;
        this.state = 2;
    }

    unshadow(){
        this.state = 1;
        this.spr.setFrame(1);
        this.qtDisp.setText(""+0);
        this.qtDisp.setVisible(false);
        this.passivate = false;
    }


}