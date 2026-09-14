import { Field } from "./field.js";
import { Player } from "./player.js";
import { Show } from "./show.js";
import { ImportExport } from "./importExport.js";

let field;
let show;
let imex;

document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js');
    }

    field = new Field("canvas", 300 / 3, 160 / 3, 60 / 3, "#009900", "fieldControls", "bgColor", "mouseX", "mouseY", "fieldType");
    show = new Show("showTitle", "showTitleInput", "prevSet", "currentSet", "nextSet", "count", "tempo", "speed", "tempoControl", "speedControl", "moveCountControl", "moveStepSizeControl", "move", "path", "playerSelect", "playerId", "playerName", "playerColor", "addPlayer", "removePlayer", "isolatePlayer", "beginning", "previousSetButton", "previousStep", "playPause", "nextStep", "nextSetButton", "end");

    let testPlayers = [];
    let sections = [
        { id: "T", name: "Trumpet", color: "#e63946", count: 16 },
        { id: "M", name: "Mellophone", color: "#e9c46a", count: 8 },
        { id: "B", name: "Baritone", color: "#2a9d8f", count: 10 },
        { id: "C", name: "Clarinet", color: "#457b9d", count: 16 },
        { id: "F", name: "Flute", color: "#7b5ea7", count: 12 },
        { id: "P", name: "Percussion", color: "#b565a7", count: 8 }
    ];
    let playerIndex = 0;

    sections.forEach(section => {
        for (let number = 1; number <= section.count; number++) {
            let column = playerIndex % 10;
            let row = Math.floor(playerIndex / 10);
            let x = 27 + column * 5;
            let y = 12 + row * 5;
            let sets = [
                { x: x, y: y },
                { x: 20 + column * 6.7, y: 8 + row * 6.2 },
                { x: 24 + column * 5.8 + row * 1.5, y: 10 + row * 5.2 },
                { x: 50 + (y - 27) * .75, y: 27 + (x - 50) * .55 },
                { x: 20 + column * 6.7, y: 45 - row * 6.2 },
                { x: x, y: y }
            ];
            testPlayers.push(new Player(`${section.id}${number}`, `${section.name} ${number}`, section.color, sets));
            playerIndex++;
        }
    });
    show.load(testPlayers, [
        { count: 16, stepSize: .625 },
        { count: 16, stepSize: .625 },
        { count: 12, stepSize: .8333333333 },
        { count: 24, stepSize: .625 },
        { count: 8, stepSize: .4166666667 },
        { count: 16, stepSize: .625 }
    ], "70 Member Test Show");

    imex = new ImportExport(show, "import", "export", "importFile", "exportText", "download");

    addEventListener('resize', () => {
        field.resize();
    });

    setInterval(() => {
        field.draw();
        show.update();
        field.setStepSize(show.getTransitionMove().stepSize);
        field.update();
        show.show(field);
    }, 1000 / 60);
});
