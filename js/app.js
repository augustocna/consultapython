/* =============================================================================
 *  APP.JS  -  Lógica do site, organizada em classes
 * -----------------------------------------------------------------------------
 *  Utils             funções auxiliares (texto, HTML, tempo)
 *  Store             guarda preferências no navegador (localStorage)
 *  AssetLoader       carrega CSS e JS externos (tema, fontes, highlight)
 *  ThemeManager      aplica e troca o tema do Bootswatch
 *  Highlighter       colore o código com o highlight.js
 *  ClipboardService  copia texto para a área de transferência
 *  Toast             avisos rápidos na parte de baixo da tela
 *  BlockRenderer     transforma cada bloco (código, tabela, dica...) em HTML
 *  ContentRenderer   monta as categorias e os tópicos
 *  SearchEngine      busca nos tópicos (ignorando acentos)
 *  Sidebar           índice lateral
 *  ScrollSpy         marca no índice o tópico que está na tela
 *  App               junta tudo e cuida dos eventos
 *
 *  Configurações: js/config.js    Conteúdo: js/content.js
 * ============================================================================= */

'use strict';

/* -----------------------------------------------------------------------------
 * MACROS: ids do HTML, classes CSS e ações dos botões
 * -------------------------------------------------------------------------- */
const DOM_ID = Object.freeze({
    APP_CSS: 'app-css',
    THEME_LINK: 'theme-css',
    FONTS_LINK: 'fonts-css',
    HIGHLIGHT_LINK: 'highlight-css',
    SKIP_LINK: 'skip-link',
    MENU_BTN: 'btn-menu',
    BRAND: 'brand',
    BRAND_ICON: 'brand-icon',
    BRAND_TEXT: 'brand-text',
    SEARCH: 'search',
    SEARCH_KBD: 'search-kbd',
    SEARCH_CLEAR: 'search-clear',
    SIDEBAR: 'sidebar',
    BACKDROP: 'sidebar-backdrop',
    LEVEL_FILTER: 'level-filter',
    TOC: 'toc',
    THEME_PICKER: 'theme-picker',
    THEME_LABEL: 'theme-label',
    THEME_SELECT: 'theme-select',
    HERO: 'hero',
    HERO_TITLE: 'hero-title',
    HERO_SUBTITLE: 'hero-subtitle',
    HERO_HINT: 'hero-hint',
    SHORTCUTS: 'shortcuts',
    STATUS: 'search-status',
    STATUS_TEXT: 'search-status-text',
    STATUS_BTN: 'search-status-btn',
    EMPTY: 'empty-state',
    EMPTY_TITLE: 'empty-title',
    EMPTY_HINT: 'empty-hint',
    EMPTY_BTN: 'empty-btn',
    CONTENT: 'content',
    FOOTER: 'footer-text',
    BACK_TO_TOP: 'back-to-top',
    TOAST: 'toast',
});

const CSS_CLASS = Object.freeze({
    LOADING: 'is-loading',
    HIDDEN: 'd-none',
    ACTIVE: 'is-active',
    OPEN: 'is-open',
    VISIBLE: 'is-visible',
    COPIED: 'is-copied',
    SIDEBAR_OPEN: 'sidebar-open',
});

const ACTION = Object.freeze({
    COPY_CODE: 'copy-code',
    COPY_LINK: 'copy-link',
    TOGGLE_CATEGORY: 'toggle-category',
    GO_TO: 'go-to',
    CLEAR_FILTERS: 'clear-filters',
    HOME: 'home',
    BACK_TO_TOP: 'back-to-top',
});

const SELECTOR = Object.freeze({
    ACTION: '[data-action]',
    TOPIC: '[data-topic]',
    CATEGORY: '[data-category]',
    CODE_BLOCK: '.code-block',
    CODE: 'pre code',
    HIGHLIGHTABLE: 'pre code[data-highlight="true"]',
});

const svg = (paths, size = 16) =>
    `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

const ICON = Object.freeze({
    COPY: svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
    CHECK: svg('<polyline points="20 6 9 17 4 12"/>'),
    LINK: svg('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'),
    CHEVRON: svg('<polyline points="9 18 15 12 9 6"/>', 14),
});


/* =============================================================================
 * Utils
 * ========================================================================== */
class Utils {
    static escapeHtml(text = '') {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
        return String(text).replace(/[&<>"']/g, (ch) => map[ch]);
    }

    /** `código` vira <code> e **texto** vira <strong>. */
    static inline(text = '') {
        const codes = [];
        let html = Utils.escapeHtml(text).replace(/`([^`]+)`/g, (_, inner) => {
            codes.push(inner);
            return `\u0000${codes.length - 1}\u0000`;
        });
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        return html.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
    }

    /** Tira acentos e deixa minúsculo: "Função" -> "funcao". */
    static normalize(text = '') {
        return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    /** Remove linhas vazias das pontas e o recuo em comum de todas as linhas. */
    static dedent(text = '') {
        const lines = Utils.trimLines(text).split('\n');
        const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
        const min = indents.length ? Math.min(...indents) : 0;
        return lines.map((l) => l.slice(min)).join('\n');
    }

    /** Remove só as linhas vazias do começo e do fim (mantém o recuo). */
    static trimLines(text = '') {
        const lines = String(text).replace(/\r\n/g, '\n').split('\n');
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        return lines.join('\n');
    }

    /** Troca {chave} pelo valor: format('{n} itens', { n: 3 }) -> '3 itens'. */
    static format(template, values = {}) {
        return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
    }

    static debounce(fn, ms) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    }

    /** Executa no máximo uma vez por quadro de animação (bom para scroll). */
    static throttleFrame(fn) {
        let waiting = false;
        return (...args) => {
            if (waiting) return;
            waiting = true;
            requestAnimationFrame(() => {
                waiting = false;
                fn(...args);
            });
        };
    }

    static prefersReducedMotion() {
        return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    }

    /** Troca o endereço sem recarregar. Em file:// ou iframes pode ser bloqueado. */
    static replaceUrl(url) {
        try {
            history.replaceState(null, '', url);
        } catch {
            /* o navegador bloqueou: o site continua funcionando sem mudar o endereço */
        }
    }

    static isTyping() {
        const el = document.activeElement;
        return !!el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable);
    }
}


