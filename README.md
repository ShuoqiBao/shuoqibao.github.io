# Shuoqi Bao’s personal site

The entrance opens into an interactive 3D office. The **Classic site** link opens the text-first résumé at `classic/`. Both views use the bilingual section content in `js/content.js`.

## Preview

From this directory, run `python -m http.server 8766 --bind 127.0.0.1`, then visit `http://127.0.0.1:8766/`.

## Update

- Edit the matching English and Chinese entries in `js/content.js` to update a section.
- Add project details under `projects-en` and `projects-zh`, and dated updates under `news-en` and `news-zh`.
- Replace `assets/Shuoqi-Bao-CV.pdf` when the public English CV changes.

## GitHub Pages

Use the contents of this directory as the publishing root of the Pages repository, including `.nojekyll`. The site consists of static files and uses a locally included Three.js dependency. Publish from the root of the selected branch. After deployment, use the resulting `github.io` address for the Q2 network measurements.

## Credits

The doorway, room and camera framework adapt [Walk-in Homepage](https://github.com/jong980812/walk-in-homepage) by Jongseo Lee. The upstream MIT notice appears in `LICENSE`. Three.js r170 and the RoundedBoxGeometry addon are included under the MIT license in `vendor/three/LICENSE`.
