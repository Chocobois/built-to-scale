import { Item } from "./Item";
import { GameScene } from "@/scenes/GameScene";
import { Station } from "./Station";
import { Customer } from "./Customer";
import { StationType } from "./StationData";

export class ItemHandler {
    public scene: GameScene;
    constructor(scene:GameScene) {
        this.scene = scene;
    }

    process(i: Item, st: Station, ct: Customer){
        switch(i.id)
        {
            case -1: {
                break;
            } case 0: {
                break;
            } case 1: {
                st.taskHaste *= 0.5;
                break;
            } case 2: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 3: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 4: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 5: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 6: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 7: {
                this.parsePreferredItem(i,st,ct);
                break;
            } case 8: {
                ct.patience = 100;
                st.taskHaste*=2;
                break;
            } case 9: {
                ct.lockPatience = true;
                break;
            } case 10: {
                let tstate = 0
                if((i.antitags.length > 0) && ct.cdata.antitags.length > 0){
                    for(let na = 0; na < i.antitags.length; na++){
                        if(ct.cdata.antitags.includes(i.tags[na])) {
                            tstate = -1;
                        }
                    }
                }

                if(tstate == -1) {
                    ct.happinessStage -= 2;
                    ct.maxHappiness = 3;
                    ct.tipMultiplier *= 0.1;
                    return;
                } else {
                    ct.tipMultiplier ++;
                    return;
                }
            } case 11: {
                let r = Math.random()*3;
                if(r < 1) {
                    ct.itinerary.push(StationType.HornAndNails);
                } else if (r < 2) {
                    ct.itinerary.push(StationType.ScalePolish);
                } else if (r < 3) { 
                    ct.itinerary.push(StationType.GoldBath);
                }
            } case 12: {

            }
            break;
        }
    }

    parsePreferredItem(i: Item, st:Station, ct:Customer){
        let state = 0;
        if((i.tags.length > 0) && (ct.cdata.tags.length > 0)) {
            for(let nt = 0; nt < i.tags.length; nt++){
                if(ct.cdata.tags.includes(i.tags[nt])) {
                    state = 1;
                }
            }
        }

        if((i.antitags.length > 0) && ct.cdata.antitags.length > 0){
            for(let na = 0; na < i.antitags.length; na++){
                if(ct.cdata.antitags.includes(i.tags[na])) {
                    state = -1;
                }
            }
        }

        if(state == 0) {
            ct.happinessStage += 2;
            return;
        } else if (state == -1) {
            ct.happinessStage -= 2;
            ct.maxHappiness = 3;
            return;
        } else {
            ct.happinessStage += 0.5;
            return;
        }
    }
}