/**
 * snacky.js | A professional, zero-dependency snackbar library.
 * Version: 2.1.0
 * Created by: Mohammadreza Soltani

 */
const snacky = (() => {
    let isInitialized = false;
    const containerStore = {};
    const defaultConfig = {
        direction: 'ltr',
        type: 'info',
        position: 'bottomRight',
        icon: 'show',
        progressBar: 'hidden',
        autoHide: true,
        duration: 4000,
        wordHighlight: null,
        soundEffect: false,
        vibrate: false,

        // NEW: text behavior
        maxLines: 3,      // clamp lines for long text
        expandable: false // allow full expansion on click (optional)
    };

    const MAX_SNACKBARS = 5;

    const ICONS = {
        info: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="10" x2="12" y2="16" />
          <circle cx="12" cy="7.5" r="1" class="snacky-dot" />
        </svg>`,
        warning: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3L2 21h20L12 3z" />
          <line x1="12" y1="9" x2="12" y2="14" />
          <circle cx="12" cy="17" r="1" class="snacky-dot" />
        </svg>`,
        success: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>`,
        error: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="9" y1="9" x2="15" y2="15" />
          <line x1="15" y1="9" x2="9" y2="15" />
        </svg>`,
        cart: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 6h14l-2 9H9L7 6z" />
          <circle cx="10" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M5 4h2" />
        </svg>`,
        online: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 11l9-9 9 9" />
          <path d="M5 11v9h14v-9" />
          <path d="M10 20v-5h4v5" />
        </svg>`,
        offline: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line x1="4" y1="4" x2="20" y2="20" />
          <path d="M5 11l7-7 7 7" />
          <path d="M7 11v9h10v-9" />
        </svg>`,
        wishlist: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-4.35-9-8.5C1 8 3.5 5 7 5c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.5 0 6 3 4 7.5C19 16.65 12 21 12 21z" />
        </svg>`,
        favorite: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
        </svg>`,
        saved: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1z" />
        </svg>`,
        download: `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v10" />
          <path d="M8 9l4 4 4-4" />
          <rect x="4" y="17" width="16" height="4" rx="1" />
        </svg>`,
        loading: `
        <svg class="snacky-spinner" viewBox="0 0 50 50" aria-hidden="true">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
        </svg>`
    };

    function playNotif() {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    }

    const _injectCSS = () => {
        const style = document.createElement('style');
        style.id = 'snacky-library-styles';
        style.textContent = `
            :root{--snacky-bg:rgba(20,20,20,.92);--snacky-text:#f5f5f5;--snacky-muted:#d6d6d6}
            .snacky-container{position:fixed;z-index:9999;display:flex;flex-direction:column;pointer-events:none;gap:12px}
            .snacky-container.top-left{top:20px;left:20px;align-items:flex-start}
            .snacky-container.top-center{top:20px;left:50%;transform:translateX(-50%);align-items:center}
            .snacky-container.top-right{top:20px;right:20px;align-items:flex-end}
            .snacky-container.bottom-left{bottom:20px;left:20px;align-items:flex-start}
            .snacky-container.bottom-center{bottom:20px;left:50%;transform:translateX(-50%);align-items:center}
            .snacky-container.bottom-right{bottom:20px;right:20px;align-items:flex-end}

            .snacky-item{
                display:flex;background:var(--snacky-bg);color:var(--snacky-text);
                padding:14px 16px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.25);
                -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
                border:1px solid rgba(255,255,255,0.1);min-width:320px;max-width:480px;
                pointer-events:auto;opacity:0;position:relative;overflow:hidden;
                transform:translateY(12px) scale(.98);
                transition:transform .35s cubic-bezier(.2,1,.2,1),opacity .35s ease;
            }
            .snacky-item.show{opacity:1;transform:translateY(0) scale(1)}
            .snacky-item.hide{opacity:0;transform:translateY(12px) scale(.98)}

            .snacky-item[data-direction="rtl"]{flex-direction:row-reverse}

            .snacky-content{display:flex;align-items:flex-start;gap:12px;width:100%}

            .snacky-icon{
                flex-shrink:0;width:26px;height:26px;display:grid;place-items:center;
                margin-top:1px;
            }
            .snacky-item[data-direction="rtl"] .snacky-icon{margin-left:0;margin-right:0}

            .snacky-icon svg{width:100%;height:100%}
            .snacky-icon svg *{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
            .snacky-icon svg .snacky-dot{fill:currentColor;stroke:none}

            .snacky-item.info .snacky-icon{color:#58a6ff}
            .snacky-item.warning .snacky-icon{color:#e3b341}
            .snacky-item.success .snacky-icon{color:#56d364}
            .snacky-item.error .snacky-icon{color:#f85149}
            .snacky-item.cart .snacky-icon{color:#a371f7}
            .snacky-item.online .snacky-icon{color:#56d364}
            .snacky-item.offline .snacky-icon{color:#a0a0a0}
            .snacky-item.wishlist .snacky-icon{color:#db61a2}
            .snacky-item.favorite .snacky-icon{color:#f0d553}
            .snacky-item.saved .snacky-icon{color:#58a6ff}
            .snacky-item.download .snacky-icon{color:#58a6ff}
            .snacky-item.loading .snacky-icon{color:#a0a0a0}

            .snacky-message{
                font-weight:500;font-size:.96rem;line-height:1.55;color:var(--snacky-text);
                word-break:break-word;white-space:normal;overflow:hidden;flex-grow:1;min-width:0;
                display:-webkit-box;-webkit-box-orient:vertical;
            }
            .snacky-item[data-direction="rtl"] .snacky-message{text-align:right}

            .snacky-message strong{font-weight:700;color:#fff}

            .snacky-progress-bar{
                position:absolute;bottom:0;left:0;height:4px;width:100%;
                background:rgba(255,255,255,0.12);overflow:hidden;
            }
            .snacky-progress-bar::before{
                content:'';position:absolute;top:0;left:0;height:100%;width:100%;
                background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);
                animation:snacky-shine 1.5s infinite;
            }
            .snacky-progress-bar .snacky-progress-fill{
                height:100%;width:100%;background:rgba(255,255,255,0.35);
                transform-origin:left;animation:snacky-progress linear forwards;
            }

            @keyframes snacky-progress{from{transform:scaleX(1)}to{transform:scaleX(0)}}
            @keyframes snacky-shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
            @keyframes snacky-rotate{100%{transform:rotate(360deg)}}
            @keyframes snacky-dash{0%{stroke-dasharray:1,150;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-35}100%{stroke-dasharray:90,150;stroke-dashoffset:-124}}

            .snacky-spinner{animation:snacky-rotate 1.7s linear infinite}
            .snacky-spinner .path{stroke:currentColor;stroke-linecap:round;animation:snacky-dash 1.5s ease-in-out infinite}

            @media(max-width:768px){
                .snacky-container{left:10px!important;right:10px!important;width:auto!important;transform:none!important;align-items:stretch!important}
                .snacky-container[class*="top-"]{top:10px!important;bottom:auto!important}
                .snacky-container[class*="bottom-"]{bottom:10px!important;top:auto!important}
                .snacky-item{width:100%!important;min-width:unset!important;box-sizing:border-box!important}
            }
        `;
        document.head.appendChild(style);
    };

    const _createContainer = (position) => {
        if (containerStore[position]) return containerStore[position];
        const container = document.createElement('div');
        container.className = `snacky-container ${position.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        document.body.appendChild(container);
        containerStore[position] = container;
        return container;
    };

    const _hideAndRemove = (snackbar) => {
        snackbar.classList.add('hide');
        const cleanup = () => {
            const container = snackbar.parentElement;
            snackbar.remove();
            if (container && container.childElementCount === 0) {
                container.remove();
                for (const pos in containerStore) {
                    if (containerStore[pos] === container) delete containerStore[pos];
                }
            }
        };
        snackbar.addEventListener('transitionend', cleanup, { once: true });
        // fallback if transition doesn't fire
        setTimeout(cleanup, 450);
    };

    const _init = () => {
        if (isInitialized) return;
        _injectCSS();
        isInitialized = true;
    };

    const show = (message, options = {}) => {
        _init();
        const settings = { ...defaultConfig, ...options };

        const container = _createContainer(settings.position);
        if (container.childElementCount >= MAX_SNACKBARS) {
            const snackbarToRemove = settings.position.startsWith('top')
                ? container.lastElementChild
                : container.firstElementChild;
            _hideAndRemove(snackbarToRemove);
        }

        const snackbar = document.createElement('div');
        snackbar.className = `snacky-item ${settings.type}`;
        snackbar.setAttribute('data-direction', settings.direction);

        let content = `<div class="snacky-content">`;

        if (settings.icon === 'show') {
            content += `<div class="snacky-icon">${ICONS[settings.type] || ICONS.info}</div>`;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'snacky-message';
        if (settings.maxLines) {
            messageDiv.style.webkitLineClamp = settings.maxLines;
        }

        if (settings.wordHighlight) {
            const highlightWords = Array.isArray(settings.wordHighlight)
                ? settings.wordHighlight
                : [settings.wordHighlight];
            const regex = new RegExp(
                `(${highlightWords.join('|').replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`,
                'gi'
            );
            messageDiv.innerHTML = message.replace(regex, '<strong>$1</strong>');
        } else {
            messageDiv.textContent = message;
        }

        content += messageDiv.outerHTML + `</div>`;

        if (settings.progressBar === 'show' && settings.autoHide) {
            content += `
                <div class="snacky-progress-bar">
                    <div class="snacky-progress-fill" style="animation-duration:${settings.duration}ms;"></div>
                </div>
            `;
        }

        snackbar.innerHTML = content;

        if (settings.expandable) {
            snackbar.addEventListener('click', () => {
                const msg = snackbar.querySelector('.snacky-message');
                if (!msg) return;
                if (msg.style.webkitLineClamp === 'unset') {
                    msg.style.webkitLineClamp = settings.maxLines || 3;
                } else {
                    msg.style.webkitLineClamp = 'unset';
                }
            });
        }

        if (settings.position.startsWith('top')) container.prepend(snackbar);
        else container.appendChild(snackbar);

        if (settings.soundEffect) playNotif();
        if (settings.vibrate && 'vibrate' in navigator) navigator.vibrate(100);

        requestAnimationFrame(() => snackbar.classList.add('show'));

        if (settings.autoHide) {
            setTimeout(() => _hideAndRemove(snackbar), settings.duration);
        }
    };

    return { show };
})();
