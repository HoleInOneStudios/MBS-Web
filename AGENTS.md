# MBS-Web Agent Guide

## Project overview

MBS-Web is a dependency-free static web application. GitHub Pages deploys the
`src/` directory through `.github/workflows/static.yml`.

- `src/index.html` contains the UI.
- `src/style.css` contains the layout and visual rules.
- `src/scripts/field.js` renders the football field and chart coordinates.
- `src/scripts/player.js` represents and draws a player.
- `src/scripts/show.js` owns player data, set/move data, playback, and controls.
- `src/scripts/importExport.js` handles show JSON import/export.
- `src/scripts/mbs.js` starts the app and provides the default test show.

## Local preview

For this static site, use Python's built-in server on port 80:

```powershell
py -3 -m http.server 80 --directory src
```

Preview at `http://localhost/`. Stop the server when the user requests it.

## Data conventions

- Use `Player`, not `FieldObject` or generic “object,” in code and UI.
- A player has `id`, `name`, `color`, and `sets`.
- IDs are section-style labels such as `T1`, `B1`, and `C1`.
- Players from the same instrument section should use the same color.
- `Show.Moves[setIndex]` belongs to that destination set: its `count` and
  `stepSize` describe the move from the previous set into that set.
- Tempo is saved with the show. Playback speed is a simulation-only multiplier.
- Preserve legacy JSON import support for the older `List`, `Count`, and
  `Interval` format.

## Field conventions

- The view is from the press box: the bottom is the front sideline and the top
  is the back sideline.
- Side 1 is the left half of the displayed field; Side 2 is the right half.
- The canvas includes ten-yard end zones, but player coordinates use the
  0–100-yard playing field.
- Field Controls allow only green or white backgrounds. Markings automatically
  use a contrasting color and scale with the field.
- Players are colored circles with contrasting outlines for visibility.

## PWA behavior

- `manifest.webmanifest` and `service-worker.js` provide install/offline use.
- The service worker is network-first for same-origin GET requests: it refreshes
  cached files when online and uses cached files when offline.
- Keep any newly required local app assets in `APP_FILES` for first-install
  offline support.

## Change and verification rules

- Keep this `AGENTS.md` current. Update it whenever a change affects the
  project architecture, data model, workflows, local-preview process, PWA
  behavior, UI conventions, or any instruction future agents need to follow.
- Update `README.md` whenever user-facing functionality or project behavior
  changes.
- Keep the existing plain HTML/CSS/ES-module style; do not introduce a build
  system or framework without explicit user approval.
- Use `apply_patch` for file edits.
- Run relevant syntax checks after JavaScript edits, for example:

```powershell
node --check src/scripts/mbs.js
node --check src/scripts/show.js
git diff --check
```

- Keep layout compact and group controls separately from info. The info bar is
  above the field; transport controls sit directly below it.
