class Field {
    constructor (id, width, height, hashDistance, bgColor, controlId, bgColorControlId, mouseXId, mouseYId, fieldTypeControlId) {
        this.id = id;
        this.controlId = controlId;
        this.bgColorControlId = bgColorControlId;

        this.mouseXId = mouseXId;
        this.mouseYId = mouseYId;
        this.fieldTypeControlId = fieldTypeControlId;

        this.width = width;
        this.height = height;
        this.endZone = 10;
        this.hashDistance = hashDistance;
        
        this.bgColor = bgColor;
        this.lnColor = "white";
        this.mouseX = 0;
        this.mouseY = 0;

        this.firstSetup();

        this.draw();
    }

    firstSetup() {
        this.canvas = document.getElementById(this.id);
        this.ctx = this.canvas.getContext("2d");

        this.fieldControls = document.getElementById(this.controlId);
        this.bgColorControl = document.getElementById(this.bgColorControlId);
        this.mouseXDis = document.getElementById(this.mouseXId);
        this.mouseYDis = document.getElementById(this.mouseYId);
        this.fieldTypeControl = document.getElementById(this.fieldTypeControlId);

        this.fieldTypes = {
            "NCAA": 20,
            "High School": 160 / 9,
            "NFL": 283 / 12
        };
        this.hashDistance = this.fieldTypes[this.fieldTypeControl.value];
        this.stepSize = .625;

        this.bgColorControl.onchange = () => {
            this.bgColor = this.bgColorControl.value;
            this.lnColor = this.bgColor == "#ffffff" ? "black" : "white";
        };
        this.fieldTypeControl.onchange = () => {
            this.hashDistance = this.fieldTypes[this.fieldTypeControl.value];
        };
        this.canvas.addEventListener('mousemove', (event) => {
            var rect = this.canvas.getBoundingClientRect();
            this.mouseX = parseInt((event.clientX - rect.left) / this.getScale()) - this.endZone;
            this.mouseY = parseInt((event.clientY - rect.top) / this.getScale());
        });

        this.resize();
        this.setup();
    }

    setup() {
        this.canvas.style.backgroundColor = this.bgColor;
        this.ctx.lineWidth = this.width / 200 * this.getScale();
        this.ctx.strokeStyle = this.lnColor;
        this.ctx.fillStyle = this.lnColor;
        this.ctx.font = "bold " + this.width / 30 * this.getScale() + "px Clanderone";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }

    getScale() {
        return this.canvas.parentElement.clientWidth / (this.width + this.endZone * 2) * .9;
    }

    resize() {
        this.canvas.width = (this.width + this.endZone * 2) * this.getScale();
        this.canvas.height = this.height * this.getScale();
    }

    toCanvasX(x) {
        return (x + this.endZone) * this.getScale();
    }

    draw() {
        this.setup();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.bgColor == "#ffffff" ? "#e6e6e6" : "#007a00";
        this.ctx.fillRect(0, 0, this.endZone * this.getScale(), this.canvas.height);
        this.ctx.fillRect(this.toCanvasX(this.width), 0, this.endZone * this.getScale(), this.canvas.height);
        this.ctx.fillStyle = this.lnColor;

        //draw yardlines and numbers
        for (let x = 0; x <= 100; x += 10) {
            //lines
            this.ctx.beginPath();
            this.ctx.moveTo(this.toCanvasX(x), 0);
            this.ctx.lineTo(this.toCanvasX(x), this.height * this.getScale());
            this.ctx.stroke();

            //numbers
            if (x > 0 && x < 100 && x <= 50) {
                this.ctx.fillText(x, this.toCanvasX(x), this.height / 4 * this.getScale());
                this.ctx.fillText(x, this.toCanvasX(x), this.height * 3 / 4 * this.getScale());
            }
            else if (x > 0 && x < 100)
            {
                this.ctx.fillText(100 - x, this.toCanvasX(x), this.height / 4 * this.getScale());
                this.ctx.fillText(100 - x, this.toCanvasX(x), this.height * 3 / 4 * this.getScale());
            }
            
            //Hashes
            this.ctx.setLineDash([10]);
            this.ctx.beginPath();
            //Top
            this.ctx.moveTo(this.toCanvasX(0), this.hashDistance * this.getScale());
            this.ctx.lineTo(this.toCanvasX(this.width), this.hashDistance * this.getScale());

            //Bottom
            this.ctx.moveTo(this.toCanvasX(0), (this.height - this.hashDistance) * this.getScale());
            this.ctx.lineTo(this.toCanvasX(this.width), (this.height - this.hashDistance) * this.getScale());

            this.ctx.stroke();
            this.ctx.setLineDash([])
        }
    }

    update() {
        this.mouseXDis.innerText = this.getChartLocation(this.mouseX, this.mouseY);
        this.mouseYDis.innerText = `${this.mouseX}, ${this.mouseY}`;
    }

    setStepSize(stepSize) {
        this.stepSize = stepSize;
    }

    getPlayerOutlineColor() {
        return this.bgColor == "#ffffff" ? "black" : "white";
    }

    getChartLocation(x, y) {
        x = Math.max(0, Math.min(this.width, x));
        let side = x <= this.width / 2 ? "Side 1" : "Side 2";
        let sideX = x <= this.width / 2 ? x : this.width - x;
        let yardLine = Math.round(sideX / 5) * 5;
        let steps = Math.abs(sideX - yardLine) / this.stepSize;
        let horizontal;

        if (steps < .05) {
            horizontal = `on ${yardLine} yard line`;
        }
        else {
            horizontal = `${this.formatSteps(steps)} steps ${sideX > yardLine ? "inside" : "outside"} ${yardLine} yard line`;
        }

        let references = [
            { position: 0, name: "back sideline" },
            { position: this.hashDistance, name: "back hash" },
            { position: this.height - this.hashDistance, name: "front hash" },
            { position: this.height, name: "front sideline" }
        ];
        let reference = references[0];
        references.forEach(element => {
            if (Math.abs(y - element.position) < Math.abs(y - reference.position)) {
                reference = element;
            }
        });
        steps = Math.abs(y - reference.position) / this.stepSize;
        let vertical;

        if (steps < .05) {
            vertical = `on ${reference.name}`;
        }
        else if (reference.name == "front sideline" || reference.name == "front hash") {
            vertical = `${this.formatSteps(steps)} steps ${y < reference.position ? "behind" : "in front of"} ${reference.name}`;
        }
        else if (reference.name == "back sideline") {
            vertical = `${this.formatSteps(steps)} steps in front of ${reference.name}`;
        }
        else {
            vertical = `${this.formatSteps(steps)} steps ${y < reference.position ? "in front of" : "behind"} ${reference.name}`;
        }

        return `${side}, ${horizontal}, ${vertical}`;
    }

    formatSteps(steps) {
        steps = Math.round(steps * 10) / 10;
        return Number.isInteger(steps) ? steps : steps.toFixed(1);
    }
}

export { Field };