/* =============================================================================
 * Store: preferências salvas no navegador
 * ========================================================================== */
class Store {
    constructor({ ENABLED, PREFIX }) {
        this.enabled = ENABLED;
        this.prefix = PREFIX;
    }

    get(key, fallback = null) {
        if (!this.enabled) return fallback;
        try {
            const raw = localStorage.getItem(this.prefix + key);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    set(key, value) {
        if (!this.enabled) return;
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch {
            /* modo anônimo ou armazenamento cheio: só ignora */
        }
    }
}


/* =============================================================================
 * AssetLoader: carrega arquivos externos
 * ========================================================================== */
class AssetLoader {
    /**
     * Carrega (ou troca) um CSS. Fica ANTES do css/style.css para que o
     * estilo do site sempre tenha a palavra final.
     */
    static style(href, { id = null, before = DOM_ID.APP_CSS } = {}) {
        return new Promise((resolve) => {
            let link = id ? document.getElementById(id) : null;
            if (!link) {
                link = document.createElement('link');
                link.rel = 'stylesheet';
                if (id) link.id = id;
                const reference = document.getElementById(before) || document.head.firstChild;
                document.head.insertBefore(link, reference);
            }
            link.onload = () => resolve(true);
            link.onerror = () => resolve(false);
            link.href = href;
        });
    }

    static script(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });
    }

    /** Espera a promessa, mas desiste depois de "ms" milissegundos. */
    static withTimeout(promise, ms) {
        return Promise.race([promise, new Promise((resolve) => setTimeout(() => resolve(false), ms))]);
    }
}


/* =============================================================================
 * ThemeManager: tema do Bootswatch
 * ========================================================================== */
class ThemeManager {
    constructor(themeConfig, store, storageKey) {
        this.cfg = themeConfig;
        this.store = store;
        this.storageKey = storageKey;
        this.current = this.initialTheme();
    }

    exists(id) {
        return this.cfg.OPTIONS.some((option) => option.ID === id);
    }

    initialTheme() {
        const saved = this.cfg.ALLOW_SWITCH ? this.store.get(this.storageKey) : null;
        return this.exists(saved) ? saved : this.cfg.DEFAULT;
    }

    url(id) {
        const template = this.cfg.LOCAL_PATH || this.cfg.CDN_URL;
        return Utils.format(template, { version: this.cfg.VERSION, theme: id });
    }

    apply(id = this.current) {
        this.current = id;
        document.documentElement.dataset.theme = id;
        return AssetLoader.style(this.url(id), { id: DOM_ID.THEME_LINK });
    }

    mountSelect(select, wrapper, labelEl, labelText) {
        if (!this.cfg.ALLOW_SWITCH || this.cfg.OPTIONS.length < 2) {
            wrapper.classList.add(CSS_CLASS.HIDDEN);
            return;
        }
        labelEl.textContent = labelText;
        select.innerHTML = this.cfg.OPTIONS
            .map(({ ID, LABEL }) => `<option value="${ID}"${ID === this.current ? ' selected' : ''}>${Utils.escapeHtml(LABEL)}</option>`)
            .join('');
        select.addEventListener('change', () => {
            this.apply(select.value);
            this.store.set(this.storageKey, select.value);
        });
    }
}


/* =============================================================================
 * Highlighter: cores no código
 * ========================================================================== */
class Highlighter {
    constructor(highlightConfig) {
        this.cfg = highlightConfig;
        this.ready = false;
    }

    async load() {
        if (!this.cfg.ENABLED) return false;
        AssetLoader.style(this.cfg.STYLE_URL, { id: DOM_ID.HIGHLIGHT_LINK });
        const loaded = await AssetLoader.script(this.cfg.SCRIPT_URL);
        this.ready = loaded && typeof window.hljs !== 'undefined';
        return this.ready;
    }

    highlight(root) {
        if (!this.ready) return;
        root.querySelectorAll(SELECTOR.HIGHLIGHTABLE).forEach((el) => window.hljs.highlightElement(el));
    }
}


/* =============================================================================
 * ClipboardService: copiar texto
 * ========================================================================== */
class ClipboardService {
    static async copy(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch {
            /* sem permissão: tenta o jeito antigo abaixo */
        }
        return ClipboardService.legacyCopy(text);
    }

    static legacyCopy(text) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch {
            ok = false;
        }
        area.remove();
        return ok;
    }
}


