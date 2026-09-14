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
        field.ctx.beginPath();
        field.ctx.arc(field.toCanvasX(this.pos.x), this.pos.y * field.getScale(), .5 * field.getScale(), 0, 2 * Math.PI);
        field.ctx.fill();
        field.ctx.lineWidth = .15 * field.getScale();
        field.ctx.strokeStyle = field.getPlayerOutlineColor();
        field.ctx.stroke();
    }

    update(show) {
        if (show.nextSet < this.sets.length && show.currentSet < this.sets.length) {
            this.pos = lerp2(this.sets[show.currentSet], this.sets[show.nextSet], show.currentCount / show.getTransitionMove().count);
        }
    }

    showPath(field) {
        field.ctx.strokeStyle = this.color;
        field.ctx.beginPath();
        field.ctx.moveTo(field.toCanvasX(this.sets[this.sets.length - 1].x), this.sets[this.sets.length - 1].y * field.getScale());
        this.sets.forEach(element => {
            field.ctx.lineTo(field.toCanvasX(element.x), element.y * field.getScale());
        });
        field.ctx.stroke();
    }

    toJson() {
        return { id: this.id, name: this.name, color: this.color, sets: this.sets };
    }
}

export { Player };
