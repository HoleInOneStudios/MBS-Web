class Show {
    constructor (showTitleDis, showTitleControl, previousSetDis, currentSetDis, nextSetDis, countDis, tempoDis, speedDis, tempoControl, speedControl, moveCountControl, moveStepSizeControl, moveCon, pathCon, playerSelect, playerId, playerName, playerColor, playerAdd, playerRemove, beginning, previousSet, previousStep, playPause, nextStep, nextSet, end) {
        this.Players = [];
        this.Moves = [];
        this.selected = undefined;
        this.title = "Test Show";

        this.showTitleDis = document.getElementById(showTitleDis);
        this.showTitleControl = document.getElementById(showTitleControl);
        this.previousSetDis = document.getElementById(previousSetDis);
        this.currentSetDis = document.getElementById(currentSetDis);
        this.nextSetDis = document.getElementById(nextSetDis);
        this.countDis = document.getElementById(countDis);
        this.tempoDis = document.getElementById(tempoDis);
        this.speedDis = document.getElementById(speedDis);
        this.currentSet = 0;
        this.nextSet = 0;
        this.previousSet = 0;
        this.currentCount = 0;
        this.time = 0;
        this.maxSet = 0;

        this.tempoControl = document.getElementById(tempoControl);
        this.speedControl = document.getElementById(speedControl);
        this.moveCountControl = document.getElementById(moveCountControl);
        this.moveStepSizeControl = document.getElementById(moveStepSizeControl);
        this.moveCon = document.getElementById(moveCon);
        this.pathCon = document.getElementById(pathCon);
        this.playerSelect = document.getElementById(playerSelect);
        this.playerId = document.getElementById(playerId);
        this.playerName = document.getElementById(playerName);
        this.playerColor = document.getElementById(playerColor);
        this.playerAdd = document.getElementById(playerAdd);
        this.playerRemove = document.getElementById(playerRemove);
        this.beginning = document.getElementById(beginning);
        this.previousSetButton = document.getElementById(previousSet);
        this.previousStepButton = document.getElementById(previousStep);
        this.playPause = document.getElementById(playPause);
        this.nextStepButton = document.getElementById(nextStep);
        this.nextSetButton = document.getElementById(nextSet);
        this.end = document.getElementById(end);
        this.move = this.moveCon.checked;
        this.path = this.pathCon.checked;

        this.showTitleControl.onchange = () => {
            this.title = this.showTitleControl.value || "Untitled Show";
            this.showTitleDis.innerText = this.title;
        };

        this.moveCountControl.onchange = () => {
            this.getMove().count = Math.max(1, parseInt(this.moveCountControl.value) || 1);
        };
        this.moveStepSizeControl.onchange = () => {
            this.getMove().stepSize = this.moveStepSizeControl.value;
        };
        this.playerSelect.onchange = () => {
            this.selected = this.Players.find(element => element.id == this.playerSelect.value);
            this.updatePlayerControls();
        };
        this.playerId.onchange = () => {
            if (this.selected && this.playerId.value) {
                this.selected.id = this.playerId.value;
                this.updateDropdown();
            }
        };
        this.playerName.onchange = () => {
            if (this.selected) {
                this.selected.name = this.playerName.value || this.selected.id;
                this.updateDropdown();
            }
        };
        this.playerColor.onchange = () => {
            if (this.selected) {
                this.selected.color = this.playerColor.value;
            }
        };
        this.playerAdd.onclick = () => {
            this.add(new Player(`P${this.Players.length + 1}`, `Player ${this.Players.length + 1}`));
        };
        this.playerRemove.onclick = () => {
            this.remove(this.selected);
        };
        this.beginning.onclick = () => this.goToSet(0);
        this.previousSetButton.onclick = () => this.goToSet(this.currentSet - 1);
        this.previousStepButton.onclick = () => this.previousStep();
        this.playPause.onclick = () => {
            this.moveCon.checked = !this.moveCon.checked;
            this.updatePlayPause();
        };
        this.nextStepButton.onclick = () => this.nextStep();
        this.nextSetButton.onclick = () => this.goToSet(this.currentSet + 1);
        this.end.onclick = () => this.goToSet(this.maxSet - 1);
    }

    add(player) {
        this.Players.push(player);
        this.updateSets();
        this.selected = player;
        this.updateDropdown();
        this.updatePlayerControls();
    }

    remove(player) {
        let index = this.Players.indexOf(player);
        if (index >= 0) {
            this.Players.splice(index, 1);
        }
        this.selected = this.Players[0];
        this.updateSets();
        this.updateDropdown();
        this.updatePlayerControls();
    }

    updateDropdown() {
        this.playerSelect.innerHTML = "";
        this.Players.forEach(element => {
            let option = document.createElement("option");
            option.value = element.id;
            option.innerText = `${element.id} - ${element.name}`;
            this.playerSelect.appendChild(option);
        });
        if (this.selected) {
            this.playerSelect.value = this.selected.id;
        }
    }

    updatePlayerControls() {
        if (this.selected) {
            this.playerId.value = this.selected.id;
            this.playerName.value = this.selected.name;
            this.playerColor.value = this.selected.color;
        }
        else {
            this.playerId.value = "";
            this.playerName.value = "";
        }
    }

    updateSets() {
        this.maxSet = 0;
        this.Players.forEach(element => {
            if (element.sets.length > this.maxSet) {
                this.maxSet = element.sets.length;
            }
        });
        while (this.Moves.length < this.maxSet) {
            this.Moves.push({ count: 16, stepSize: .625 });
        }
        this.Moves.length = this.maxSet;
        if (this.maxSet > 0) {
            this.currentSet %= this.maxSet;
            this.nextSet = (this.currentSet + 1) % this.maxSet;
            this.previousSet = (this.currentSet - 1 + this.maxSet) % this.maxSet;
        }
    }

    getMove() {
        return this.Moves[this.currentSet] || { count: 1, stepSize: .625 };
    }

    getTransitionMove() {
        return this.Moves[this.nextSet] || { count: 1, stepSize: .625 };
    }

    updateMoveControls() {
        let move = this.getMove();
        this.moveCountControl.value = move.count;
        this.moveStepSizeControl.value = move.stepSize;
    }

    updatePlayPause() {
        this.playPause.innerText = this.moveCon.checked ? "❚❚" : "▶";
        this.playPause.setAttribute("aria-label", this.moveCon.checked ? "Pause" : "Play");
        this.playPause.title = this.moveCon.checked ? "Pause" : "Play";
    }

    goToSet(set) {
        if (this.maxSet > 0) {
            this.currentSet = (set + this.maxSet) % this.maxSet;
            this.nextSet = (this.currentSet + 1) % this.maxSet;
            this.previousSet = (this.currentSet - 1 + this.maxSet) % this.maxSet;
            this.currentCount = 0;
            this.time = 0;
            this.updateMoveControls();
        }
    }

    nextStep() {
        if (this.maxSet > 0) {
            this.currentCount++;
            if (this.currentCount >= this.getTransitionMove().count) {
                this.goToSet(this.currentSet + 1);
            }
        }
    }

    previousStep() {
        if (this.maxSet > 0) {
            if (this.currentCount > 0) {
                this.currentCount--;
            }
            else {
                let previousSet = (this.currentSet - 1 + this.maxSet) % this.maxSet;
                this.currentSet = previousSet;
                this.nextSet = (previousSet + 1) % this.maxSet;
                this.previousSet = (previousSet - 1 + this.maxSet) % this.maxSet;
                this.currentCount = this.getTransitionMove().count - 1;
                this.updateMoveControls();
            }
        }
    }

    update() {
        this.updateSets();
        this.move = this.moveCon.checked;
        this.path = this.pathCon.checked;

        if (this.move && this.maxSet > 0) {
            this.time++;
            if (this.time >= 3600 / (this.tempoControl.value * this.speedControl.value)) {
                this.currentCount++;
                this.time = 0;
                if (this.currentCount >= this.getTransitionMove().count) {
                    this.currentSet = (this.currentSet + 1) % this.maxSet;
                    this.nextSet = (this.currentSet + 1) % this.maxSet;
                    this.previousSet = (this.currentSet - 1 + this.maxSet) % this.maxSet;
                    this.currentCount = 0;
                    this.updateMoveControls();
                }
            }
        }

        this.Players.forEach(element => {
            element.update(this);
        });

        this.nextSetDis.innerText = this.nextSet;
        this.currentSetDis.innerText = this.currentSet;
        this.previousSetDis.innerText = this.previousSet;
        this.countDis.innerText = `${this.currentCount}/${this.getTransitionMove().count}`;
        this.tempoDis.innerText = `${this.tempoControl.value} BPM`;
        this.speedDis.innerText = `x${this.speedControl.value}`;
    }

    show(field) {
        this.Players.forEach(element => {
            element.show(field);
            if (this.path) {
                element.showPath(field);
            }
        });
    }

    toJson() {
        return { Title: this.title, Players: this.Players.map(element => element.toJson()), Moves: this.Moves };
    }

    load(players, moves, title) {
        this.Players = players;
        this.Moves = moves || [];
        this.title = title || "Untitled Show";
        this.showTitleDis.innerText = this.title;
        this.showTitleControl.value = this.title;
        this.currentSet = 0;
        this.currentCount = 0;
        this.updateSets();
        this.selected = this.Players[0];
        this.updateDropdown();
        this.updatePlayerControls();
        this.updateMoveControls();
        this.updatePlayPause();
    }
}

import { Player } from "./player.js";

export { Show };