/* =============================================================================
 * Toast: aviso rápido
 * ========================================================================== */
class Toast {
    constructor(el, durationMs) {
        this.el = el;
        this.duration = durationMs;
        this.timer = null;
    }

    show(message, variant = 'success') {
        this.el.textContent = message;
        this.el.dataset.variant = variant;
        this.el.classList.add(CSS_CLASS.VISIBLE);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.el.classList.remove(CSS_CLASS.VISIBLE), this.duration);
    }
}


/* =============================================================================
 * BlockRenderer: cada tipo de bloco vira HTML
 * Para criar um tipo novo: adicione em this.renderers e crie o método.
 * ========================================================================== */
class BlockRenderer {
    constructor(config) {
        this.codeConfig = config.CODE;
        this.copyConfig = config.COPY;
        this.callouts = config.CALLOUTS;
        this.labels = config.LABELS;
        this.highlightEnabled = config.HIGHLIGHT.ENABLED;

        this.renderers = {
            code: (b) => this.code(b),
            text: (b) => this.text(b),
            list: (b) => this.list(b),
            table: (b) => this.table(b),
            tip: (b) => this.callout('tip', b),
            warn: (b) => this.callout('warn', b),
            when: (b) => this.callout('when', b),
        };
    }

    render(block) {
        const renderer = this.renderers[block.type];
        if (!renderer) {
            console.warn(`Tipo de bloco desconhecido: "${block.type}"`);
            return '';
        }
        return renderer(block);
    }

    copyButtonHtml(done = false) {
        const icon = done ? ICON.CHECK : ICON.COPY;
        const label = done ? this.copyConfig.DONE_TEXT : this.copyConfig.BUTTON_TEXT;
        return `${icon}<span>${Utils.escapeHtml(label)}</span>`;
    }

    langLabel(lang) {
        const { SHOW_LANG_LABEL, HIDE_DEFAULT_LANG_LABEL, DEFAULT_LANG, LANG_LABELS } = this.codeConfig;
        if (!SHOW_LANG_LABEL || (HIDE_DEFAULT_LANG_LABEL && lang === DEFAULT_LANG)) return '';
        return `<span class="code-lang">${Utils.escapeHtml(LANG_LABELS[lang] || lang)}</span>`;
    }

    code(block) {
        const lang = block.lang || this.codeConfig.DEFAULT_LANG;
        const title = block.title || this.codeConfig.DEFAULT_TITLE;
        const source = Utils.escapeHtml(Utils.dedent(block.code));
        const highlight = this.highlightEnabled && lang !== 'plaintext';
        const hasOutput = this.codeConfig.SHOW_OUTPUT && block.output != null;

        const output = hasOutput
            ? `<div class="code-output"><div class="code-output-label">${Utils.escapeHtml(this.labels.OUTPUT)}</div><pre><samp>${Utils.escapeHtml(Utils.trimLines(block.output))}</samp></pre></div>`
            : '';

        return `
<figure class="code-block">
    <figcaption class="code-head">
        <span class="code-title">${Utils.inline(title)}</span>
        ${this.langLabel(lang)}
        <button type="button" class="btn-copy" data-action="${ACTION.COPY_CODE}" aria-label="${Utils.escapeHtml(this.labels.COPY_ARIA)}: ${Utils.escapeHtml(title)}">${this.copyButtonHtml()}</button>
    </figcaption>
    <pre><code class="language-${lang}" data-highlight="${highlight}">${source}</code></pre>
    ${output}
</figure>`;
    }

    text(block) {
        return `<p>${Utils.inline(block.text)}</p>`;
    }

    list(block) {
        return `<ul class="topic-list">${block.items.map((item) => `<li>${Utils.inline(item)}</li>`).join('')}</ul>`;
    }

