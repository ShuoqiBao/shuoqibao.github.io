import { reduceMotion } from './config.js';
import { state, body, openPanel, closePanel } from './ui.js';

const lobby = document.getElementById('lobby');
const doorway = lobby.querySelector('.doorway');
const leaf = lobby.querySelector('.door-leaf');
const ENTER_MS = 1300;
let timer;

export function enterOffice(id, { instant = false, source } = {}) {
    if (state.inside) {
        if (id) openPanel(id, source);
        return;
    }
    state.inside = true;
    const bounds = doorway.getBoundingClientRect();
    lobby.style.transformOrigin = (bounds.left + bounds.width / 2) + 'px ' + (bounds.top + bounds.height * 0.45) + 'px';
    lobby.classList.toggle('no-anim', instant);
    lobby.inert = true;
    body.classList.add('inside');
    if (!id) history.replaceState(null, '', '#office');
    clearTimeout(timer);
    const show = () => {
        body.classList.add('labels-in');
        if (id) openPanel(id, source);
        else if (source) document.querySelector('.only-inside').focus({ preventScroll: true });
    };
    if (instant || reduceMotion) show();
    else timer = setTimeout(show, ENTER_MS);
}

export function exitOffice() {
    if (!state.inside) return;
    clearTimeout(timer);
    closePanel({ restoreFocus: false });
    state.inside = false;
    lobby.classList.remove('no-anim');
    lobby.inert = false;
    body.classList.remove('inside', 'labels-in');
    history.replaceState(null, '', location.pathname + location.search);
    leaf.focus({ preventScroll: true });
}

document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action="enter"], [data-action="exit"], [data-enter]');
    if (!el) return;
    event.preventDefault();
    if (el.dataset.action === 'exit') exitOffice();
    else enterOffice(el.dataset.enter, { instant: el.hasAttribute('data-direct'), source: el });
});

