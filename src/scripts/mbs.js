import { Field } from "./field.js";
import { FieldObject, Objects } from "./fieldObject.js";
import { ImportExport } from "./importExport.js";

let field;
let fieldObj;
let imex;
let objs;

document.body.onload = async () => {
    field = new Field("canvas", 300 / 3, 160 / 3, 60 / 3, 10, "white", "green", "fieldControls", "bgColor", "lnColor", "lnWidth", "mouseX", "mouseY", "fieldType", "stepSize");

    objs = new Objects(4, 20, 0, 20, "nextSet", "currentSet", "prevSet", "count", "interval", "intervalControl", "countControl", "move", "path", "objSelect", "addObj", "removeObj");
    objs.countControl.value = 16;

    let testShow = [
        { name: "A", sets: [{ x: 35, y: 16 }, { x: 25, y: 10 }, { x: 20, y: 12 }, { x: 50, y: 6 }, { x: 25, y: 12 }, { x: 35, y: 16 }] },
        { name: "B", sets: [{ x: 45, y: 16 }, { x: 42, y: 14 }, { x: 32, y: 18 }, { x: 66, y: 12 }, { x: 35, y: 20 }, { x: 45, y: 16 }] },
        { name: "C", sets: [{ x: 55, y: 16 }, { x: 58, y: 14 }, { x: 44, y: 24 }, { x: 78, y: 26 }, { x: 45, y: 28 }, { x: 55, y: 16 }] },
        { name: "D", sets: [{ x: 65, y: 16 }, { x: 75, y: 10 }, { x: 56, y: 30 }, { x: 66, y: 42 }, { x: 55, y: 36 }, { x: 65, y: 16 }] },
        { name: "E", sets: [{ x: 35, y: 36 }, { x: 25, y: 43 }, { x: 44, y: 30 }, { x: 50, y: 48 }, { x: 45, y: 36 }, { x: 35, y: 36 }] },
        { name: "F", sets: [{ x: 45, y: 36 }, { x: 42, y: 39 }, { x: 56, y: 24 }, { x: 34, y: 42 }, { x: 55, y: 28 }, { x: 45, y: 36 }] },
        { name: "G", sets: [{ x: 55, y: 36 }, { x: 58, y: 39 }, { x: 68, y: 18 }, { x: 22, y: 26 }, { x: 65, y: 20 }, { x: 55, y: 36 }] },
        { name: "H", sets: [{ x: 65, y: 36 }, { x: 75, y: 43 }, { x: 80, y: 12 }, { x: 34, y: 12 }, { x: 75, y: 12 }, { x: 65, y: 36 }] }
    ];
    testShow.forEach(element => {
        objs.add(new FieldObject(element.sets, element.name));
    });

    imex = new ImportExport(objs, field, "import", "export", "importFile", "exportText", "download");

    addEventListener('resize', () => {
        field.resize();
    });

    setInterval(() => {
        field.draw();
        field.update();

        objs.update();
        objs.show(field);

    }, 1000 / 60);
}
