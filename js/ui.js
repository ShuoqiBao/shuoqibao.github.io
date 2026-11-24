import { THREE } from './three.js';
import { HOTSPOTS, LAMP, byId } from './config.js';
import { localize } from './language.js';
import { renderContent } from './content.js';
import { toggleLighting, onDaylight } from './lighting.js';

const $ = (selector) => document.querySelector(selector);
export const body = document.body;
export const canvas = $('#scene');
export const panel = $('#panel');
const panelBody = $('#panel-body');
const panelTitle = $('#panel-title');
const panelEyebrow = $('#panel-eyebrow');
const markerLayer = $('#markers');
const chips = $('#chips');
export const state = { inside: false, current: null };
export const view = { focus() {}, hover() {} };
let trigger;

const SVG_NS = 'http://www.w3.org/2000/svg';
const leaders = document.createElementNS(SVG_NS, 'svg');
leaders.id = 'leaders';
leaders.setAttribute('aria-hidden', 'true');
markerLayer.append(leaders);

function activate(hotspot, el) {
    if (hotspot.kind === 'lighting') toggleLighting();
    else if (state.current?.id === hotspot.id) closePanel();
    else openPanel(hotspot.id, el);
}

export const markers = [...HOTSPOTS, LAMP].map((def) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'marker is-hidden';
    el.dataset.kind = def.kind;
    el.dataset.side = def.side;
    el.dataset.hotspot = def.id;
    const dot = document.createElement('span');
    dot.className = 'marker-dot';
    const label = document.createElement('span');
    label.className = 'marker-label';
    el.append(dot, label);
    el.addEventListener('click', () => activate(def, el));
    el.addEventListener('pointerenter', () => view.hover(def.id));
    el.addEventListener('pointerleave', () => view.hover(null));
    el.addEventListener('focus', () => view.hover(def.id));
    el.addEventListener('blur', () => view.hover(null));
    markerLayer.append(el);
    const line = document.createElementNS(SVG_NS, 'line');
    leaders.append(line);
    return { def, el, label, line, side: def.side, anchor: new THREE.Vector3(...def.anchor),
             x: 0, y: 0, lx: 0, ly: 0, lw: 0, lh: 0, placed: false };
});

const shortcuts = [...HOTSPOTS, LAMP].map((def) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'chip-btn';
    el.dataset.id = def.id;
    el.addEventListener('click', () => activate(def, el));
    chips.append(el);
    return { def, el };
});
const directory = HOTSPOTS.map((def) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.dataset.enter = def.id;
    el.dataset.direct = '';
    $('#lobby-directory').append(el);
    return { def, el };
});

export function measureLabels() {
    for (const marker of markers) {
        marker.lw = marker.label.offsetWidth;
        marker.lh = marker.label.offsetHeight;
    }
}

function updateControls() {
    for (const { def, el, label } of markers) {
        label.textContent = def.label;
        el.setAttribute('aria-label', def.kind === 'lighting'
            ? localize('Toggle desk lamp and room lighting', '切换台灯和房间灯光')
            : def.label);
    }
    for (const { def, el } of [...shortcuts, ...directory]) el.textContent = def.label;
    measureLabels();
}
function renderPanel() {
    const def = state.current;
    if (!def) return;
    panelEyebrow.textContent = def.object;
    panelTitle.textContent = def.label;
    panelBody.replaceChildren(renderContent(def.id));
}
document.addEventListener('office-language', () => {
    updateControls();
    renderPanel();
    view.focus(state.current);
});
onDaylight(({ phase }) => {
    for (const button of document.querySelectorAll('[data-hotspot="lamp"], [data-id="lamp"]')) {
        button.setAttribute('aria-pressed', String(phase === 'night'));
    }
});

export function openPanel(id, source = document.activeElement) {
    const def = byId[id];
    if (!def) return;
    if (!state.current) trigger = source;
    state.current = def;
    renderPanel();
    panelBody.scrollTop = 0;
    panel.classList.add('open');
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');
    body.classList.add('is-focused');
    for (const { def: item, el } of shortcuts) {
        if (item.kind === 'panel') el.setAttribute('aria-current', String(item.id === id));
    }
    history.replaceState(null, '', '#' + id);
    panelTitle.focus({ preventScroll: true });
    view.focus(def);
}

export function closePanel({ restoreFocus = true } = {}) {
    if (!state.current) return;
    state.current = null;
    panel.classList.remove('open');
    body.classList.remove('is-focused');
    if (restoreFocus && panel.contains(document.activeElement)) {
        const fallback = chips.querySelector('[data-id]');
        const candidate = trigger?.isConnected && !trigger.closest('[inert]') && trigger.offsetParent !== null;
        (candidate ? trigger : fallback)?.focus({ preventScroll: true });
    }
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    for (const { el } of shortcuts) el.removeAttribute('aria-current');
    history.replaceState(null, '', '#office');
    view.focus(null);
}
panel.querySelector('[data-action="close"]').addEventListener('click', () => closePanel());
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.current) closePanel();
});

export function showSceneError(error) {
    console.warn('[office] WebGL is unavailable:', error.message);
    body.classList.add('no-webgl');
    canvas.classList.remove('ready');
    markerLayer.hidden = true;
    $('.scene-error').hidden = false;
}

updateControls();

