import { byId } from './config.js';
import { showSceneError } from './ui.js';
import { enterOffice } from './lobby.js';
import { initScene } from './scene.js';

const initial = location.hash.slice(1);
if (initial === 'office') enterOffice(null, { instant: true });
else if (Object.hasOwn(byId, initial)) enterOffice(initial, { instant: true });

try {
    await initScene();
} catch (error) {
    showSceneError(error);
}

