import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { SimpleButton } from "./elements/SimpleButton";
import { ShopItem } from "./ShopItem";
import { SnapType } from "./Item";
import { BuyButton } from "./elements/BuyButton";

export class ShopInventory extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public isOpen: boolean = false;
    public itemList: Item[];
    public display: ShopItem[];
    public window: Phaser.GameObjects.Image;
    public fwButton: SimpleButton;

    public buy1: BuyButton;
    public buy5: BuyButton;
    public buy10: BuyButton;
    public buyall: BuyButton;

    public pricedisp: Phaser.GameObjects.Text;
    public myinvdisp: Phaser.GameObjects.Text;

    public title: Phaser.GameObjects.Text;
    public tdisplay: Phaser.GameObjects.Text;
    private highlightIndex: number = -1;
    private currentIndices: number[] = [0,8];
    private coordinates: number[][] = [
        [64,64], [148,64], [232,64],
        [64,148], [148,148], [232,148],
        [64,232], [148,232], [232,232],
    ];
    constructor(scene:GameScene, x:number, y:number, stock:number[]){
        super(scene,x,y);    
        this.scene=scene;

        /*
                this.itemList = [
            new Item(0,"rock",stock[0],1,["rock","cheap"],["cheap"],"Complimentary Pet Rock","A loving pet rock to cheer up any customer. Works modestly well.", SnapType.CUSTOMER, "doink"),
            new Item(1,"sugar",stock[1],20,["drug"],["illegal","cool"],"Sugar","A delicious white powder made from plants. Improves working speed a whole bunch!", SnapType.STATION, "chomp"),
            new Item(2,"hotdog",stock[2],25,["red"],["red"],"Hot Dog","A thick wiener with condiments. This savory snack is great for hot-headed customers.", SnapType.CUSTOMER, "chomp"),
            new Item(3,"brocc",stock[3],12,["green"],["green"],"Broccoli","Verdant customers will be overjoyed to have this stalk of organic free-range broccoli.", SnapType.CUSTOMER, "chomp"),
            new Item(4,"snowglobe",stock[4],30,["blue"],["blue"],"Snowglobe", "A cute little snowglobe that appeals to frosty-looking customers.", SnapType.CUSTOMER, "doink"),
            new Item(5,"usb",stock[5],40,["kobold"],["kobold"],"Mini USB","A small piece of technology. A pleasant distraction for small kobolds.", SnapType.CUSTOMER, "doink"),
            new Item(6,"pocky",stock[6],35,["dino"],["dino"],"Packy","Sweet snack made of edible sticks. Dinosaurs love these.", SnapType.CUSTOMER, "chomp"),
            new Item(7,"milk",stock[7],30,["dragon"],["dragon"],"Fresh Milk","Warm, creamy milk. Grows strong bones. Essential for big dragons.", SnapType.CUSTOMER, "slurp"),
            new Item(8,"hourglass",stock[8],110,["time","physics","glass"],["physics"],"Hourglass","Place on a workstation to fully turn back the time on a customer's patience. Might make it hard to work though...", SnapType.STATION, "doink"),
            new Item(9,"hypnosis",stock[9],90,["hypno","horny","kinky","weird","psychic"],["horny","kinky","weird"],"Hypnosis","Uses a state of hypnosis to keep a customer's patience constant. You can't increase it any more either though.", SnapType.CUSTOMER, "doink"),
            new Item(10,"polish",stock[10],80,["expensive","creamy","musky"],["expensive","musky"],"Extra-Premium Polish","Put this on a station to give scales a wonderful gloss and unique scent. Most customers love it and will give you generous tips!", SnapType.STATION, "slurp"),
            new Item(11,"pillowtalk",stock[11],50,["horny","soft","cringe"],["horny","cringe"],"Pillow Talk","Instruct a station to talk to a customer alluringly and have them use more services. Good telemarketing is vital!", SnapType.STATION, "slurp"),
            new Item(12,"shuriken",stock[12],75,["sharp","weeb","ninja","cringe","cool"],["cool","cringe","weeb","sharp"],"Shuriken","Equip a station to allow the stylists to critically strike when grooming! It's some type of mysterious fidget spinner that sharpens mental capabilites. ", SnapType.STATION, "meme_explosion_sound"),
        ];
        */
        this.itemList = [
            new Item(0,"rock",stock[0],1,["rock","cheap"],["cheap"],"Complimentary Pet Rock","A loving pet rock to cheer up any customer. Works modestly well.", SnapType.CUSTOMER, "doink"),
            new Item(1,"coke",stock[1],10,["drug"],["illegal","cool"],"Sugar","A delicious white powder made from plants. Improves working speed a whole bunch!", SnapType.STATION, "chomp"),
            new Item(2,"hotdog",stock[2],15,["red"],["red"],"Hot Dog","A thick wiener with condiments. This savory snack is great for hot-headed customers.", SnapType.CUSTOMER, "chomp"),
            new Item(3,"brocc",stock[3],15,["green"],["green"],"Broccoli","Verdant customers will be overjoyed to have this stalk of organic free-range broccoli.", SnapType.CUSTOMER, "chomp"),
            new Item(4,"snowglobe",stock[4],15,["blue"],["blue"],"Snowglobe", "A cute little snowglobe that appeals to frosty-looking customers.", SnapType.CUSTOMER, "doink"),
            new Item(5,"usb",stock[5],15,["kobold"],["kobold"],"Mini USB","A small piece of technology. A pleasant distraction for small kobolds.", SnapType.CUSTOMER, "doink"),
            new Item(6,"pocky",stock[6],20,["dino"],["dino"],"Pöcky","Sweet snack made of edible sticks. Dinosaurs love these.", SnapType.CUSTOMER, "chomp"),
            new Item(7,"milk",stock[7],30,["dragon"],["dragon"],"Fresh Milk","Warm, creamy milk. Grows strong bones. Essential for big dragons.", SnapType.CUSTOMER, "slurp"),
            new Item(8,"hourglass",stock[8],30,["time","physics","glass"],["physics"],"Hourglass","Place on a workstation to fully turn back the time on a customer's patience. Might make it hard to work though...", SnapType.STATION, "doink"),
            new Item(9,"hypnosis",stock[9],30,["hypno","horny","kinky","weird","psychic"],["horny","kinky","weird"],"Hypnosis","Uses a state of hypnosis to keep a customer's patience constant. You can't increase it any more either though.", SnapType.CUSTOMER, "doink"),
            new Item(10,"polish",stock[10],50,["expensive","creamy","musky"],["expensive","musky"],"Extra-Premium Polish","Put this on a station to give scales a wonderful gloss and unique scent. Most customers love it and will give you generous tips!", SnapType.STATION, "slurp"),
            new Item(11,"pillowtalk",stock[11],40,["horny","soft","cringe"],["horny","cringe"],"Pillow Talk","Instruct a station to talk to a customer alluringly and have them use more services. Good telemarketing is vital!", SnapType.STATION, "slurp"),
            new Item(12,"shuriken",stock[12],25,["sharp","weeb","ninja","cringe","cool"],["cool","cringe","weeb","sharp"],"Shuriken","Equip a station to allow the stylists to critically strike when grooming! It's some type of mysterious fidget spinner that sharpens mental capabilites. ", SnapType.STATION, "meme_explosion_sound"),
        ];
        this.display = [];
        this.window = new Phaser.GameObjects.Image(this.scene,x,y,"shopwindow");
        this.window.setAlpha(0.85);
        //this.window.setVisible(false);
        this.window.setOrigin(-1,0);
        this.add(this.window);
        this.window.setDepth(1);
        this.title = this.scene.addText({
			x: 75,
			y: 760,
			size: 30,
			color: "#FFFFFF",
			text: "",
		});
        this.tdisplay = this.scene.addText({
			x: 75,
			y: 845,
			size: 25,
			color: "#FFFFFF",
			text: "",
		});
        this.tdisplay.setWordWrapWidth(500);
        this.add(this.title);
        this.add(this.tdisplay);
        this.fwButton = new SimpleButton(this.scene,580,400,"","fwbutton",10);
        this.fwButton.on("click", ()=> {this.scroll()});
        this.add(this.fwButton);
        this.scene.add.existing(this);

        this.buy1 = new BuyButton(this.scene, 390,602,"Buy 1", "buybutton", this, 1, 20);
        this.buyall = new BuyButton(this.scene, 390,690,"Buy All", "buybutton", this, -99, 20);
        this.buy5 = new BuyButton(this.scene, 520,602,"Buy 5", "buybutton", this, 5, 20);
        this.buy10 = new BuyButton(this.scene, 520,690,"Buy 10", "buybutton", this, 10, 20);

        this.buy1.on("click", ()=> {this.buy(this.buy1.mode)});
        this.buy5.on("click", ()=> {this.buy(this.buy5.mode)});
        this.buy10.on("click", ()=> {this.buy(this.buy10.mode)});
        this.buyall.on("click", ()=> {this.buy(this.buyall.mode)});

        this.add(this.buy1);
        this.add(this.buy5);
        this.add(this.buy10);
        this.add(this.buyall);

        this.disableAllBuyButtons();

        this.pricedisp = this.scene.addText({
			x: 80,
			y: 594,
			size: 24,
			color: "#FFFFFF",
			text: "",
		});
        this.pricedisp.setVisible(false);
        this.add(this.pricedisp);


        this.myinvdisp= this.scene.addText({
			x: 80,
			y: 682,
			size: 24,
			color: "#FFFFFF",
			text: "",
		});
        //this.myinvdisp.setVisible(false);
        this.myinvdisp.setVisible(false);
        this.add(this.myinvdisp);

    }

    unhighlight(){
        for(let p=0; p<this.display.length; p++){
            if(this.display[p].state==1){
                this.display[p].unselect();
            }
        }
        this.title.setText("");
        this.tdisplay.setText("");
        this.highlightIndex = -1;
    }

    highlight(id: number){
        this.title.setVisible(true);
        this.tdisplay.setVisible(true);
        this.title.setText(this.itemList[id].name);
        this.tdisplay.setText(this.itemList[id].desc);
        this.scene.sound.play("scroll", {volume: 0.5});
        this.highlightIndex = id;
        this.updateInvDisp(id);
        this.updateButtons(id);
    }

    buy(n: number){
        let nr = n;
        if(n > 0 || n == -99) {
            if(n == -99) {
                nr = this.itemList[this.highlightIndex].quant;
            }

            let pr = nr*this.itemList[this.highlightIndex].price;
            if(pr > this.scene.money) {
                this.scene.sound.play("fail", {volume: 0.5});
                return;
            }

            this.scene.buyItem(this.highlightIndex,nr);
            this.scene.removeMoney(pr);
            this.itemList[this.highlightIndex].quant -= nr;
            if(this.itemList[this.highlightIndex].quant <= 0){
                this.itemList[this.highlightIndex].quant = 0;
                this.display[this.highlightIndex].shadow();
                this.updateButtons(this.highlightIndex);
                this.hideInvDisp();
                this.clearPriceDisp();
                this.clearTextDisplays();
            } else {
                this.display[this.highlightIndex].updateAmt(this.itemList[this.highlightIndex].quant);
                this.updateButtons(this.highlightIndex);
                this.updateInvDisp(this.highlightIndex);
                this.updatePriceDisp(n);
            }
        }
    }

    clearTextDisplays(){
        this.title.setVisible(false);
        this.tdisplay.setVisible(false);
    }

    updateInvDisp(id: number){
        this.myinvdisp.setVisible(true);
        this.myinvdisp.setText("Owned: x" + this.scene.getAmountOwned(id));
    }

    hideInvDisp(){
        this.myinvdisp.setVisible(false);
    }

    clearInvDisp(){
        this.myinvdisp.setText("");
        this.myinvdisp.setVisible(false);
    }

    updatePriceDisp(qt: number){
        this.pricedisp.setColor("White");
        let qr = qt*this.itemList[this.highlightIndex].price;
        if(this.highlightIndex > 0) {
            if(qt == -99){
                qr = this.itemList[this.highlightIndex].quant*this.itemList[this.highlightIndex].price;
                this.pricedisp.setVisible(true);
            } else if (qt > 0) {
                this.pricedisp.setVisible(true);
            } else {
                this.pricedisp.setVisible(false);
                return;
            }
            if(qr > this.scene.money) {
                this.pricedisp.setColor("Red");
            }
            this.pricedisp.setText("Total: $"+qr);
        }
    }
    
    clearPriceDisp(){
        this.pricedisp.setColor("White");
        this.pricedisp.setText("");
        this.pricedisp.setVisible(false);
    }

    updateButtons(id: number){
        let p = this.itemList[id].quant;
        this.enableAllBuyButtons()
        if(p <= 0) {
            this.disableAllBuyButtons();
        } else {
            if(p < 5) {
                this.disableButton(this.buy5);
                this.disableButton(this.buy10);
            } else if (p < 10){
                this.disableButton(this.buy10);
            }
        }
    }


    updateInvText(id:number){
        this.myinvdisp.setText("Owned: x" + this.scene.getAmountOwned(id));
    }

    

    disableButton(B: SimpleButton){
        B.turnOff();
        B.setVisible(false);
    }

    enableAllBuyButtons(){
        this.buy1.turnOn();
        this.buy1.setVisible(true);
        this.buy5.turnOn();
        this.buy5.setVisible(true);
        this.buy10.turnOn();
        this.buy10.setVisible(true);
        this.buyall.turnOn();
        this.buyall.setVisible(true);
    }


    disableAllBuyButtons(){
        this.buy1.turnOff();
        this.buy1.setVisible(false);
        this.buy5.turnOff();
        this.buy5.setVisible(false);
        this.buy10.turnOff();
        this.buy10.setVisible(false);
        this.buyall.turnOff();
        this.buyall.setVisible(false);
    }

    populate(){
        //only run on init!
        let rs = 0;
        for(let np = this.currentIndices[0]; np < this.currentIndices[1]+1; np++){
            if(np < this.itemList.length){
                this.display.push(new ShopItem(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, this.itemList[np].id, rs, this.itemList[np].spr, this.itemList[np].quant));
                if(this.itemList[np].quant <= 0) {
                    this.display[rs].shadow();
                }
                this.add(this.display[rs]);
            }
            else {
                this.display[rs] = new ShopItem(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, -1, rs, "blankspr", 0);
                this.add(this.display[rs]);
                this.display[rs].shadow();
            }
            rs++;
        }
    }

    repopulate(){
        let rs = 0;
        this.display.forEach((sp) => sp.destroy());
        this.display = [];
        for(let np = this.currentIndices[0]; np < this.currentIndices[1]+1; np++){
            if(np < this.itemList.length){
                this.display.push(new ShopItem(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, this.itemList[np].id, rs, this.itemList[np].spr, this.itemList[np].quant));
                if(this.itemList[np].quant <= 0) {
                    this.display[rs].shadow();
                }
                this.add(this.display[rs]);
            }
            else {
                this.display.push(new ShopItem(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, -1, rs, "blankspr", 0));
                this.display[rs].shadow();
                this.add(this.display[rs]);
            }
            rs++;
        }
    }

    toggle(){
        if(!this.isOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    close(){
        this.scene.sound.play("t_rustle", {volume: 0.5});
        this.display.forEach((ib) => ib.destroy());
        this.setPosition(-650,0);
        this.isOpen=false;
        this.display = [];
        this.window.setVisible(false);
        this.title.setText("");
        this.tdisplay.setText("");
        this.currentIndices=[0,8];
        this.highlightIndex = -1;
        this.clearInvDisp();
        this.disableAllBuyButtons();
        this.clearPriceDisp();
    }

    open(){
        this.scene.sound.play("t_rustle", {volume: 0.5});
        this.window.setVisible(true);
        //console.log("Open Processed");
        this.x = 0;
        this.y = 0;
        this.isOpen=true;
        this.populate();
        this.clearInvDisp();
        this.disableAllBuyButtons();
        this.clearPriceDisp();
    }

    returnItem(id: number){
        this.itemList[id].quant++;
        //console.log("STATE: " + this.isOpen + " ID: " + id + " HIGHLIGHT: " + this.highlightIndex);
        if(this.isOpen){
            if((this.highlightIndex >=0) && (id==this.highlightIndex)){
                //this.scene.sound.play("meme_explosion_sound", {volume: 0.5});
                this.updateAmountText(id,this.itemList[id].quant);
            }
        }
        
    }

    updateAmountText(id:number, i: number){
        if(i > 0) {
            this.title.setText(this.itemList[id].name);
        } else {
            this.title.setText("");
            this.tdisplay.setText("");
        }
    }

    scroll(){
        if(this.currentIndices[1] < this.itemList.length) {
            let b = this.currentIndices[1] + 1;
            let e = this.currentIndices[1] + 8;
            this.currentIndices = [b,e];
        } else {
            this.currentIndices = [0,8];
        }
        this.title.setText("");
        this.tdisplay.setText("");
        this.scene.sound.play("button", {volume: 0.5});
        this.clearPriceDisp();
        this.hideInvDisp();
        this.disableAllBuyButtons();
        this.repopulate();

    }
}