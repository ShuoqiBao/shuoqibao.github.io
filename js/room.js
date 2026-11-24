// The room and everything in it. Each hotspot object is a group registered under its section id.
import { THREE } from './three.js';
import { DOOR, LAMP, ROOM, byId } from './config.js';
import { std, rbox, add, rod, rng, TAU } from './util.js';
import {
    plankTexture, whiteboardTexture, frameTexture, screenTexture, spineTexture, envelopeTexture,
    keyboardTexture, signTexture,
} from './textures.js';
import { buildCat } from './cat.js';

export function buildRoom({ scene, world, register }) {
    // Materials and lights the time of day changes; scene.js drives them.
    const lights = { mood: [] };
    /* ---------- room shell ---------- */
    // A closed box that runs well past the camera, so the view is filled with room at any aspect ratio.
    {
        const planks = plankTexture();
        planks.wrapS = planks.wrapT = THREE.RepeatWrapping;
        planks.repeat.set(1, ROOM.depth / 6);
        const zMid = (ROOM.back + ROOM.front) / 2;
        const floor = add(world, new THREE.PlaneGeometry(6, ROOM.depth), std(0xffffff, { map: planks, roughness: 0.7 }),
            [0, 0, zMid], { cast: false });
        floor.rotation.x = -Math.PI / 2;
        // Unlit, or the hemisphere light would tint it with the floor's bounce colour.
        lights.ceiling = new THREE.MeshBasicMaterial({ color: 0xe9eef5 });
        const ceiling = add(world, new THREE.PlaneGeometry(6, ROOM.depth), lights.ceiling,
            [0, ROOM.height, zMid], { cast: false, receive: false });
        ceiling.rotation.x = Math.PI / 2;

        const back = std(0xbc8062), sideWall = std(0xe5d4be);
        add(world, new THREE.BoxGeometry(6.4, ROOM.height, 0.2), back, [0, ROOM.height / 2, ROOM.back - 0.1]);
        add(world, new THREE.BoxGeometry(0.2, ROOM.height, ROOM.depth), sideWall, [-3.1, ROOM.height / 2, zMid]);
        // The sun shines in over the right wall, so it must not cast a shadow across the room.
        // It also faces away from the sun, so it glows a little to match the left wall.
        const rightWall = lights.rightWall = std(0xd7b9a1, { emissive: 0xc6a58c, emissiveIntensity: 0.3 });
        add(world, new THREE.BoxGeometry(0.2, ROOM.height, ROOM.depth), rightWall, [3.1, ROOM.height / 2, zMid], { cast: false });
        const trim = std(0xfafbfc);
        add(world, new THREE.BoxGeometry(6.0, 0.1, 0.03), trim, [0, 0.05, ROOM.back + 0.015], { cast: false });
        for (const x of [-2.985, 2.985]) add(world, new THREE.BoxGeometry(0.03, 0.1, ROOM.depth), trim, [x, 0.05, zMid], { cast: false });

        add(world, new THREE.CylinderGeometry(1.2, 1.2, 0.015, 64), std(0xb09b7b), [0.45, 0.0075, -1.4], { cast: false });
        add(world, new THREE.CylinderGeometry(0.98, 0.98, 0.017, 64), std(0xdcc8a6), [0.45, 0.0085, -1.4], { cast: false });

        // recessed light panels
        const glow = lights.panels = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
        for (const [x, z] of [[-1.4, -1.6], [1.4, -1.6], [-1.4, 1.2], [1.4, 1.2]]) {
            const p = add(world, new THREE.PlaneGeometry(1.3, 0.28), glow, [x, ROOM.height - 0.004, z], { cast: false, receive: false });
            p.rotation.x = Math.PI / 2;
        }
    }

    /* ---------- desk + decor ---------- */
    {
        const wood = std(0x9d6037, { roughness: 0.6 }), navy = std(0x69442f, { roughness: 0.6 });
        add(world, rbox(2.8, 0.06, 1.0, 0.02), wood, [0.55, 0.75, -2.5]);
        add(world, rbox(0.05, 0.72, 0.92, 0.01), navy, [-0.8, 0.36, -2.5]);
        add(world, rbox(0.05, 0.72, 0.92, 0.01), navy, [1.9, 0.36, -2.5]);
        add(world, rbox(2.6, 0.34, 0.03, 0.01), navy, [0.55, 0.5, -2.92]);
        // drawer cabinet
        const cab = std(0x9e6644);
        add(world, rbox(0.46, 0.62, 0.8, 0.015), cab, [1.58, 0.33, -2.5]);
        for (const y of [0.48, 0.2]) add(world, rbox(0.16, 0.025, 0.02, 0.008), navy, [1.58, y, -2.095]);

        // keyboard + mouse
        const kb = std(0xffffff, { map: keyboardTexture(), roughness: 0.6 });
        const kbSide = std(0xd7dee7);
        add(world, new THREE.BoxGeometry(0.62, 0.022, 0.2), [kbSide, kbSide, kb, kbSide, kbSide, kbSide], [0.45, 0.791, -2.2]);
        add(world, new THREE.BoxGeometry(0.28, 0.004, 0.22), std(0x1f4e8c), [0.98, 0.782, -2.19], { cast: false });
        add(world, rbox(0.065, 0.03, 0.105, 0.014), std(0xffffff, { roughness: 0.4 }), [0.98, 0.797, -2.19]);

        // mug
        const mug = new THREE.Group();
        mug.position.set(-0.06, 0.78, -2.12);
        const white = std(0xffffff, { roughness: 0.35 });
        add(mug, new THREE.CylinderGeometry(0.045, 0.04, 0.1, 24), white, [0, 0.05, 0]);
        add(mug, new THREE.CylinderGeometry(0.0458, 0.0452, 0.025, 24), std(0xe2574c), [0, 0.062, 0]);
        add(mug, new THREE.CylinderGeometry(0.04, 0.04, 0.002, 20), std(0x6b4226), [0, 0.1005, 0], { cast: false });
        const handle = add(mug, new THREE.TorusGeometry(0.026, 0.008, 8, 16, Math.PI), white, [0.045, 0.05, 0]);
        handle.rotation.z = -Math.PI / 2;
        world.add(mug);

        // pen holder
        const pens = new THREE.Group();
        pens.position.set(-0.42, 0.78, -2.84);
        add(pens, new THREE.CylinderGeometry(0.04, 0.04, 0.1, 20), std(0x1f4e8c), [0, 0.05, 0]);
        [[0x0f2a52, 0.3, 0.2], [0xe2574c, -0.25, 0.1], [0xe8b931, 0.05, -0.3]].forEach(([col, rx, rz], i) => {
            const p = add(pens, new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), std(col), [0.012 * (i - 1), 0.1, 0.01 * (i - 1)]);
            p.rotation.set(rx * 0.4, 0, rz * 0.4);
        });
        world.add(pens);

        // The desk lamp is part of the scene and acts as the lighting switch.
        const fixture = new THREE.Group();
        fixture.position.x = 2.05;
        const lampMat = std(0xb98841, { roughness: 0.36, metalness: 0.45 });
        const B = new THREE.Vector3(-0.62, 0.8, -2.82), E = new THREE.Vector3(-0.68, 1.22, -2.9), Hd = new THREE.Vector3(-0.46, 1.26, -2.62);
        add(fixture, new THREE.CylinderGeometry(0.075, 0.085, 0.025, 24), lampMat, [B.x, 0.7925, B.z]);
        rod(fixture, B, E, 0.011, lampMat);
        rod(fixture, E, Hd, 0.011, lampMat);
        const D = new THREE.Vector3(-0.3, 0.78, -2.35);
        const aim = new THREE.Vector3().subVectors(D, Hd).normalize();
        const head = add(fixture, new THREE.ConeGeometry(0.075, 0.12, 24, 1, true), std(0x4d5a3e, { side: THREE.DoubleSide }));
        head.position.copy(Hd);
        head.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), aim);
        const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff1d0, emissive: 0xffc977, emissiveIntensity: 0.2 });
        const bulb = add(fixture, new THREE.SphereGeometry(0.03, 16, 12), bulbMat, [0, 0, 0], { cast: false });
        bulb.position.copy(Hd).addScaledVector(aim, 0.04);
        const lampLight = new THREE.PointLight(0xffc27a, 0, 3.5, 2);
        lampLight.position.copy(Hd).addScaledVector(aim, 0.09);
        fixture.add(lampLight);
        register(LAMP, fixture);
        lights.lamp = { light: lampLight, bulb: bulbMat };

        // Mood lights, only lit at night: an LED strip behind the desk and a glowing orb on the bookshelf.
        // `glow` is the unlit material of the fixture itself; `light` is what it throws on the room.
        const moodLight = (pos, color, power, range, glow, off) => {
            const light = new THREE.PointLight(color, 0, range, 1.6);
            light.position.set(...pos);
            scene.add(light);
            lights.mood.push({ light, power, glow, on: color, off });
        };
        const strip = new THREE.MeshBasicMaterial({ color: 0xcfd6e2, toneMapped: false });
        add(world, new THREE.BoxGeometry(2.5, 0.025, 0.025), strip, [0.55, 0.8, -2.975], { cast: false, receive: false });
        moodLight([0.5, 1.25, -2.8], 0xffbb78, 0.65, 3.6, strip, 0xcfd6e2);
        const orb = new THREE.MeshBasicMaterial({ color: 0xf3efe6, toneMapped: false });
        add(world, new THREE.CylinderGeometry(0.05, 0.06, 0.03, 20), std(0x1c2b3a), [-2.55, 2.135, -2.77]);
        add(world, new THREE.SphereGeometry(0.11, 24, 18), orb, [-2.55, 2.25, -2.77], { cast: false, receive: false });
        moodLight([-2.45, 2.3, -2.45], 0xffb061, 1.1, 4.5, orb, 0xf3efe6);

        // chair
        const chair = new THREE.Group();
        chair.position.set(0.4, 0, -1.45);
        chair.rotation.y = Math.PI + 0.45;
        const seat = std(0x4c4139, { roughness: 0.7 }), dark = std(0x1c2b3a, { roughness: 0.5 }), chrome = std(0xb7c1cc, { roughness: 0.3, metalness: 0.5 });
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * TAU;
            const leg = add(chair, rbox(0.035, 0.03, 0.3, 0.01), dark, [Math.sin(a) * 0.15, 0.07, Math.cos(a) * 0.15]);
            leg.rotation.y = a;
            add(chair, new THREE.SphereGeometry(0.025, 10, 8), dark, [Math.sin(a) * 0.29, 0.025, Math.cos(a) * 0.29]);
        }
        add(chair, new THREE.CylinderGeometry(0.025, 0.025, 0.34, 12), chrome, [0, 0.24, 0]);
        add(chair, rbox(0.5, 0.08, 0.48, 0.035), seat, [0, 0.44, 0]);
        add(chair, rbox(0.05, 0.3, 0.03, 0.01), dark, [0, 0.58, -0.24]);
        const backrest = add(chair, rbox(0.46, 0.46, 0.06, 0.03), seat, [0, 0.82, -0.25]);
        backrest.rotation.x = -0.12;
        world.add(chair);

        // plant
        const plant = new THREE.Group();
        plant.position.set(2.45, 0, -2.4);
        add(plant, new THREE.CylinderGeometry(0.2, 0.15, 0.38, 20), std(0xd67a58), [0, 0.19, 0]);
        add(plant, new THREE.CylinderGeometry(0.215, 0.215, 0.05, 20), std(0xc96d4c), [0, 0.37, 0]);
        add(plant, new THREE.CylinderGeometry(0.19, 0.19, 0.01, 20), std(0x5b4636), [0, 0.393, 0], { cast: false });  // just above the rim, or the two faces flicker
        const leafGeo = new THREE.IcosahedronGeometry(1, 1);
        const greens = [0x4f9a6b, 0x5fae7a, 0x3f845a];
        const pr = rng(5);
        for (let i = 0; i < 11; i++) {
            const pivot = new THREE.Group();
            pivot.position.y = 0.39;
            pivot.rotation.set(0, (i / 11) * TAU + pr() * 0.4, 0.25 + pr() * 0.55);
            const leaf = add(pivot, leafGeo, std(greens[i % 3], { flatShading: true, roughness: 0.8 }), [0, 0.3 + pr() * 0.12, 0]);
            leaf.scale.set(0.09, 0.3 + pr() * 0.1, 0.025);
            plant.add(pivot);
        }
        world.add(plant);
    }

    /* ---------- dusk window ---------- */
    const skyMat = new THREE.MeshBasicMaterial({ toneMapped: false });
    {
        const g = new THREE.Group();
        g.position.set(2.3, 1.85, -2.99);
        add(g, new THREE.PlaneGeometry(0.9, 1.1), skyMat, [0, 0, 0.005], { cast: false, receive: false });
        const frame = std(0xffffff, { roughness: 0.5 });
        add(g, rbox(1.02, 0.06, 0.06, 0.01), frame, [0, 0.58, 0.03]);
        add(g, rbox(1.02, 0.06, 0.06, 0.01), frame, [0, -0.58, 0.03]);
        add(g, rbox(0.06, 1.22, 0.06, 0.01), frame, [-0.48, 0, 0.03]);
        add(g, rbox(0.06, 1.22, 0.06, 0.01), frame, [0.48, 0, 0.03]);
        add(g, rbox(0.03, 1.1, 0.03, 0.005), frame, [0, 0, 0.02]);
        add(g, rbox(0.9, 0.03, 0.03, 0.005), frame, [0, 0.12, 0.02]);
        add(g, rbox(1.14, 0.04, 0.16, 0.01), frame, [0, -0.62, 0.07]);
        world.add(g);
    }

    /* ---------- monitor and project shelf ---------- */
    {
        const g = new THREE.Group();
        g.position.set(0.42, 0.78, -2.72);
        g.scale.setScalar(1.32);
        const bezel = std(0x252421, { roughness: 0.48 });
        const stand = std(0x5f655d, { roughness: 0.45, metalness: 0.38 });
        add(g, rbox(0.34, 0.02, 0.22, 0.008), stand, [0, 0.01, 0.02]);
        add(g, rbox(0.06, 0.34, 0.04, 0.01), stand, [0, 0.18, -0.035]);
        add(g, rbox(1.06, 0.68, 0.045, 0.015), bezel, [0, 0.47, 0]);
        const screen = new THREE.MeshBasicMaterial({ map: screenTexture(), toneMapped: false });
        add(g, new THREE.PlaneGeometry(0.98, 0.6125), screen, [0, 0.47, 0.025], { cast: false, receive: false });
        register(byId.projects, g);
    }

    /* ---------- hotspot: bookshelf and skills ---------- */
    {
        const g = new THREE.Group();
        g.position.set(-2.2, 0, -2.77);
        const frame = std(0xa46438, { roughness: 0.65 });
        add(g, new THREE.BoxGeometry(1.2, 2.1, 0.015), std(0x895530), [0, 1.05, -0.2]);
        for (const x of [-0.6, 0.6]) add(g, rbox(0.035, 2.1, 0.42, 0.008), frame, [x, 1.05, 0]);
        const levels = [0.04, 0.52, 1.0, 1.48, 1.96];
        for (const y of levels) add(g, rbox(1.2, 0.035, 0.42, 0.008), frame, [0, y, 0]);
        add(g, rbox(1.24, 0.04, 0.44, 0.008), frame, [0, 2.1, 0]);

        const palette = [0x405b49, 0xa6553f, 0xc48545, 0x6b7458, 0xcaaf81, 0x5f6265, 0xe4d3b6];
        const r = rng(21);
        const labelled = {
            2: [['SQL', '#37544b'], ['PYTHON', '#88644b'], ['SPARK', '#a45836'], ['HDFS', '#767951']],
        };
        levels.slice(0, 4).forEach((y, li) => {
            const base = y + 0.0175;
            let x = -0.56;
            if (li === 0) {
                add(g, rbox(0.5, 0.3, 0.36, 0.02), std(0xc3d3e8), [-0.28, base + 0.15, 0]);
                add(g, rbox(0.5, 0.3, 0.36, 0.02), std(0xf3efe6), [0.28, base + 0.15, 0]);
                return;
            }
            const labels = labelled[li] || [];
            labels.forEach(([text, bg]) => {
                const w = 0.085, h = 0.38, d = 0.3;
                const side = std(new THREE.Color(bg).getHex());
                const spine = std(0xffffff, { map: spineTexture(text, bg) });
                add(g, new THREE.BoxGeometry(w, h, d), [side, side, side, side, spine, side], [x + w / 2, base + h / 2, 0.02]);
                x += w + 0.006;
            });
            const stop = li === 3 ? 0.18 : 0.56;
            while (x < stop - 0.05) {
                const w = 0.035 + r() * 0.04, h = 0.26 + r() * 0.13, d = 0.26 + r() * 0.05;
                add(g, new THREE.BoxGeometry(w, h, d), std(palette[Math.floor(r() * palette.length)]), [x + w / 2, base + h / 2, 0.02]);
                x += w + 0.004;
            }
            if (li === 3) {
                // globe
                add(g, new THREE.CylinderGeometry(0.06, 0.07, 0.02, 20), std(0x163a6b), [0.38, base + 0.01, 0]);
                add(g, new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8), std(0xb7c1cc, { metalness: 0.5 }), [0.38, base + 0.05, 0]);
                const globe = add(g, new THREE.IcosahedronGeometry(0.12, 2), std(0x4d84c9, { flatShading: true }), [0.38, base + 0.2, 0]);
                globe.rotation.z = 0.4;
            }
        });
        // small succulent on top
        add(g, new THREE.CylinderGeometry(0.07, 0.055, 0.1, 16), std(0xf3efe6), [0.35, 2.17, 0]);
        add(g, new THREE.IcosahedronGeometry(0.08, 0), std(0x5fae7a, { flatShading: true }), [0.35, 2.26, 0]);
        register(byId.skills, g);
    }

    /* ---------- hotspot: whiteboard and experience ---------- */
    {
        const g = new THREE.Group();
        g.position.set(-2.995, 1.7, -1.4);
        g.rotation.y = Math.PI / 2;
        add(g, rbox(2.12, 1.22, 0.035, 0.012), std(0x9f7451, { roughness: 0.6 }), [0, 0, 0]);
        add(g, new THREE.PlaneGeometry(2.04, 1.14), std(0xffffff, { map: whiteboardTexture(), roughness: 0.35 }), [0, 0, 0.019], { cast: false });
        add(g, rbox(0.7, 0.03, 0.07, 0.008), std(0xc3ccd6, { metalness: 0.3 }), [0, -0.63, 0.04]);
        [[0x163a6b, -0.18], [0xe2574c, 0], [0x2a63ad, 0.15]].forEach(([col, x]) => {
            const m = add(g, new THREE.CylinderGeometry(0.012, 0.012, 0.13, 10), std(col), [x, -0.605, 0.045]);
            m.rotation.z = Math.PI / 2;
        });
        register(byId.experience, g);
    }

    /* ---------- wall art and the office cat ---------- */
    {
        const wood = std(0x70442a, { roughness: 0.5 });
        for (let i = 0; i < 2; i++) {
            const x = 0.02 + i * 0.70;
            add(world, rbox(0.60, 0.56, 0.036, 0.012), wood, [x, 2.36, -2.97]);
            const paper = std(0xffffff, { map: frameTexture(i === 0) });
            add(world, new THREE.PlaneGeometry(0.53, 0.49), paper, [x, 2.36, -2.951], { cast: false });
        }
    }
    register(byId.news, buildCat());

    /* ---------- hotspot: letter tray → Contact ---------- */
    {
        const g = new THREE.Group();
        g.position.set(-0.47, 0.78, -2.36);
        g.rotation.y = 0.12;
        g.scale.setScalar(1.25);
        const tray = std(0xa36b41, { roughness: 0.55 });
        add(g, new THREE.BoxGeometry(0.36, 0.012, 0.27), tray, [0, 0.006, 0]);
        add(g, new THREE.BoxGeometry(0.36, 0.045, 0.01), tray, [0, 0.0225, 0.13]);
        add(g, new THREE.BoxGeometry(0.36, 0.06, 0.01), tray, [0, 0.03, -0.13]);
        for (const x of [-0.175, 0.175]) add(g, new THREE.BoxGeometry(0.01, 0.045, 0.27), tray, [x, 0.0225, 0]);
        const paper = std(0xf7f1e3);
        const env = std(0xffffff, { map: envelopeTexture() });
        [[0xffffff, -0.05], [0xf2ede0, 0.04], [null, -0.02]].forEach(([col, rot], i) => {
            const mats = col === null ? [paper, paper, env, paper, paper, paper] : std(col);
            const m = add(g, new THREE.BoxGeometry(0.3, 0.006, 0.21), mats, [0, 0.016 + i * 0.008, 0]);
            m.rotation.y = rot;
        });
        register(byId.contact, g);
    }

    /* ---------- door back to the lobby ---------- */
    const door = {};
    {
        const g = new THREE.Group();
        g.position.set(-2.99, 0, 0.32);
        g.rotation.y = Math.PI / 2;
        const trim = std(0xffffff, { roughness: 0.5 });
        add(g, rbox(0.06, 2.18, 0.05, 0.01), trim, [-0.48, 1.09, 0.02]);
        add(g, rbox(0.06, 2.18, 0.05, 0.01), trim, [0.48, 1.09, 0.02]);
        add(g, rbox(1.02, 0.06, 0.05, 0.01), trim, [0, 2.15, 0.02]);
        add(g, new THREE.PlaneGeometry(0.9, 2.1), new THREE.MeshBasicMaterial({ color: 0xfdf1d3, toneMapped: false }), [0, 1.05, 0.004], { cast: false, receive: false });
        const hinge = new THREE.Group();
        hinge.position.set(-0.45, 0, 0.012);
        g.add(hinge);
        const panelMat = std(0x7a9886, { roughness: 0.55 });   // sage, same as the lobby door
        add(hinge, rbox(0.9, 2.08, 0.045, 0.01), panelMat, [0.45, 1.05, 0.022]);
        add(hinge, rbox(0.62, 0.7, 0.012, 0.006), std(0x86a391, { roughness: 0.55 }), [0.45, 0.55, 0.048]);
        add(hinge, new THREE.SphereGeometry(0.035, 16, 12), std(0xc9a15a, { metalness: 0.5, roughness: 0.3 }), [0.8, 1.0, 0.07]);
        add(hinge, new THREE.PlaneGeometry(0.42, 0.145), std(0xffffff, { map: signTexture() }), [0.45, 1.5, 0.046], { cast: false });
        Object.assign(door, { hinge, open: 0 });
        register(DOOR, g);
    }

    return { skyMat, door, lights };
}
