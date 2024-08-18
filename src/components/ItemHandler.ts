import { Item } from "./Item";
import { GameScene } from "@/scenes/GameScene";
import { Station } from "./Station";
import { Customer } from "./Customer";
import { StationType } from "./StationData";
import { TextEffect } from "./TextEffect";

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
                ct.rockBonus = 1;
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
                st.refresh = true;
                st.taskHaste*=2;
                break;
            } case 9: {
                ct.lockPatience = true;
                break;
            } case 10: {
                let tstate = 0
                if((i.antitags.length > 0) && ct.antitags.length > 0){
                    for(let na = 0; na < i.antitags.length; na++){
                        if(ct.antitags.includes(i.tags[na])) {
                            tstate = -1;
                        }
                    }
                }

                if(tstate == -1) {
                    ct.happinessBonus -= 2;
                    ct.maxHappiness = 4.01;
                    ct.tipMultiplier *= 0.1;
                    st.queueFail = true;
                    return;
                } else {
                    ct.tipMultiplier++;
                    return;
                }
            } case 11: {
                let r = Math.random()*3;
                //console.log(ct.itinerary);
                if(r < 1) {
                    ct.itinerary.push(StationType.HornAndNails);
                    this.scene.addEffect(new TextEffect(this.scene, ct.x-60+(Math.random()*120), ct.y-30+(Math.random()*120), "+⬤", "red", 60, false, "red", 1200, 100, 0.7, 0));
                } else if (r < 2) {
                    ct.itinerary.push(StationType.ScalePolish);
                    this.scene.addEffect(new TextEffect(this.scene, ct.x-60+(Math.random()*120), ct.y-30+(Math.random()*120), "+⬤", "yellow", 60, false, "red", 1200, 100, 0.7, 0));
                } else if (r < 3) { 
                    ct.itinerary.push(StationType.GoldBath);
                    this.scene.addEffect(new TextEffect(this.scene, ct.x-60+(Math.random()*120), ct.y-40, "+⬤", "blue", 60, false, "red", 1200, 100, 0.7, 0));
                }
                //console.log(ct.itinerary);
                break;
            } case 12: {
                st.crit += 0.25;
                break;
            }
            break;
        }
    }

    parsePreferredItem(i: Item, st:Station, ct:Customer){
        let state = 0;
        if((i.tags.length > 0) && (ct.tags.length > 0)) {
            for(let nt = 0; nt < i.tags.length; nt++){
                if(ct.tags.includes(i.tags[nt])) {
                    state = 1;
                }
            }
        }

        if((i.antitags.length > 0) && ct.antitags.length > 0){
            for(let na = 0; na < i.antitags.length; na++){
                if(ct.antitags.includes(i.tags[na])) {
                    state = -1;
                }
            }
        }

        if(state == 1) {
            ct.happinessBonus += 2;
            ct.tipBonus+=0.25;
            return;
        } else if (state == -1) {
            ct.happinessBonus -= 2.125;
            ct.maxHappiness = 4.01;
            ct.tipMultiplier*=0.25;
            st.queueFail = true;
            return;
        } else {
            ct.happinessBonus += 0.5;
            return;
        }
    }
}