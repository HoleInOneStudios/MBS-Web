import { lerp2 } from "./Math.js";

class Player {
    constructor (id, name, color, sets) {
        this.id = id || "P1";
        this.name = name || this.id;
        this.color = color || "#ff0000";
        this.sets = sets || [{ x: 10, y: 10 }, { x: 50, y: 30 }];
        this.pos = this.sets[0];
    }

    show(field) {
        field.ctx.fillStyle = this.color;
        field.ctx.fillRect(this.pos.x * field.getScale(), this.pos.y * field.getScale(), 1 * field.getScale(), 1 * field.getScale());
    }

    update(show) {
        if (show.nextSet < this.sets.length && show.currentSet < this.sets.length) {
            this.pos = lerp2(this.sets[show.currentSet], this.sets[show.nextSet], show.currentCount / show.getTransitionMove().count);
        }
    }

    showPath(field) {
        field.ctx.strokeStyle = this.color;
        field.ctx.beginPath();
        field.ctx.moveTo(this.sets[this.sets.length - 1].x * field.getScale(), this.sets[this.sets.length - 1].y * field.getScale());
        this.sets.forEach(element => {
            field.ctx.lineTo(element.x * field.getScale(), element.y * field.getScale());
        });
        field.ctx.stroke();
    }

    toJson() {
        return { id: this.id, name: this.name, color: this.color, sets: this.sets };
    }
}

export { Player };
