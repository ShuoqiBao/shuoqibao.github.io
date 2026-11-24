import { THREE } from './three.js';
import { localize } from './language.js';

function names(en, zh, objectEn, objectZh) {
    return {
        get label() { return localize(en, zh); },
        get object() { return localize(objectEn, objectZh); },
    };
}

export const HOTSPOTS = [
    { id: 'experience', ...framing([-2.93, 2.3, -1.4], [-2.96, 1.7, -1.4], [1, 0.1, 0.2], 1.18, 'top') },
    { id: 'skills', ...framing([-2.18, 1.90, -2.54], [-2.2, 1.17, -2.8], [0.45, 0.22, 1], 1.12, 'top') },
    { id: 'projects', ...framing([0.77, 1.53, -2.67], [0.45, 1.4, -2.7], [0.2, 0.2, 1], 0.92, 'right') },
    { id: 'contact', ...framing([-0.48, 0.98, -2.29], [-0.45, 0.86, -2.38], [0.25, 0.65, 1], 0.58, 'left') },
    { id: 'news', ...framing([-2.56, 0.49, -0.17], [-2.56, 0.26, -0.17], [0.9, 0.45, 1], 0.52, 'right') },
];

function framing(anchor, target, dir, size, side) {
    return { kind: 'panel', anchor, target, dir, size, side };
}

const namesById = {
    experience: names('Experience', '履历', 'The whiteboard', '白板'),
    skills: names('Skills', '技能', 'The bookshelf', '书架'),
    projects: names('Projects', '项目', 'The monitor', '电脑'),
    contact: names('Contact', '联系', 'The letter tray', '信件托盘'),
    news: names('News', '近况', 'The office cat', '办公室小猫'),
};
for (const hotspot of HOTSPOTS) Object.defineProperties(hotspot, Object.getOwnPropertyDescriptors(namesById[hotspot.id]));

export const LAMP = Object.defineProperties(
    { id: 'lamp', kind: 'lighting', side: 'right', anchor: [1.48, 1.43, -2.38] },
    Object.getOwnPropertyDescriptors(names('Desk lamp', '台灯', 'The desk lamp', '台灯')),
);
export const DOOR = { id: 'door', kind: 'exit', anchor: [-2.93, 2.35, 0.58] };
export const byId = Object.fromEntries(HOTSPOTS.map((spot) => [spot.id, spot]));

export const ROOM = { height: 2.9, back: -3, front: 7, depth: 10 };
export const OVERVIEW = {
    fov: 46,
    wide:   { target: new THREE.Vector3(-0.38, 1.18, -1.7), theta: 0.6, phi: 1.44 },
    narrow: { target: new THREE.Vector3(0.4, 1.24, -2.6), theta: 0.22, phi: 1.44, look: true },
};
export const CAMERA_BOUNDS = { min: new THREE.Vector3(-2.7, 0.5, -2.2), max: new THREE.Vector3(2.75, 2.6, 6.5) };
export const KEEP_IN_VIEW = {
    narrow: [[-0.95, 0.7, -2.4], [2.0, 0.7, -2.4], [0.4, 2.68, -3.0]],
    wide: [[-3, 2.3, 0.85], [-2.67, 0.1, 0.52], [-3, 2.5, -1.4], [0.4, 2.68, -3], [2.85, 2.5, -3], [2.8, 0.1, -2.2], [0.45, 0.05, -0.9]],
};
for (const layout of Object.keys(KEEP_IN_VIEW)) KEEP_IN_VIEW[layout] = KEEP_IN_VIEW[layout].map((pt) => new THREE.Vector3(...pt));

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const canHover = matchMedia('(hover: hover)').matches;

