import { lerp, lerp2 } from "./Math.js";

class FieldObject {
    constructor (sets) {
        this.sets = sets || [{ x: 10, y: 10 }, { x: 50, y: 30 }, { x: 65, y: 10 }];
        this.pos = { x: 0, y: 0 };
    }

    async show(field) {
        field.ctx.fillStyle = "red";
        field.ctx.fillRect(this.pos.x * field.getScale(), this.pos.y * field.getScale(), 1 * field.getScale(), 1 * field.getScale());
    }

    async update(objects) {
        if (objects.nextSet < this.sets.length && objects.currentSet < this.sets.length) {
            this.pos = lerp2(this.sets[objects.currentSet], this.sets[objects.nextSet], objects.currentCount / objects.Count);
        }
    }

    async showPath(field) {
        let currentSet = 0;
        let nextSet = (currentSet + 1) % this.sets.length - 1 || currentSet;
        let previousSet = (currentSet - 1) % this.sets.length - 1 || currentSet;
        field.ctx.beginPath();
        field.ctx.moveTo(this.sets[this.sets.length - 1].x * field.getScale(), this.sets[this.sets.length - 1].y * field.getScale());
        this.sets.forEach(element => {
            field.ctx.lineTo(element.x * field.getScale(), element.y * field.getScale());
        });
        field.ctx.stroke();
        
    }
}

class Objects {
    constructor (minCountControl, maxCountControl, minInterval, maxInterval, nextSetDis, currentSetDis, previousSetDis, countDis, intervalDis, intervalControl, countControl, moveCon, pathCon) {
        this.List = [];
        this.selected = this.List[0];

        //Sets
        this.maxSet = 0;
        this.nextSetDis = document.getElementById(nextSetDis);
        this.currentSetDis = document.getElementById(currentSetDis);
        this.previousSetDis = document.getElementById(previousSetDis);
        this.countDis = document.getElementById(countDis);
        this.currentSet = 0;
        this.nextSet = (this.currentSet + 1) % this.maxSet || this.currentSet;
        this.previousSet = (this.currentSet - 1) % this.maxSet || this.currentSet;

        //Interval
        this.minInterval = minInterval;
        this.maxInterval = maxInterval;
        this.intervalControl = document.getElementById(intervalControl);
        this.intervalControl.min = minInterval;
        this.intervalControl.max = maxInterval;

        //Count
        this.minCountControl = minCountControl;
        this.maxCountControl = maxCountControl;
        this.countControl = document.getElementById(countControl);
        this.countControl.min = minCountControl;    
        this.countControl.max = maxCountControl;
        this.countControl.value = maxCountControl;
        this.currentCount = 0;
        this.Count = this.countControl.value

        //Time
        this.time = 0;
        this.interval = lerp(this.minInterval, this.maxInterval, .5) || 10;
        this.intervalControl.value = this.interval;
        this.intervalDis = document.getElementById(intervalDis);

        //Control
        this.moveCon = document.getElementById(moveCon);
        this.pathCon = document.getElementById(pathCon);
        this.move = this.moveCon.checked;
        this.path = this.moveCon.checked;

        //Object Select
    }

    add(obj) {
        return this.List.push(obj);
    }

    remove(obj) {
        return this.List.splice(this.List.indexOf(obj), 1);
    }

    async show(field) {
        this.List.forEach(element => {
            element.show(field);
            if (this.path) {
                element.showPath(field);
            }
        });
    }

    async update() {
        //Update from UI
        this.interval = this.intervalControl.value;
        this.Count = this.countControl.value
        this.move = this.moveCon.checked;
        this.path = this.pathCon.checked;

        //Update Loop
        if (this.move) {
            this.time++;
            if (this.time >= this.interval) {
                this.currentCount++;
                //console.log(this.count / this.maxCount);
                this.time = 0;
                //console.log("frame");
                if (this.currentCount >= this.Count) {
                    this.currentSet++;
                    this.nextSet = (this.currentSet + 1) % this.maxSet;
                    this.previousSet = (this.currentSet - 1) % this.maxSet;
                    this.currentCount = 0;
                    //console.log("count");
                    if (this.currentSet >= this.maxSet) {
                        this.currentSet = 0;
                        //console.log("set");
                    }
                }
            }
        }
        
        this.List.forEach(element => {
            if (element.sets.length - 1 > this.maxSet) {
                this.maxSet = element.sets.length;
            }
            element.update(this);
        });

        //Update UI
        this.nextSetDis.innerText = this.nextSet;
        this.currentSetDis.innerText = this.currentSet;
        this.previousSetDis.innerText = this.previousSet;
        this.countDis.innerText = `${this.currentCount}/${this.Count}`;
        this.intervalDis.innerText = `${this.time}/${this.interval}`;
    }
}

export { FieldObject, Objects };