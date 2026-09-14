# Marching Band Simulation Web Edition

A browser-based marching-band drill viewer and test environment. It displays a
football field on a canvas, animates players through sets, and supports JSON
import/export for shows.

## Run locally

This project is a static HTML, CSS, and JavaScript site. From the repository
root, serve the `src` directory with Python:

```powershell
py -3 -m http.server 80 --directory src
```

Then open `http://localhost/`.

## Controls

- **Show** — set the show title. It is included when exporting.
- **Field** — choose NCAA, High School, or NFL hash marks and adjust field
  colors and line size.
- **Simulation** — set tempo in BPM, a playback-speed multiplier, and the
  count and step size assigned to the current set. The icon transport strip
  below the field plays/pauses, steps through counts, jumps between sets, and
  moves to the beginning/end of the show.
- **Players** — select, add, remove, rename, recolor, or assign a section-style
  ID such as `T1`, `B1`, or `C1`.
- **Info** — shows set/count/playback information plus the mouse position in
  chart-style and raw canvas coordinates.

## Coordinates

Side 1 is the left half of the displayed field and Side 2 is the right half.
The chart location reports the closest yard line and field reference, using the
step size assigned to the active move.

## Show format

Exports contain a title, players, and moves:

```json
{
  "Title": "Example Show",
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
