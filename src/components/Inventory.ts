import { BaseScene } from "@/scenes/BaseScene";
import { GameScene } from "@/scenes/GameScene";
import { Item } from "./Item";
import { SimpleButton } from "./elements/SimpleButton";
import { ItemButton } from "./ItemButton";

export class Inventory extends Phaser.GameObjects.Container {
    public scene: GameScene;
    public isOpen: boolean = false;
    public itemList: Item[];
    public display: ItemButton[];
    public window: Phaser.GameObjects.Image;
    public fwButton: SimpleButton;
    public title: Phaser.GameObjects.Text;
    public tdisplay: Phaser.GameObjects.Text;
    private currentIndices: number[] = [0,11];
    private coordinates: number[][] = [
        [64,64], [148,64], [232,64],
        [64,148], [148,148], [232,148],
        [64,232], [148,232], [232,232],
        [64,316], [148,316], [232,316]
    ];
    constructor(scene:GameScene, x:number, y:number, stock:number[]){
        super(scene,x,y);    
        this.scene=scene;
        this.itemList = [
            new Item(0,"rock",stock[0],1,["rock","cheap"],["cheap"],"Complimentary Pet Rock","A loving pet rock to cheer up any customer. Works modestly well."),
            new Item(1,"coke",stock[1],50,["drug"],["illegal","cool"],"Cocaine","A delicious white powder made from plants. Improves working speed a whole bunch!"),
            new Item(2,"hotdog",stock[2],25,["velociraptor","meat","bread","skeleton","ketchup","mustard","gay"],["meat","elitist","gay","gluten"],"Hot Dog","A big wiener with sauce, to satisfy any meat lover. You can also buy a bacon-wrapped cheesy version for 69 kr."),
            new Item(3,"brocc",stock[3],12,["triceratops","veggie","healthy","stinky"],["veggie","healthy","stinky"],"Broccoli","This large stalk of free-range broccoli is perfect for vegans and herbivorous animals."),
            new Item(4,"usb",stock[4],30,["protogen","tech","metal","nerd"],["nerd","tech"],"Mini USB Drive", "Additional storage space in a compact unit. I wonder who would want this?"),
            new Item(5,"milk",stock[5],40,["dragon","horny","creamy","lactose","gay"],["horny","creamy","lactose","gay"],"Fresh Milk","Fresh, creamy milk for dragons. Still warm and thick."),
            new Item(6,"snowglobe",stock[6],35,["lugia","kitsch","cold","ball"],["kitsch","cold","ball"],"Snowglobe","A cute little snowglobe. A certain type of customer might want this."),
            new Item(7,"pocky",stock[7],30,["boykisser","weeb","cringe","sweet","chocolate"],["weeb","cringe","sweet"],"P*cky","Sweet snack made of edible sticks. There's a traditional game where you kiss while biting them. A favorite of virgins."),
            new Item(8,"hourglass",stock[8],110,["time","physics","glass"],["physics"],"Hourglass","Turns back the time on a customer's patience. Might make it hard to work though..."),
            new Item(9,"hypnosis",stock[9],90,["hypno","horny","kinky","weird","psychic"],["horny","kinky","weird"],"Hypnosis","Uses a state of hypnosis to keep a customer's patience constant. You can't increase it any more either though."),
            new Item(10,"polish",stock[10],80,["expensive","creamy","musky"],["expensive","musky"],"Extra-Premium Polish","Gives scales a wonderful gloss and unique scent. Most customers love it, but comes at a premium."),
            new Item(11,"pillowtalk",stock[11],50,["horny","soft","cringe"],["horny","cringe"],"Pillow Talk","Talk to a customer alluringly to have them use more services. Good telemarketing is vital!"),
            new Item(12,"shuriken",stock[12],75,["sharp","weeb","ninja","cringe","cool"],["cool","cringe","weeb","sharp"],"Shuriken","Some type of fidget spinner that sharpens mental capabilites. Allows a worker to critical manicure."),
        ];
        this.display = [];
        this.window = new Phaser.GameObjects.Image(this.scene,x,y,"invwindow");
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
        this.fwButton = new SimpleButton(this.scene,x,y,"","fwbutton",10);
        this.fwButton.on("click", ()=> {this.scroll()});
        this.scene.add.existing(this);
    }

    unhighlight(){
        for(let p=0; p<this.display.length; p++){
            if(this.display[p].state==1){
                this.display[p].unselect();
            }
        }
        this.title.setText("");
        this.tdisplay.setText("");
    }

    highlight(id: number){
        this.title.setText(this.itemList[id].name + " x" + this.itemList[id].quant);
        this.tdisplay.setText(this.itemList[id].desc);
        this.scene.sound.play("scroll");
    }

    populate(){
        //only run on init!
        let rs = 0;
        for(let np = this.currentIndices[0]; np < this.currentIndices[1]+1; np++){
            if(np < this.itemList.length){
                this.display.push(new ItemButton(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, this.itemList[np].id, rs, this.itemList[np].spr));
                if(this.itemList[np].quant <= 0) {
                    this.display[rs].shadow();
                }
                this.add(this.display[rs]);
            }
            else {
                this.display[rs] = new ItemButton(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, -1, rs, "blankspr");
                this.add(this.display[rs]);
            }
            rs++;
        }
    }

    repopulate(){
        let rs = 0;
        for(let np = this.currentIndices[0]; np < this.currentIndices[1]+1; np++){
            this.display[rs].destroy();
            if(np < this.itemList.length){
                this.display[rs] = new ItemButton(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, this.itemList[np].id, rs, this.itemList[np].spr);
                if(this.itemList[np].quant <= 0) {
                    this.display[rs].shadow();
                }
                this.add(this.display[rs]);
            }
            else {
                this.display[rs] = new ItemButton(this.scene,this.coordinates[rs][0], this.coordinates[rs][1], this, -1, rs, "blankspr");
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
        this.scene.sound.play("t_rustle");
        this.display.forEach((ib) => ib.destroy());
        this.setPosition(-650,0);
        this.isOpen=false;
        this.display = [];
        this.window.setVisible(false);
    }

    open(){
        this.scene.sound.play("t_rustle");
        this.window.setVisible(true);
        console.log("Open Processed");
        this.x = 0;
        this.y = 0;
        this.isOpen=true;
        this.populate();
    }

    returnItem(id: number){
        this.itemList[id].quant++;
    }

    updateAmountText(id:number, i: number){
        if(i > 0) {
            this.title.setText(this.itemList[id].name + " x" + i);
        } else {
            this.title.setText("");
            this.tdisplay.setText("");
        }
    }

    scroll(){
        if(this.currentIndices[1] < this.itemList.length) {
            let b = this.currentIndices[1] + 1;
            let e = this.currentIndices[1] + 11;
            this.currentIndices = [b,e];
        } else {
            this.currentIndices = [0,11];
        }
        this.repopulate();

    }
}