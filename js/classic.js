import { renderContent } from './content.js';

const sections = [...document.querySelectorAll('[data-content]')];
function renderPage() {
    for (const section of sections) {
        const fragment = renderContent(section.dataset.content);
        if (section.dataset.content === 'experience') fragment.querySelector('.panel-intro').remove();
        section.replaceChildren(fragment);
    }
}
renderPage();
document.addEventListener('office-language', renderPage);

// Position section links after their shared content has been inserted.
const anchor = document.getElementById(location.hash.slice(1));
if (anchor) anchor.scrollIntoView();
