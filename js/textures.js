// Everything with text or a pattern on it is drawn on a canvas at load time — no image assets.
import { canvasTex, rng, setFit, roundRect, star, TAU } from './util.js';

export function plankTexture() {
    return canvasTex(1024, 1024, (c, W, H) => {
        const r = rng(7);
        const rows = 12;
        const rh = H / rows;
        for (let i = 0; i < rows; i++) {
            let x = -r() * 300;
            while (x < W) {
                const len = 260 + r() * 320;
                c.fillStyle = `hsl(33, 40%, ${73 + r() * 6}%)`;
                c.fillRect(x, i * rh, len, rh);
                c.strokeStyle = 'rgba(120, 85, 45, 0.08)';
                c.lineWidth = 1.5;
                for (let g = 0; g < 4; g++) {
                    const gy = i * rh + 8 + r() * (rh - 16);
                    c.beginPath();
                    c.moveTo(x + 6, gy);
                    c.bezierCurveTo(x + len * 0.3, gy + (r() - 0.5) * 6, x + len * 0.7, gy + (r() - 0.5) * 6, x + len - 6, gy);
                    c.stroke();
                }
                c.fillStyle = 'rgba(110, 75, 40, 0.28)';
                c.fillRect(x, i * rh, 2, rh);
                x += len;
            }
            c.fillStyle = 'rgba(110, 75, 40, 0.3)';
            c.fillRect(0, i * rh, W, 2);
        }
    });
}

export function whiteboardTexture() {
    return canvasTex(960, 520, (c, w, h) => {
        c.fillStyle = '#f1e8d8';
        c.fillRect(0, 0, w, h);
        const node = (x, color) => {
            c.fillStyle = color;
            c.beginPath();
            c.arc(x, 260, 101, 0, TAU);
            c.fill();
        };
        node(265, '#c9c6a1');
        node(705, '#d8a88d');
        c.fillStyle = '#767f64';
        for (const [i, height] of [32, 57, 94].entries()) c.fillRect(219 + i * 34, 305 - height, 21, height);
        c.strokeStyle = '#8e725a';
        c.lineWidth = 5;
        c.lineCap = 'round';
        c.beginPath();
        c.moveTo(383, 260); c.lineTo(580, 260);
        c.moveTo(559, 246); c.lineTo(580, 260); c.lineTo(559, 274);
        c.stroke();
        c.strokeStyle = '#f6e6cf';
        const dots = [[705, 213], [669, 293], [741, 293]];
        c.beginPath();
        c.moveTo(...dots[0]); c.lineTo(...dots[1]); c.lineTo(...dots[2]); c.closePath();
        c.stroke();
        for (const [x, y] of dots) {
            c.beginPath(); c.arc(x, y, 12, 0, TAU); c.fillStyle = '#f6e6cf'; c.fill();
        }
    });
}

export function screenTexture() {
    return canvasTex(512, 320, (c, w, h) => {
        const background = c.createLinearGradient(0, 0, w, h);
        background.addColorStop(0, '#77665c');
        background.addColorStop(0.56, '#9d8477');
        background.addColorStop(1, '#61544f');
        c.fillStyle = background;
        c.fillRect(0, 0, w, h);
    });
}

export function frameTexture(withArt) {
    return canvasTex(256, 240, (c, w, h) => {
        c.fillStyle = '#e6d2ae';
        c.fillRect(0, 0, w, h);
        c.strokeStyle = '#be9f7e';
        c.lineWidth = 2;
        c.strokeRect(14, 14, w - 28, h - 28);
        if (!withArt) return;
        c.strokeStyle = '#8a8e63';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(25, 150);
        c.bezierCurveTo(184, 79, 25, 81, 173, 30);
        c.moveTo(64, 220);
        c.bezierCurveTo(161, 154, 54, 119, 228, 97);
        c.stroke();
    });
}

export function spineTexture(text, bg) {
    return canvasTex(128, 576, (c, W, H) => {
        c.fillStyle = bg;
        c.fillRect(0, 0, W, H);
        c.fillStyle = 'rgba(255,255,255,0.35)';
        c.fillRect(0, 40, W, 6);
        c.fillRect(0, H - 46, W, 6);
        c.save();
        c.translate(W / 2, H / 2);
        c.rotate(Math.PI / 2);
        c.fillStyle = '#fff';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        setFit(c, text, H - 130, 52, 700, 'Arial');
        c.fillText(text, 0, 2);
        c.restore();
    });
}

