const languageButton = document.getElementById('language');
const englishTitle = document.title;
const chineseTitle = document.body.dataset.titleZh ?? '包朔齐 | 个人办公室';
const text = [...document.querySelectorAll('[data-zh]')].map((el) => [el, el.textContent]);
const labels = [...document.querySelectorAll('[data-aria-zh]')].map((el) => [el, el.getAttribute('aria-label')]);

export let language = 'en';
export const localize = (en, zh) => language === 'zh' ? zh : en;

function updateLanguage() {
    document.documentElement.lang = localize('en', 'zh-CN');
    document.title = localize(englishTitle, chineseTitle);
    languageButton.textContent = localize('中文', 'English');
    languageButton.lang = localize('zh-CN', 'en');
    languageButton.setAttribute('aria-label', localize('切换到中文', 'Switch to English'));
    for (const [el, en] of text) el.textContent = localize(en, el.dataset.zh);
    for (const [el, en] of labels) el.setAttribute('aria-label', localize(en, el.dataset.ariaZh));
    document.dispatchEvent(new Event('office-language'));
}

try {
    if (sessionStorage.getItem('office-language') === 'zh') language = 'zh';
} catch {
    // The switch still works when browser storage is unavailable.
}
updateLanguage();

languageButton.addEventListener('click', () => {
    language = localize('zh', 'en');
    try { sessionStorage.setItem('office-language', language); } catch {}
    updateLanguage();
});