    table(block) {
        const head = block.head.map((h) => `<th scope="col">${Utils.inline(h)}</th>`).join('');
        const rows = block.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${Utils.inline(cell)}</td>`).join('')}</tr>`)
            .join('');
        return `<div class="table-wrap"><table class="table table-sm topic-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    }

    callout(kind, block) {
        const { LABEL, ICON: emoji } = this.callouts[kind];
        return `
<div class="callout callout-${kind}" role="note">
    <span class="callout-icon" aria-hidden="true">${emoji}</span>
    <div><strong>${Utils.escapeHtml(LABEL)}:</strong> ${Utils.inline(block.text)}</div>
</div>`;
    }
}


/* =============================================================================
 * ContentRenderer: categorias e tópicos
 * ========================================================================== */
class ContentRenderer {
    constructor(config, blockRenderer) {
        this.levels = config.LEVELS.ITEMS;
        this.labels = config.LABELS;
        this.blocks = blockRenderer;
    }

    render(categories) {
        return categories.map((category, index) => this.category(category, index)).join('');
    }

    category(category, index) {
        return `
<section class="category" id="${category.id}" data-category="${category.id}" aria-labelledby="${category.id}-title">
    <header class="category-head">
        <span class="category-icon" aria-hidden="true">${category.icon}</span>
        <div>
            <h2 id="${category.id}-title"><span class="category-num">${index + 1}.</span> ${Utils.escapeHtml(category.title)}</h2>
            <p>${Utils.inline(category.description)}</p>
        </div>
    </header>
    ${category.topics.map((topic) => this.topic(topic)).join('')}
</section>`;
    }

    topic(topic) {
        const level = this.levels[topic.level];
        const summary = topic.summary ? `<p class="topic-summary">${Utils.inline(topic.summary)}</p>` : '';
        return `
<article class="topic" id="${topic.id}" data-topic="${topic.id}" data-level="${topic.level}" aria-labelledby="${topic.id}-title">
    <header class="topic-head">
        <h3 id="${topic.id}-title">${Utils.escapeHtml(topic.title)}</h3>
        <span class="level-badge level-${topic.level}">${Utils.escapeHtml(level ? level.LABEL : topic.level)}</span>
        <a class="topic-anchor" href="#${topic.id}" data-action="${ACTION.COPY_LINK}" title="${Utils.escapeHtml(this.labels.COPY_LINK)}" aria-label="${Utils.escapeHtml(this.labels.COPY_LINK)}">${ICON.LINK}</a>
    </header>
    ${summary}
    ${topic.blocks.map((block) => this.blocks.render(block)).join('')}
</article>`;
    }
}


/* =============================================================================
 * SearchEngine: busca por palavras (todas as palavras precisam aparecer)
 * ========================================================================== */
class SearchEngine {
    constructor(categories, searchConfig) {
        this.cfg = searchConfig;
        this.entries = this.build(categories);
    }

    prepare(text) {
        return this.cfg.IGNORE_ACCENTS ? Utils.normalize(text) : String(text).toLowerCase();
    }

    build(categories) {
        const entries = [];
        categories.forEach((category) => {
            category.topics.forEach((topic) => {
                const parts = [topic.title, topic.summary, category.title, category.description, ...(topic.tags || [])];
                topic.blocks.forEach((block) => {
                    parts.push(block.title, block.text, ...(block.items || []), ...(block.head || []));
                    (block.rows || []).forEach((row) => parts.push(...row));
                    if (this.cfg.SEARCH_IN_CODE) parts.push(block.code);
                });
                entries.push({ id: topic.id, haystack: this.prepare(parts.filter(Boolean).join(' ')) });
            });
        });
        return entries;
    }

    /** Devolve um Set com os ids encontrados, ou null quando não há busca. */
    query(text) {
        const clean = String(text || '').trim();
        if (clean.length < this.cfg.MIN_CHARS) return null;
        const terms = this.prepare(clean).split(/\s+/).filter(Boolean);
        return new Set(
            this.entries
                .filter((entry) => terms.every((term) => entry.haystack.includes(term)))
                .map((entry) => entry.id),
        );
    }
}


/* =============================================================================
 * Sidebar: índice lateral
 * ========================================================================== */
class Sidebar {
    constructor(config, categories, { root, toc, menuButton }) {
        this.cfg = config.SIDEBAR;
        this.labels = config.LABELS;
        this.categories = categories;
        this.root = root;
        this.toc = toc;
        this.menuButton = menuButton;
        this.activeId = null;
        this.searching = false;
    }

    render() {
        this.toc.innerHTML = this.categories.map((c, i) => this.groupHtml(c, i)).join('');

        this.groups = new Map([...this.toc.querySelectorAll(SELECTOR.CATEGORY)].map((g) => [g.dataset.category, g]));
        this.items = new Map([...this.toc.querySelectorAll(SELECTOR.TOPIC)].map((li) => [li.dataset.topic, li]));
        this.links = new Map([...this.items].map(([id, li]) => [id, li.querySelector('a')]));
        this.topicsByCategory = new Map(this.categories.map((c) => [c.id, c.topics.map((t) => t.id)]));

        if (this.cfg.OPEN_FIRST && this.categories.length) this.toggle(this.categories[0].id, true);
    }

    groupHtml(category, index) {
        const count = this.cfg.SHOW_COUNTS ? `<span class="toc-count">${category.topics.length}</span>` : '';
        const topics = category.topics.map((topic) => {
            const dot = topic.level === this.cfg.MARK_LEVEL
                ? `<span class="level-dot" title="${Utils.escapeHtml(this.labels.LEVEL_DOT)}"></span>`
                : '';
            return `<li data-topic="${topic.id}"><a class="toc-link" href="#${topic.id}" data-action="${ACTION.GO_TO}" data-target="${topic.id}">${Utils.escapeHtml(topic.title)}${dot}</a></li>`;
        }).join('');

        return `
<div class="toc-group" data-category="${category.id}">
    <button type="button" class="toc-category" data-action="${ACTION.TOGGLE_CATEGORY}" aria-expanded="false" aria-controls="toc-${category.id}">
        <span class="toc-icon" aria-hidden="true">${category.icon}</span>
        <span class="toc-title">${index + 1}. ${Utils.escapeHtml(category.title)}</span>
        ${count}
        <span class="toc-chevron">${ICON.CHEVRON}</span>
    </button>
    <ul class="toc-topics" id="toc-${category.id}">${topics}</ul>
</div>`;
    }

    setOpen(group, open) {
        group.classList.toggle(CSS_CLASS.OPEN, open);
        group.querySelector('.toc-category').setAttribute('aria-expanded', String(open));
    }

    toggle(categoryId, force = null) {
        const group = this.groups.get(categoryId);
        if (!group) return;
        const open = force ?? !group.classList.contains(CSS_CLASS.OPEN);
        if (open && this.cfg.ACCORDION && !this.searching) {
            this.groups.forEach((other, id) => id !== categoryId && this.setOpen(other, false));
        }
        this.setOpen(group, open);
    }

    categoryOf(topicId) {
        return this.links.get(topicId)?.closest(SELECTOR.CATEGORY)?.dataset.category ?? null;
    }

    setActive(topicId) {
        if (topicId === this.activeId) return;
        const previous = this.links.get(this.activeId);
        if (previous) {
            previous.classList.remove(CSS_CLASS.ACTIVE);
            previous.removeAttribute('aria-current');
        }
        const link = this.links.get(topicId);
        if (!link) return;
        this.activeId = topicId;
        link.classList.add(CSS_CLASS.ACTIVE);
        link.setAttribute('aria-current', 'location');

        const group = this.groups.get(this.categoryOf(topicId));
        if (!this.searching && group && !group.classList.contains(CSS_CLASS.OPEN)) {
            this.toggle(group.dataset.category, true);
        }
        this.reveal(link);
    }

    /** Rola só o índice (nunca a página) para mostrar o link ativo. */
    reveal(link) {
        const box = this.root;
        const top = link.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop;
        const margin = 48;
        if (top < box.scrollTop + margin || top > box.scrollTop + box.clientHeight - margin) {
            box.scrollTop = Math.max(0, top - box.clientHeight / 3);
        }
    }

    applyFilter(visibleIds, searching) {
        const wasSearching = this.searching;
        this.searching = searching;

        this.items.forEach((li, id) => li.classList.toggle(CSS_CLASS.HIDDEN, !visibleIds.has(id)));

        this.groups.forEach((group, categoryId) => {
            const visible = this.topicsByCategory.get(categoryId).filter((id) => visibleIds.has(id)).length;
            group.classList.toggle(CSS_CLASS.HIDDEN, visible === 0);
            const counter = group.querySelector('.toc-count');
            if (counter) counter.textContent = visible;
            if (searching) this.setOpen(group, visible > 0);
        });

        if (wasSearching && !searching) this.restoreAccordion();
    }

    restoreAccordion() {
        const activeCategory = this.categoryOf(this.activeId) ?? this.categories[0]?.id;
        if (!this.cfg.ACCORDION) return;
        this.groups.forEach((group, id) => this.setOpen(group, id === activeCategory));
    }

    toggleMobile(force = null) {
        const open = force ?? !document.body.classList.contains(CSS_CLASS.SIDEBAR_OPEN);
        document.body.classList.toggle(CSS_CLASS.SIDEBAR_OPEN, open);
        this.menuButton.setAttribute('aria-expanded', String(open));
    }

    closeMobile() {
        this.toggleMobile(false);
    }
}


/* =============================================================================
 * ScrollSpy: descobre qual tópico está no topo da tela
 * ========================================================================== */
class ScrollSpy {
    constructor(offsetPx, onChange) {
        this.offset = offsetPx;
        this.onChange = onChange;
        this.elements = [];
        this.current = null;
        this.pinnedUntil = 0;
    }

    observe(elements) {
        this.elements = elements;
        this.update();
    }

    /** Depois de um clique no índice, segura o tópico escolhido por um tempo
        (perto do fim da página o navegador não consegue rolar até ele). */
    pin(id, ms = 1500) {
        this.current = id;
        this.pinnedUntil = performance.now() + ms;
    }

    /** O aluno mexeu na rolagem: volta a acompanhar normalmente. */
    unpin() {
        this.pinnedUntil = 0;
    }

    update() {
        if (performance.now() < this.pinnedUntil) return;
        let found = null;
        for (const el of this.elements) {
            if (el.offsetParent === null) continue;                 // escondido pelo filtro
            if (el.getBoundingClientRect().top - this.offset <= 8) found = el;
            else if (found) break;
        }
        if (!found) found = this.elements.find((el) => el.offsetParent !== null) ?? null;
        if (found && found.id !== this.current) {
            this.current = found.id;
            this.onChange(found.id);
        }
    }
}


/* =============================================================================
 * App: junta tudo
 * ========================================================================== */
class App {
    constructor(config, content) {
        this.cfg = config;
        this.content = content;

        this.store = new Store(config.STORAGE);
        this.theme = new ThemeManager(config.THEME, this.store, config.STORAGE.KEYS.THEME);
        this.highlighter = new Highlighter(config.HIGHLIGHT);
        this.renderer = new ContentRenderer(config, new BlockRenderer(config));
        this.searchEngine = new SearchEngine(content, config.SEARCH);
        this.copyTimers = new WeakMap();

        const savedLevel = this.store.get(config.STORAGE.KEYS.LEVEL, config.LEVELS.ALL_ID);
        this.state = {
            query: '',
            level: this.isValidLevel(savedLevel) ? savedLevel : config.LEVELS.ALL_ID,
        };
    }

    $(id) {
        return document.getElementById(id);
    }

    isValidLevel(level) {
        return level === this.cfg.LEVELS.ALL_ID || level in this.cfg.LEVELS.ITEMS;
    }

    /* ---------------------------------------------------------------- início */
    async start() {
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
        this.applyCssVars();
        this.loadFonts();
        const themeReady = AssetLoader.withTimeout(this.theme.apply(), this.cfg.THEME.LOAD_TIMEOUT_MS);

        this.fillStaticTexts();
        this.renderContent();
        this.renderShortcuts();
        this.renderLevelFilter();
        this.theme.mountSelect(
            this.$(DOM_ID.THEME_SELECT),
            this.$(DOM_ID.THEME_PICKER),
            this.$(DOM_ID.THEME_LABEL),
            this.cfg.LABELS.THEME,
        );

        this.sidebar = new Sidebar(this.cfg, this.content, {
            root: this.$(DOM_ID.SIDEBAR),
            toc: this.$(DOM_ID.TOC),
            menuButton: this.$(DOM_ID.MENU_BTN),
        });
        this.sidebar.render();
        this.toast = new Toast(this.$(DOM_ID.TOAST), this.cfg.TOAST.DURATION_MS);

        this.bindEvents();
        this.applyFilters();
        this.startScrollSpy();

        await themeReady;
        document.documentElement.classList.remove(CSS_CLASS.LOADING);
        this.goToHash(false);

        if (await this.highlighter.load()) this.highlighter.highlight(this.$(DOM_ID.CONTENT));
    }

    applyCssVars() {
        const { COLORS, LAYOUT, FONTS, CODE, SCROLL } = this.cfg;
        const vars = {
            '--accent': COLORS.ACCENT,
            '--accent-text': COLORS.ACCENT_TEXT,
            '--code-bg': COLORS.CODE_BG,
            '--output-bg': COLORS.OUTPUT_BG,
            '--nav-h': LAYOUT.NAVBAR_HEIGHT,
            '--sidebar-w': LAYOUT.SIDEBAR_WIDTH,
            '--content-max': LAYOUT.CONTENT_MAX_WIDTH,
            '--font-body': FONTS.BODY,
            '--font-code': FONTS.CODE,
            '--tab-size': String(CODE.TAB_SIZE),
            '--scroll-gap': `${SCROLL.OFFSET_PX}px`,
        };
        Object.entries(vars).forEach(([name, value]) => document.documentElement.style.setProperty(name, value));
    }

    loadFonts() {
        const { ENABLED, URL } = this.cfg.FONTS;
        if (ENABLED && URL) AssetLoader.style(URL, { id: DOM_ID.FONTS_LINK });
    }

    fillStaticTexts() {
        const { SITE, LABELS, SEARCH } = this.cfg;
        const key = `<kbd>${Utils.escapeHtml(SEARCH.FOCUS_KEY)}</kbd>`;

        document.title = SITE.PAGE_TITLE;
        document.documentElement.lang = SITE.LANG;

        this.$(DOM_ID.SKIP_LINK).textContent = LABELS.SKIP_LINK;
        this.$(DOM_ID.BRAND_ICON).textContent = SITE.BRAND_ICON;
        this.$(DOM_ID.BRAND_TEXT).textContent = SITE.BRAND_TEXT;
        this.$(DOM_ID.MENU_BTN).setAttribute('aria-label', LABELS.MENU_OPEN);
        this.$(DOM_ID.HERO_TITLE).textContent = SITE.HERO_TITLE;
        this.$(DOM_ID.HERO_SUBTITLE).textContent = SITE.HERO_SUBTITLE;
        this.$(DOM_ID.HERO_HINT).innerHTML = Utils.escapeHtml(LABELS.HERO_HINT).replace('{key}', key);
        this.$(DOM_ID.FOOTER).textContent = SITE.FOOTER;
        this.$(DOM_ID.BACK_TO_TOP).setAttribute('aria-label', LABELS.BACK_TO_TOP);
        this.$(DOM_ID.EMPTY_HINT).textContent = LABELS.NO_RESULTS_HINT;
        this.$(DOM_ID.SEARCH_KBD).textContent = SEARCH.FOCUS_KEY;

        const search = this.$(DOM_ID.SEARCH);
        search.placeholder = LABELS.SEARCH_PLACEHOLDER;
        search.setAttribute('aria-label', LABELS.SEARCH_ARIA);
        this.$(DOM_ID.SEARCH_CLEAR).setAttribute('aria-label', LABELS.SEARCH_CLEAR);
    }

    /* ------------------------------------------------------------ renderização */
    renderContent() {
        const container = this.$(DOM_ID.CONTENT);
        container.innerHTML = this.renderer.render(this.content);
        this.topicEls = [...container.querySelectorAll(SELECTOR.TOPIC)];
        this.categoryEls = [...container.querySelectorAll(SELECTOR.CATEGORY)].map((section) => ({
            section,
            topics: [...section.querySelectorAll(SELECTOR.TOPIC)],
        }));
    }

    renderShortcuts() {
        const { LABELS } = this.cfg;
        this.$(DOM_ID.SHORTCUTS).innerHTML = this.content.map((category, index) => `
<button type="button" class="shortcut" data-action="${ACTION.GO_TO}" data-target="${category.id}">
    <span class="shortcut-icon" aria-hidden="true">${category.icon}</span>
    <span class="shortcut-text">
        <span class="shortcut-title">${index + 1}. ${Utils.escapeHtml(category.title)}</span>
        <span class="shortcut-meta">${Utils.format(LABELS.TOPICS_COUNT, { n: category.topics.length })}</span>
    </span>
</button>`).join('');
    }

    renderLevelFilter() {
        const { ALL_ID, ALL_LABEL, ITEMS } = this.cfg.LEVELS;
        const options = [[ALL_ID, ALL_LABEL], ...Object.entries(ITEMS).map(([id, item]) => [id, item.LABEL])];
        const el = this.$(DOM_ID.LEVEL_FILTER);
        el.setAttribute('aria-label', this.cfg.LABELS.LEVEL_FILTER);
        el.innerHTML = options.map(([id, label]) => `
<input type="radio" class="btn-check" name="level" id="level-${id}" value="${id}" autocomplete="off"${id === this.state.level ? ' checked' : ''}>
<label class="btn btn-sm btn-outline-secondary" for="level-${id}">${Utils.escapeHtml(label)}</label>`).join('');
    }

    /* ---------------------------------------------------------------- eventos */
    bindEvents() {
        const search = this.$(DOM_ID.SEARCH);
        const onSearch = Utils.debounce(() => this.setQuery(search.value), this.cfg.SEARCH.DEBOUNCE_MS);

        search.addEventListener('input', () => {
            this.$(DOM_ID.SEARCH_CLEAR).classList.toggle(CSS_CLASS.HIDDEN, !search.value);
            onSearch();
        });
        search.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.clearFilters({ keepLevel: true });
                search.blur();
            }
            if (event.key === 'Enter') {
                search.blur();
                this.goToFirstVisible();
            }
        });

        this.$(DOM_ID.LEVEL_FILTER).addEventListener('change', (event) => this.setLevel(event.target.value));
        this.$(DOM_ID.MENU_BTN).addEventListener('click', () => this.sidebar.toggleMobile());
        this.$(DOM_ID.BACKDROP).addEventListener('click', () => this.sidebar.closeMobile());

        document.addEventListener('click', (event) => this.onClick(event));
        document.addEventListener('keydown', (event) => this.onGlobalKey(event));
        window.addEventListener('scroll', Utils.throttleFrame(() => this.onScroll()), { passive: true });
        ['wheel', 'touchstart'].forEach((type) => {
            window.addEventListener(type, () => this.spy?.unpin(), { passive: true });
        });
        window.addEventListener('hashchange', () => {
            this.sidebar.closeMobile();
            this.goToHash(true);
        });
    }

    onClick(event) {
        const target = event.target.closest(SELECTOR.ACTION);
        if (!target) return;

        switch (target.dataset.action) {
            case ACTION.COPY_CODE:
                this.copyCode(target);
                break;
            case ACTION.COPY_LINK:
                event.preventDefault();
                this.copyLink(target.closest(SELECTOR.TOPIC).id);
                break;
            case ACTION.TOGGLE_CATEGORY:
                this.sidebar.toggle(target.closest(SELECTOR.CATEGORY).dataset.category);
                break;
            case ACTION.GO_TO:
                event.preventDefault();
                this.goTo(target.dataset.target);
                this.sidebar.closeMobile();
                break;
            case ACTION.CLEAR_FILTERS:
                this.clearFilters();
                this.$(DOM_ID.SEARCH).focus();
                break;
            case ACTION.HOME:
                event.preventDefault();
                this.clearFilters();
                this.scrollToTop();
                break;
            case ACTION.BACK_TO_TOP:
                this.scrollToTop();
                break;
            default:
                break;
        }
    }

    onGlobalKey(event) {
        const { FOCUS_KEY, CTRL_K } = this.cfg.SEARCH;
        const isCtrlK = CTRL_K && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
        if (isCtrlK || (event.key === FOCUS_KEY && !Utils.isTyping())) {
            event.preventDefault();
            const search = this.$(DOM_ID.SEARCH);
            search.focus();
            search.select();
            return;
        }
        if (event.key === 'Escape') this.sidebar.closeMobile();
    }

    onScroll() {
        const show = window.scrollY > this.cfg.SCROLL.BACK_TO_TOP_AFTER_PX;
        this.$(DOM_ID.BACK_TO_TOP).classList.toggle(CSS_CLASS.VISIBLE, show);
        this.spy?.update();
    }

    /* ----------------------------------------------------------------- filtros */
    setQuery(query) {
        const previous = this.state.query;
        this.state.query = query.trim();
        if (this.state.query === previous) return;
        this.applyFilters();
        if (this.cfg.SEARCH.SCROLL_TOP_ON_SEARCH) window.scrollTo({ top: 0, behavior: 'instant' });
    }

    setLevel(level) {
        if (!this.isValidLevel(level)) return;
        this.state.level = level;
        this.store.set(this.cfg.STORAGE.KEYS.LEVEL, level);
        this.applyFilters();
    }

    clearFilters({ keepLevel = false } = {}) {
        const search = this.$(DOM_ID.SEARCH);
        search.value = '';
        this.$(DOM_ID.SEARCH_CLEAR).classList.add(CSS_CLASS.HIDDEN);
        this.state.query = '';
        if (!keepLevel) {
            const allId = this.cfg.LEVELS.ALL_ID;
            this.$(`level-${allId}`).checked = true;
            this.state.level = allId;
            this.store.set(this.cfg.STORAGE.KEYS.LEVEL, allId);
        }
        this.applyFilters();
    }

    applyFilters() {
        const { query, level } = this.state;
        const allId = this.cfg.LEVELS.ALL_ID;
        const matches = this.searchEngine.query(query);
        const searching = matches !== null;
        const visible = new Set();

        this.topicEls.forEach((el) => {
            const show = (level === allId || el.dataset.level === level) && (!searching || matches.has(el.id));
            el.classList.toggle(CSS_CLASS.HIDDEN, !show);
            if (show) visible.add(el.id);
        });

        this.categoryEls.forEach(({ section, topics }) => {
            section.classList.toggle(CSS_CLASS.HIDDEN, !topics.some((t) => visible.has(t.id)));
        });

        this.sidebar.applyFilter(visible, searching);
        this.updateStatus(visible.size, searching);
        this.spy?.update();
    }

    updateStatus(count, searching) {
        const { LABELS, LEVELS, SEARCH } = this.cfg;
        const levelFiltered = this.state.level !== LEVELS.ALL_ID;
        const q = this.state.query;

        this.$(DOM_ID.HERO).classList.toggle(CSS_CLASS.HIDDEN, searching && SEARCH.HIDE_HERO_WHILE_SEARCHING);
        this.$(DOM_ID.EMPTY).classList.toggle(CSS_CLASS.HIDDEN, count > 0);
        this.$(DOM_ID.STATUS).classList.toggle(CSS_CLASS.HIDDEN, count === 0 || (!searching && !levelFiltered));

        const buttonLabel = searching ? LABELS.CLEAR_SEARCH : LABELS.SHOW_ALL;
        this.$(DOM_ID.STATUS_BTN).textContent = buttonLabel;
        this.$(DOM_ID.EMPTY_BTN).textContent = buttonLabel;

        if (count === 0) {
            this.$(DOM_ID.EMPTY_TITLE).textContent = Utils.format(LABELS.NO_RESULTS, { q });
            return;
        }

        const text = searching
            ? Utils.format(count === 1 ? LABELS.RESULTS_ONE : LABELS.RESULTS_MANY, { n: count, q })
            : Utils.format(LABELS.LEVEL_ONLY, { level: LEVELS.ITEMS[this.state.level]?.LABEL ?? '', n: count });
        this.$(DOM_ID.STATUS_TEXT).textContent = text;
    }

    /* ---------------------------------------------------------------- rolagem */
    /** 'instant' ignora o scroll-behavior: smooth que o Bootstrap liga por padrão. */
    scrollBehavior(smooth = true) {
        return smooth && this.cfg.SCROLL.SMOOTH && !Utils.prefersReducedMotion() ? 'smooth' : 'instant';
    }

    goTo(id, smooth = true) {
        let el = document.getElementById(id);
        if (!el) return;
        if (el.closest(`.${CSS_CLASS.HIDDEN}`) || el.classList.contains(CSS_CLASS.HIDDEN)) {
            this.clearFilters();
            el = document.getElementById(id);
        }
        el.scrollIntoView({ behavior: this.scrollBehavior(smooth), block: 'start' });
        if (el.matches(SELECTOR.TOPIC)) {
            this.spy?.pin(id);
            this.sidebar.setActive(id);
        }
        if (location.hash !== `#${id}`) Utils.replaceUrl(`#${id}`);
    }

    goToHash(smooth) {
        const id = decodeURIComponent(location.hash.slice(1));
        if (id) this.goTo(id, smooth);
    }

    goToFirstVisible() {
        const first = this.topicEls.find((el) => !el.classList.contains(CSS_CLASS.HIDDEN));
        if (first) this.goTo(first.id);
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: this.scrollBehavior() });
        Utils.replaceUrl(location.pathname + location.search);
    }

    startScrollSpy() {
        if (!this.cfg.SIDEBAR.FOLLOW_SCROLL) return;
        const offset = parseInt(this.cfg.LAYOUT.NAVBAR_HEIGHT, 10) + this.cfg.SCROLL.OFFSET_PX;
        this.spy = new ScrollSpy(offset, (id) => this.sidebar.setActive(id));
        this.spy.observe(this.topicEls);
    }

    /* ---------------------------------------------------------------- copiar */
    async copyCode(button) {
        const code = button.closest(SELECTOR.CODE_BLOCK).querySelector(SELECTOR.CODE).textContent;
        const ok = await ClipboardService.copy(code);
        const { COPY, LABELS } = this.cfg;

        if (!ok) {
            this.toast.show(LABELS.COPY_FAILED, 'error');
            return;
        }

        const renderer = this.renderer.blocks;
        button.classList.add(CSS_CLASS.COPIED);
        button.innerHTML = renderer.copyButtonHtml(true);
        clearTimeout(this.copyTimers.get(button));
        this.copyTimers.set(button, setTimeout(() => {
            button.classList.remove(CSS_CLASS.COPIED);
            button.innerHTML = renderer.copyButtonHtml(false);
        }, COPY.RESET_MS));

        if (COPY.SHOW_TOAST) this.toast.show(LABELS.CODE_COPIED);
    }

    async copyLink(topicId) {
        const url = `${location.href.split('#')[0]}#${topicId}`;
        this.goTo(topicId);
        const ok = await ClipboardService.copy(url);
        this.toast.show(ok ? this.cfg.LABELS.LINK_COPIED : this.cfg.LABELS.COPY_FAILED, ok ? 'success' : 'error');
    }
}


/* -----------------------------------------------------------------------------
 * Inicialização
 * -------------------------------------------------------------------------- */
const bootApp = () => new App(CONFIG, CONTENT).start();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