export function envelopeTexture() {
    return canvasTex(512, 360, (c, W, H) => {
        c.fillStyle = '#fbf6ea';
        c.fillRect(0, 0, W, H);
        c.strokeStyle = 'rgba(120, 100, 70, 0.35)';
        c.lineWidth = 4;
        c.beginPath();
        c.moveTo(8, 8);
        c.lineTo(W / 2, 200);
        c.lineTo(W - 8, 8);
        c.stroke();
        c.fillStyle = '#e2574c';
        c.beginPath();
        c.arc(W / 2, 200, 40, 0, TAU);
        c.fill();
        c.fillStyle = '#fff';
        c.font = '700 44px Sora';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('@', W / 2, 198);
    });
}

export function keyboardTexture() {
    return canvasTex(512, 168, (c, W, H) => {
        c.fillStyle = '#d7dee7';
        c.fillRect(0, 0, W, H);
        c.fillStyle = '#fdfefe';
        const cols = 14, pad = 12, gap = 5;
        const kw = (W - pad * 2 - gap * (cols - 1)) / cols, kh = 24;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < cols; col++) {
                roundRect(c, pad + col * (kw + gap), pad + row * (kh + gap), kw, kh, 4);
                c.fill();
            }
        }
        roundRect(c, pad + 4 * (kw + gap), pad + 4 * (kh + gap), kw * 6 + gap * 5, kh, 4);
        c.fill();
    });
}

export function signTexture() {
    return canvasTex(320, 110, (c, W, H) => {
        c.fillStyle = '#ffffff';
        roundRect(c, 0, 0, W, H, 18);
        c.fill();
        c.fillStyle = '#163a6b';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        setFit(c, 'LOBBY', W - 40, 38, 700, 'Arial');
        c.fillText('LOBBY', W / 2, H / 2 + 2);
    });
}

export function skyTexture(phase) {
    return canvasTex(512, 640, (c, W, H) => {
        const r = rng(3);
        const G = {
            dusk:  ['#4f5f9f', '#f3a37b', '#5b4f6e'],
            night: ['#0a1631', '#253c69', '#18233d'],
        }[phase];
        const g = c.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, G[0]);
        g.addColorStop(1, G[1]);
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);

        if (phase === 'night') {
            for (let i = 0; i < 70; i++) {
                c.fillStyle = `rgba(255,255,255,${0.35 + r() * 0.6})`;
                c.fillRect(r() * W, r() * H * 0.62, 2 + r() * 2, 2 + r() * 2);
            }
            c.fillStyle = '#fdf3cf';
            c.beginPath(); c.arc(360, 130, 42, 0, TAU); c.fill();
            c.fillStyle = G[0];
            c.beginPath(); c.arc(380, 118, 38, 0, TAU); c.fill();
        } else {
            c.fillStyle = '#ffb46b';
            c.beginPath(); c.arc(150, 400, 54, 0, TAU); c.fill();
        }

        // A quiet skyline with lit windows.
        c.fillStyle = G[2];
        c.beginPath();
        c.moveTo(0, H);
        c.quadraticCurveTo(250, 380, 512, 520);
        c.lineTo(512, H);
        c.fill();
        const bld = [[0, 470, 70], [64, 430, 58], [118, 500, 64], [178, 450, 50], [226, 520, 80], [300, 470, 60], [356, 430, 70], [424, 490, 88]];
        const dark = phase === 'night' ? '#141d33' : '#4e4462';
        for (const [x, y, w] of bld) {
            c.fillStyle = dark;
            c.fillRect(x, y, w, H - y);
            for (let wy = y + 14; wy < H - 10; wy += 22) {
                for (let wx = x + 8; wx < x + w - 10; wx += 16) {
                    if (r() < (phase === 'night' ? 0.45 : 0.2)) {
                        c.fillStyle = '#ffd98a';
                        c.fillRect(wx, wy, 7, 9);
                    }
                }
            }
        }
    });
}
