import { Item } from "./Item";
import { Inventory } from "./Inventory";
import { Button } from "./elements/Button";
import { BaseScene } from "@/scenes/BaseScene";

export class ItemButton extends Button {
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
    private parent: Inventory;
    constructor(scene:BaseScene,x:number,y:number,parent: Inventory, id:number, index:number, spr:string){
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
        } else if (this.state == 1) {
            this.state = 3;
            this.parent.remove(this);
            this.parent.scene.setActiveItem(this);
            this.setPosition(0,0);
            this.split();
            this.passivate = true;
            this.setDepth(5);
        }
    }

	onDragStart(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.dragged = true;
        this.emit("itempickup");
	}

    onDrag(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
		this.hold = false;
		this.dragX = pointer.x;
		this.dragY = pointer.y;
		this.emit("itemdrag");
	}

	onDragEnd(pointer: Phaser.Input.Pointer, dragX: number, dragY: number) {
        this.dragged = false;
        if(this.state == 3) {
            this.emit("itemdrop");
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

    shadow(){
        this.spr.setFrame(2);
        this.passivate = true;
        this.state = 2;
    }

    snapTo(x:number,y:number){
        this.x=x-this.default[0];
        this.y=y-this.default[1];
    }

    unshadow(){
        this.state = 1;
        this.spr.setFrame(1);
        this.passivate = false;
    }

    split(){
        this.parent.display[this.index] = new ItemButton(this.scene,this.default[0],this.default[1],this.parent,this.id,this.index,this.sprname);
        this.parent.itemList[this.id].quant--;
        let r = this.parent.itemList[this.id].quant;
        if(r <= 0) {
            this.parent.display[this.index].shadow();
        } else {
            this.parent.display[this.index].select();
        }
        this.parent.updateAmountText(this.id,r);
    }

}