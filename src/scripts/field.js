class Field {
    constructor (id, width, height, hashDistance, lnWidth, lnColor, bgColor, controlId, bgColorControlId, lnControlControlId, lnWidthControlId, mouseXId, mouseYId, fieldTypeControlId) {
        this.id = id;
        this.controlId = controlId;
        this.bgColorControlId = bgColorControlId;
        this.lnColorControlId = lnControlControlId;
        this.lnWidthControlId = lnWidthControlId;

        this.mouseXId = mouseXId;
        this.mouseYId = mouseYId;
        this.fieldTypeControlId = fieldTypeControlId;

        this.width = width;
        this.height = height;
        this.hashDistance = hashDistance;
        
        this.lnWidth = lnWidth;
        this.lnColor = lnColor;
        this.bgColor = bgColor;
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
        this.lnColorControl = document.getElementById(this.lnColorControlId);
        this.lnWidthControl = document.getElementById(this.lnWidthControlId);
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
        };
        this.lnColorControl.onchange = () => {
            this.lnColor = this.lnColorControl.value;
        };
        this.lnWidthControl.onchange = () => {
            this.lnWidth = this.lnWidthControl.value;
        };
        this.fieldTypeControl.onchange = () => {
            this.hashDistance = this.fieldTypes[this.fieldTypeControl.value];
        };
        this.canvas.addEventListener('mousemove', (event) => {
            var rect = this.canvas.getBoundingClientRect();
            this.mouseX = parseInt((event.clientX - rect.left) / this.getScale());
            this.mouseY = parseInt((event.clientY - rect.top) / this.getScale());
        });

        this.resize();
        this.setup();
    }

    setup() {
        this.canvas.style.backgroundColor = this.bgColor;
        this.ctx.lineWidth = this.lnWidth / this.getScale();
        this.ctx.strokeStyle = this.lnColor;
        this.ctx.fillStyle = this.lnColor;
        this.ctx.font = "bold " + this.lnWidth / 2 * this.getScale() + "px Clanderone";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
    }

    getScale() {
        return this.canvas.parentElement.clientWidth / this.width * .9;
    }

    resize() {
        this.canvas.width = this.width * this.getScale();
        this.canvas.height = this.height * this.getScale();
    }

    draw() {
        this.setup();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //draw yardlines and numbers
        for (let x = 10; x < 100; x += 10) {
            //lines
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.getScale(), 0);
            this.ctx.lineTo(x * this.getScale(), this.height * this.getScale());
            this.ctx.stroke();

            //numbers
            if (x <= 50) {
                this.ctx.fillText(x, x * this.getScale(), this.height / 4 * this.getScale());
                this.ctx.fillText(x, x * this.getScale(), this.height * 3 / 4 * this.getScale());
            }
            else
            {
                this.ctx.fillText(100 - x, x * this.getScale(), this.height / 4 * this.getScale());
                this.ctx.fillText(100 - x, x * this.getScale(), this.height * 3 / 4 * this.getScale());
            }
            
            //Hashes
            this.ctx.setLineDash([10]);
            this.ctx.beginPath();
            //Top
            this.ctx.moveTo(0, this.hashDistance * this.getScale());
            this.ctx.lineTo(this.width * this.getScale(), this.hashDistance * this.getScale());

            //Bottom
            this.ctx.moveTo(0, (this.height - this.hashDistance) * this.getScale());
            this.ctx.lineTo(this.width * this.getScale(), (this.height - this.hashDistance) * this.getScale());

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

    getChartLocation(x, y) {
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
            { position: 0, name: "front sideline" },
            { position: this.hashDistance, name: "front hash" },
            { position: this.height - this.hashDistance, name: "back hash" },
            { position: this.height, name: "back sideline" }
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
        else if (reference.name == "front sideline") {
            vertical = `${this.formatSteps(steps)} steps behind ${reference.name}`;
        }
        else if (reference.name == "back sideline") {
            vertical = `${this.formatSteps(steps)} steps in front of ${reference.name}`;
        }
        else {
            vertical = `${this.formatSteps(steps)} steps ${y > reference.position ? "behind" : "in front of"} ${reference.name}`;
        }

        return `${side}, ${horizontal}, ${vertical}`;
    }

    formatSteps(steps) {
        steps = Math.round(steps * 10) / 10;
        return Number.isInteger(steps) ? steps : steps.toFixed(1);
    }
}

export { Field };
