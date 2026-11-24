import { THREE } from './three.js';
import { add, std } from './util.js';

export function buildCat() {
    const cat = new THREE.Group();
    cat.position.set(-2.56, 0, -0.17);
    cat.rotation.y = 0.49;
    const ginger = std(0xd18b4c, { flatShading: true });
    const cream = std(0xf3dcb1, { flatShading: true });
    const stripe = std(0xad5e34, { flatShading: true });
    const eyes = std(0x363225, { roughness: 0.4 });
    const pink = std(0xbe7666);
    const shape = (size, material, center, scale, detail = 1) => {
        const mesh = add(cat, new THREE.IcosahedronGeometry(size, detail), material, center);
        mesh.scale.set(...scale);
        return mesh;
    };

    shape(0.16, ginger, [0, 0.151, -0.062], [0.8, 0.95, 0.82]);
    shape(0.125, cream, [0, 0.192, 0.019], [0.66, 0.95, 0.67]);
    shape(0.122, ginger, [0, 0.339, 0.025], [1.07, 0.94, 0.87]);
    for (const side of [-1, 1]) {
        const x = 0.065 * side;
        shape(0.069, ginger, [x, 0.088, 0.077], [0.45, 1.12, 0.61]);
        shape(0.041, cream, [x, 0.028, 0.087], [0.87, 0.62, 1.02]);
        const ear = add(cat, new THREE.ConeGeometry(0.048, 0.13, 3), ginger, [x, 0.433, 0.013]);
        ear.rotation.z = -0.23 * side;
        const lining = add(cat, new THREE.ConeGeometry(0.023, 0.077, 3), pink, [x, 0.437, 0.037]);
        lining.rotation.z = ear.rotation.z;
        shape(0.017, eyes, [x * 0.85, 0.351, 0.107], [0.82, 1.14, 0.45], 2);
        shape(0.0043, cream, [x * 0.85 - 0.003, 0.357, 0.114], [1, 1, 1]);
        shape(0.038, cream, [0.021 * side, 0.31, 0.109], [0.9, 0.58, 0.55]);
        shape(0.019, stripe, [0.025 * side, 0.416, 0.076], [0.28, 1.1, 0.48]).rotation.z = 0.29 * side;
    }
    shape(0.015, pink, [0, 0.322, 0.127], [0.86, 0.57, 0.5]);

    const curl = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.06, 0.079, -0.13),
        new THREE.Vector3(-0.16, 0.055, -0.14),
        new THREE.Vector3(-0.21, 0.038, -0.057),
        new THREE.Vector3(-0.17, 0.036, 0.04),
        new THREE.Vector3(-0.085, 0.036, 0.055),
    ]);
    add(cat, new THREE.TubeGeometry(curl, 16, 0.025, 7, false), ginger);
    shape(0.025, cream, [-0.085, 0.036, 0.055], [1.1, 1, 1]);
    return cat;
}
