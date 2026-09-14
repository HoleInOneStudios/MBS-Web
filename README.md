# Marching Band Simulation Web Edition

[![Deploy static content to Pages](https://github.com/HoleInOneGolfer/MBS-Web/actions/workflows/static.yml/badge.svg)](https://github.com/HoleInOneGolfer/MBS-Web/actions/workflows/static.yml)
[![GitHub repository](https://img.shields.io/badge/GitHub-MBS--Web-181717?logo=github)](https://github.com/HoleInOneGolfer/MBS-Web)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A browser-based marching-band drill viewer and test environment. It displays a
football field on a canvas, animates players through sets, and supports JSON
import/export for shows.

The included test show has 70 members across trumpet, mellophone, baritone,
clarinet, flute, and percussion sections.

## Run locally

This project is a static HTML, CSS, and JavaScript site. From the repository
root, serve the `src` directory with Python:

```powershell
py -3 -m http.server 80 --directory src
```

Then open `http://localhost/`.

## Progressive Web App

MBS Web can be installed as a Progressive Web App from a supported browser.
After the first visit, its app shell and local assets are cached so the app can
open offline. When online, the app checks the server for each local file and
refreshes its cached copy automatically; when offline, it uses the latest
cached version. GitHub Pages provides the HTTPS required for installation;
`localhost` also supports PWA testing during development.

## Controls

- **Show** — set the show title and tempo. These values are included when
  exporting.
- **Set** — set the current set's **Counts** and **Step Size**. These values
  are stored in its `Moves` entry and describe the move into it.
- **Field** — choose NCAA, High School, or NFL hash marks and select a green
or white background. Lines automatically use a contrasting color, and field
  markings scale with the field. The visual field includes ten-yard end zones
  on both sides, shaded slightly differently from the main field; player
  coordinates remain on the 0–100-yard playing field.
- **Simulation** — set a playback-speed multiplier and path visibility. The
  icon transport strip
  below the field plays/pauses, steps through counts, jumps between sets, and
  moves to the beginning/end of the show.
- **Players** — select, add, remove, rename, recolor, or assign a section-style
  ID such as `T1`, `B1`, or `C1`. Enable **Isolate Selected** to show only the
  player selected in the Player dropdown and their path. Players render as
  colored circles with an automatic contrasting outline for visibility on both
  field backgrounds.
- **Info** — shows set/count/playback information plus the mouse position in
  chart-style and raw canvas coordinates. Set information is displayed in
  previous, current, then next order.

## Coordinates

Side 1 is the left half of the displayed field and Side 2 is the right half.
The view is from the press box: the bottom of the field is the front sideline
and the top is the back sideline. The chart location reports the closest yard
line and field reference, using the step size assigned to the active move.

## Show format

Exports contain a title, players, and moves:

```json
{
  "Title": "Example Show",
  "Tempo": 120,
  "Players": [
    {
      "id": "T1",
      "name": "Trumpet 1",
      "color": "#e63946",
      "sets": [{ "x": 35, "y": 16 }, { "x": 45, "y": 16 }]
    }
  ],
  "Moves": [
    { "count": 16, "stepSize": 0.625 }
  ]
}
```

Each move belongs to the set it arrives at: its count and step size describe
the transition from the previous set to that set. Step-size values
are expressed in yards per step: 8-to-5 is `0.625`, 6-to-5 is approximately
`0.8333`, 12-to-5 is approximately `0.4167`, and 16-to-5 is `0.3125`.

Older exports using `List`, `Count`, and `Interval` can still be imported.
