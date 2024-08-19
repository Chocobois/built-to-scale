export enum SnapType {
    CUSTOMER,
    STATION,
}

export class Item {
    public id:number;
    public spr:string;
    public quant:number;
    public price:number;
    public tags:string[];
    public antitags:string[];
    public name:string;
    public desc:string;
    public snap:SnapType;
    public sound: string;

    public clippingType: number;

    //-1 - default item, does nothing
    //0 - Complimentary Pet Rock - increases satisfaction by one stage
    //1 - cocaine - doubles station workspeed, once
    //2 - hot dog - increases satisfaction by 2 stages for velociraptors
    //3 - broccoli - increases satisfaction by 2 stages for triceratops
    //4 - usb - increases satisfaction by 2 stages for protogen
    //5 - fresh milk - increases satisfaction by 2 stages for dragon
    //6 - snow globe - increases satisfaction by 2 stages for lugia
    //7 - pocky - increases satisfaction by 2 stages for boykisser
    //8 - hourglass - station takes twice as long, but resets patience
    //9 - hypnosis - customers no longer lose patience after being serviced at least once, but patience cannot increase either
    //10 - extra polish - increases tips received by 100% base amount, unless customer is cheap
    //11 - pillow talk - adds a random station to the end of a customer's itinerary
    //12 - shuriken - barbers can crit, crit causes happiness to raise one stage

    constructor(id:number,sp:string,qt:number,pr:number,tgs:string[],atgs:string[],name:string,dsc:string,snptype: SnapType, sound: string) {
        this.id=id;
        this.spr=sp;
        this.quant=qt;
        this.price=pr;
        this.tags=tgs;
        this.antitags=atgs;
        this.name=name;
        this.desc=dsc;
        this.snap = snptype;
        this.sound = sound;

    }

    setQuantity(n:number){
        this.quant=n;
    }
}