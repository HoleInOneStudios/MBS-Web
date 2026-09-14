import { Player } from "./player.js";

class ImportExport {
    constructor (show, imButton, exButton, imFile, exText, dnButton) {
        this.show = show;
        this.imButton = document.getElementById(imButton);
        this.exButton = document.getElementById(exButton);
        this.imFile = document.getElementById(imFile);
        this.exText = document.getElementById(exText);
        this.dnButton = document.getElementById(dnButton);

        this.exButton.onclick = () => {
            this.export();
        };
        this.imButton.onclick = () => {
            this.import(this.exText.value);
        };
        this.dnButton.onclick = () => {
            this.download();
        };
        this.imFile.onchange = (e) => {
            this.upload(e);
        };
    }

    export() {
        this.exText.value = JSON.stringify(this.show.toJson());
    }

    import(J) {
        let data = JSON.parse(J);
        let players;
        let moves;

        if (data.Players) {
            players = data.Players.map(element => new Player(element.id, element.name, element.color, element.sets));
            moves = data.Moves;
        }
        else {
            players = data.List.map((element, index) => new Player(element.name || `P${index + 1}`, element.name || `Player ${index + 1}`, "#ff0000", element.sets));
            moves = [];
            let maxSet = Math.max(...players.map(element => element.sets.length));
            for (let i = 0; i < maxSet; i++) {
                moves.push({ count: data.Count || 16, stepSize: .625 });
            }
        }

        this.show.load(players, moves, data.Title, data.Tempo);
    }

    download() {
        this.export();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.exText.value));
        element.setAttribute('download', 'data.json');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    upload(e) {
        var reader = new FileReader();
        reader.onload = (e) => {
            this.import(e.target.result);
        };
        reader.readAsText(e.target.files[0]);
    }
}

export { ImportExport };
