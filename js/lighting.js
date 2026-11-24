let phase = 'dusk';
const listeners = new Set();

export function onDaylight(listener) {
    listeners.add(listener);
    listener({ phase });
}

export function toggleLighting() {
    phase = phase === 'dusk' ? 'night' : 'dusk';
    document.body.dataset.theme = phase === 'night' ? 'night' : 'day';
    for (const listener of listeners) listener({ phase });
}

