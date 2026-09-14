import { Field } from "./field.js";
import { Player } from "./player.js";
import { Show } from "./show.js";
import { ImportExport } from "./importExport.js";

let field;
let show;
let imex;

document.addEventListener('DOMContentLoaded', () => {
    field = new Field("canvas", 300 / 3, 160 / 3, 60 / 3, 10, "white", "green", "fieldControls", "bgColor", "lnColor", "lnWidth", "mouseX", "mouseY", "fieldType");
    show = new Show("showTitle", "showTitleInput", "nextSet", "currentSet", "prevSet", "count", "tempo", "speed", "tempoControl", "speedControl", "moveCountControl", "moveStepSizeControl", "move", "path", "playerSelect", "playerId", "playerName", "playerColor", "addPlayer", "removePlayer");

    let testPlayers = [
        new Player("T1", "Trumpet 1", "#e63946", [{ x: 35, y: 16 }, { x: 25, y: 10 }, { x: 20, y: 12 }, { x: 50, y: 6 }, { x: 25, y: 12 }, { x: 35, y: 16 }]),
        new Player("T2", "Trumpet 2", "#e63946", [{ x: 45, y: 16 }, { x: 42, y: 14 }, { x: 32, y: 18 }, { x: 66, y: 12 }, { x: 35, y: 20 }, { x: 45, y: 16 }]),
        new Player("M1", "Mellophone 1", "#e9c46a", [{ x: 55, y: 16 }, { x: 58, y: 14 }, { x: 44, y: 24 }, { x: 78, y: 26 }, { x: 45, y: 28 }, { x: 55, y: 16 }]),
        new Player("B1", "Baritone 1", "#2a9d8f", [{ x: 65, y: 16 }, { x: 75, y: 10 }, { x: 56, y: 30 }, { x: 66, y: 42 }, { x: 55, y: 36 }, { x: 65, y: 16 }]),
        new Player("C1", "Clarinet 1", "#457b9d", [{ x: 35, y: 36 }, { x: 25, y: 43 }, { x: 44, y: 30 }, { x: 50, y: 48 }, { x: 45, y: 36 }, { x: 35, y: 36 }]),
        new Player("C2", "Clarinet 2", "#457b9d", [{ x: 45, y: 36 }, { x: 42, y: 39 }, { x: 56, y: 24 }, { x: 34, y: 42 }, { x: 55, y: 28 }, { x: 45, y: 36 }]),
        new Player("F1", "Flute 1", "#7b5ea7", [{ x: 55, y: 36 }, { x: 58, y: 39 }, { x: 68, y: 18 }, { x: 22, y: 26 }, { x: 65, y: 20 }, { x: 55, y: 36 }]),
        new Player("F2", "Flute 2", "#7b5ea7", [{ x: 65, y: 36 }, { x: 75, y: 43 }, { x: 80, y: 12 }, { x: 34, y: 12 }, { x: 75, y: 12 }, { x: 65, y: 36 }])
    ];
    show.load(testPlayers, [
        { count: 16, stepSize: .625 },
        { count: 12, stepSize: .8333333333 },
        { count: 24, stepSize: .625 },
        { count: 8, stepSize: .4166666667 },
        { count: 16, stepSize: .625 },
        { count: 16, stepSize: .625 }
    ], "Color Test Show");

    imex = new ImportExport(show, "import", "export", "importFile", "exportText", "download");

    addEventListener('resize', () => {
        field.resize();
    });

    setInterval(() => {
        field.draw();
        show.update();
        field.setStepSize(show.getMove().stepSize);
        field.update();
        show.show(field);
    }, 1000 / 60);
});
