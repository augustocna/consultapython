/* =============================================================================
 *  CONFIG.JS  -  Todas as configurações do site em um lugar só
 * -----------------------------------------------------------------------------
 *  Mude os valores aqui para personalizar o site sem mexer no app.js.
 *  Ordem de carregamento no HTML:  config.js  ->  content.js  ->  app.js
 * ============================================================================= */

'use strict';

/* Congela o objeto inteiro (inclusive os objetos de dentro), para que a
   configuração não seja alterada sem querer enquanto o site roda. */
const deepFreeze = (obj) => {
    Object.values(obj).forEach((value) => {
        if (value && typeof value === 'object') deepFreeze(value);
    });
    return Object.freeze(obj);
};

const CONFIG = deepFreeze({

    /* -------------------------------------------------------------------------
     * SITE: textos gerais
     * ---------------------------------------------------------------------- */
    SITE: {
        LANG: 'pt-BR',
        PAGE_TITLE: 'Consulta-Python | Guia de consulta',
        BRAND_ICON: '🐍',
        BRAND_TEXT: 'Consulta-Python',
        HERO_TITLE: 'Consulta-Python',
        HERO_SUBTITLE: 'Do básico ao intermediário, com exemplos prontos para copiar e testar.',
        FOOTER: 'CNA - Tecnologia e Inovação.',
    },

    /* -------------------------------------------------------------------------
     * THEME: tema do Bootswatch
     * -------------------------------------------------------------------------
     * O tema é carregado pelo CDN. Para usar um arquivo local:
     *   1. Baixe o CSS (abra o link do CDN_URL no navegador e salve).
     *   2. Coloque em css/bootswatch/slate.min.css (por exemplo).
     *   3. Preencha LOCAL_PATH: 'css/bootswatch/{theme}.min.css'
     * Com LOCAL_PATH preenchido, o CDN é ignorado. {theme} vira o ID do tema.
     * ---------------------------------------------------------------------- */
    THEME: {
        DEFAULT: 'slate',
        VERSION: '5.3.3',
        CDN_URL: 'https://cdn.jsdelivr.net/npm/bootswatch@{version}/dist/{theme}/bootstrap.min.css',
        LOCAL_PATH: '',
        ALLOW_SWITCH: true,             // mostra o seletor de tema no índice
        LOAD_TIMEOUT_MS: 4000,          // tempo máximo esperando o tema carregar
        OPTIONS: [
            { ID: 'slate',     LABEL: 'Slate (cinza grafite)' },
            { ID: 'solar',     LABEL: 'Solar (azul petróleo)' },
            { ID: 'quartz',    LABEL: 'Quartz (vidro colorido)' },
            { ID: 'darkly',    LABEL: 'Darkly (escuro neutro)' },
            { ID: 'cyborg',    LABEL: 'Cyborg (preto e azul)' },
            { ID: 'superhero', LABEL: 'Superhero (azul marinho)' },
        ],
    },

    /* -------------------------------------------------------------------------
     * FONTS: fontes do texto e do código
     * Atkinson Hyperlegible foi feita para máxima legibilidade.
     * ---------------------------------------------------------------------- */
    FONTS: {
        ENABLED: true,                  // false = não baixa nada, usa as do sistema
        URL: 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&display=swap',
        BODY: "'Roboto Mono', Consolas, system-ui, -apple-system, monospace",
        CODE: "Consolas, ui-monospace, monospace",
    },

    /* -------------------------------------------------------------------------
     * COLORS: cores próprias do site (o resto vem do tema)
     * ---------------------------------------------------------------------- */
    COLORS: {
        ACCENT: '#ffd43b',              // amarelo do logo do Python
        ACCENT_TEXT: '#1c1e22',         // texto sobre o amarelo
        CODE_BG: '#1d2024',             // fundo dos blocos de código
        OUTPUT_BG: '#16181b',           // fundo da "Saída"
    },

    /* -------------------------------------------------------------------------
     * LAYOUT: medidas principais
     * ---------------------------------------------------------------------- */
    LAYOUT: {
        NAVBAR_HEIGHT: '64px',
        SIDEBAR_WIDTH: '320px',
        CONTENT_MAX_WIDTH: '880px',
    },

    /* -------------------------------------------------------------------------
     * HIGHLIGHT: cores no código (highlight.js)
     * ---------------------------------------------------------------------- */
    HIGHLIGHT: {
        ENABLED: true,
        SCRIPT_URL: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
        STYLE_URL: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
    },

    /* -------------------------------------------------------------------------
     * CODE: blocos de código
     * ---------------------------------------------------------------------- */
    CODE: {
        DEFAULT_LANG: 'python',
        DEFAULT_TITLE: 'Exemplo',
        SHOW_OUTPUT: true,              // mostra a caixa "Saída" quando existir
        SHOW_LANG_LABEL: true,          // mostra "Terminal", "JSON"... no topo
        HIDE_DEFAULT_LANG_LABEL: true,  // não mostra o rótulo quando é Python
        TAB_SIZE: 4,
        LANG_LABELS: {
            python: 'Python',
            bash: 'Terminal',
            json: 'JSON',
            plaintext: 'Texto',
        },
    },

    /* -------------------------------------------------------------------------
     * COPY: botão de copiar
     * ---------------------------------------------------------------------- */
    COPY: {
        BUTTON_TEXT: 'Copiar',
        DONE_TEXT: 'Copiado!',
        RESET_MS: 1600,                 // tempo até o botão voltar ao normal
        SHOW_TOAST: false,              // além do botão, mostra aviso no rodapé
    },

    /* -------------------------------------------------------------------------
     * SEARCH: campo de busca
     * ---------------------------------------------------------------------- */
    SEARCH: {
        MIN_CHARS: 2,                   // começa a filtrar a partir de N letras
        DEBOUNCE_MS: 120,               // espera o aluno parar de digitar
        IGNORE_ACCENTS: true,           // "funcao" encontra "função"
        SEARCH_IN_CODE: true,           // procura também dentro dos exemplos
        FOCUS_KEY: '/',                 // tecla que leva para a busca
        CTRL_K: true,                   // Ctrl + K também leva para a busca
        HIDE_HERO_WHILE_SEARCHING: true,
        SCROLL_TOP_ON_SEARCH: true,
    },

    /* -------------------------------------------------------------------------
     * LEVELS: níveis dos tópicos (o ID precisa bater com o content.js)
     * ---------------------------------------------------------------------- */
    LEVELS: {
        ALL_ID: 'todos',
        ALL_LABEL: 'Todos',
        ITEMS: {
            basico: { LABEL: 'Básico' },
            intermediario: { LABEL: 'Intermediário' },
        },
    },

    /* -------------------------------------------------------------------------
     * SIDEBAR: índice lateral
     * ---------------------------------------------------------------------- */
    SIDEBAR: {
        ACCORDION: true,                // abre uma categoria por vez
        OPEN_FIRST: true,               // começa com a primeira aberta
        FOLLOW_SCROLL: true,            // marca no índice o tópico na tela
        SHOW_COUNTS: true,              // mostra quantos tópicos tem
        MARK_LEVEL: 'intermediario',    // nível que ganha um pontinho no índice
    },

    /* -------------------------------------------------------------------------
     * CALLOUTS: caixas de dica, cuidado e quando usar
     * ---------------------------------------------------------------------- */
    CALLOUTS: {
        tip:  { LABEL: 'Dica',        ICON: '💡' },
        warn: { LABEL: 'Cuidado',     ICON: '⚠️' },
        when: { LABEL: 'Quando usar', ICON: '🎯' },
    },

    /* -------------------------------------------------------------------------
     * SCROLL: rolagem
     * ---------------------------------------------------------------------- */
    SCROLL: {
        SMOOTH: true,                   // respeita "reduzir movimento" do sistema
        OFFSET_PX: 16,                  // espaço extra abaixo da barra do topo
        BACK_TO_TOP_AFTER_PX: 500,      // mostra o botão "voltar ao topo"
    },

    /* -------------------------------------------------------------------------
     * TOAST: avisos rápidos
     * ---------------------------------------------------------------------- */
    TOAST: {
        DURATION_MS: 2200,
    },

    /* -------------------------------------------------------------------------
     * STORAGE: lembra o tema e o nível escolhidos
     * ---------------------------------------------------------------------- */
    STORAGE: {
        ENABLED: true,
        PREFIX: 'py-salva-vidas:',
        KEYS: {
            THEME: 'theme',
            LEVEL: 'level',
        },
    },

    /* -------------------------------------------------------------------------
     * LABELS: todos os textos da interface
     * {n}, {q} e {level} são trocados automaticamente
     * ---------------------------------------------------------------------- */
    LABELS: {
        SKIP_LINK: 'Pular para o conteúdo',
        MENU_OPEN: 'Abrir índice',
        SEARCH_PLACEHOLDER: 'Buscar: lista, json, classe, for...',
        SEARCH_ARIA: 'Buscar tópicos',
        SEARCH_CLEAR: 'Limpar busca',
        HERO_HINT: 'Aperte {key} para buscar de qualquer lugar da página.',
        TOPICS_COUNT: '{n} tópicos',
        LEVEL_FILTER: 'Filtrar por nível',
        THEME: 'Tema',
        OUTPUT: 'Saída',
        COPY_ARIA: 'Copiar código',
        COPY_LINK: 'Copiar link deste tópico',
        CODE_COPIED: 'Código copiado',
        LINK_COPIED: 'Link do tópico copiado',
        COPY_FAILED: 'Não deu para copiar. Selecione o código e use Ctrl + C.',
        RESULTS_ONE: '1 tópico encontrado para "{q}"',
        RESULTS_MANY: '{n} tópicos encontrados para "{q}"',
        LEVEL_ONLY: 'Mostrando só o nível {level}: {n} tópicos',
        CLEAR_SEARCH: 'Limpar busca',
        SHOW_ALL: 'Mostrar todos',
        NO_RESULTS: 'Nenhum tópico encontrado para "{q}"',
        NO_RESULTS_HINT: 'Tente uma palavra mais curta ou outra palavra, como lista, arquivo, erro ou classe.',
        BACK_TO_TOP: 'Voltar ao topo',
        LEVEL_DOT: 'Nível intermediário',
    },
});
