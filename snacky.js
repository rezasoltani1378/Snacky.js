/**
 * snacky.js | A professional, zero-dependency snackbar library.
 * Version: 1.0.0
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
    };
    const MAX_SNACKBARS = 5;
    function playBeep() {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
}
    const ICONS = {info:`<svg viewBox="0 0 24 24"><path class="snacky-icon-path snacky-icon-circle" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path class="snacky-icon-path snacky-icon-dot" d="M12 8h.01"/><path class="snacky-icon-path snacky-icon-line" d="M12 11v5"/></svg>`,warning:`<svg viewBox="0 0 24 24"><path class="snacky-icon-path snacky-icon-triangle" d="M1 21h22L12 2 1 21z"/><path class="snacky-icon-path snacky-icon-dot" d="M12 18h.01"/><path class="snacky-icon-path snacky-icon-line" d="M12 9v6"/></svg>`,success:`<svg viewBox="0 0 24 24"><path class="snacky-icon-path snacky-icon-circle" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path class="snacky-icon-path snacky-icon-checkmark" d="m9 12 2 2 4-4"/></svg>`,error:`<svg viewBox="0 0 24 24"><path class="snacky-icon-path snacky-icon-circle" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path class="snacky-icon-path snacky-icon-cross-1" d="m15 9-6 6"/><path class="snacky-icon-path snacky-icon-cross-2" d="m9 9 6 6"/></svg>`,cart:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.21 9l-4.38-6.56a1 1 0 0 0-1.66 0L6.79 9H2a1 1 0 0 0 0 2h2.33l2.43 10.39a1 1 0 0 0 1 .61h9.48a1 1 0 0 0 1-.61L19.67 11H22a1 1 0 0 0 0-2h-4.79zm-4.64 0L12 7.74 11.43 9H7.93l2.12 9h3.9l2.12-9h-3.5z"/></svg>`,online:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="m21.48 11.13-9-9a.5.5 0 0 0-.7 0l-9 9a.5.5 0 0 0 .35.87H5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2.15a.5.5 0 0 0 .35-.87zM14 18h-4v-5h4v5z"/></svg>`,offline:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 4.7a1 1 0 0 0-1.4 0L12 10.59 6.1 4.7a1 1 0 0 0-1.4 1.4L10.59 12l-5.9 5.9a1 1 0 1 0 1.4 1.4L12 13.41l5.9 5.9a1 1 0 0 0 1.4-1.4L13.41 12l5.9-5.9a1 1 0 0 0 0-1.4z"/></svg>`,wishlist:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,favorite:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,saved:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>`,download:`<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13v4h-2v-4H8l4-4 4 4h-3z"/></svg>`,loading:`<svg class="snacky-spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle></svg>`};

        const _injectCSS = () => {
            const style = document.createElement('style');
            style.id = 'snacky-library-styles';
            style.textContent = `
                .snacky-container{position:fixed;z-index:9999;display:flex;flex-direction:column;pointer-events:none;gap:12px}
                .snacky-container.top-left{top:20px;left:20px;align-items:flex-start}
                .snacky-container.top-center{top:20px;left:50%;transform:translateX(-50%);align-items:center}
                .snacky-container.top-right{top:20px;right:20px;align-items:flex-end}
                .snacky-container.bottom-left{bottom:20px;left:20px;align-items:flex-start}
                .snacky-container.bottom-center{bottom:20px;left:50%;transform:translateX(-50%);align-items:center}
                .snacky-container.bottom-right{bottom:20px;right:20px;align-items:flex-end}
                .snacky-item{display:flex;background:rgba(30,30,30,0.9);color:#f5f5f5;padding:14px;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.25);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.1);min-width:320px;max-width:440px;pointer-events:auto;opacity:0;position:relative;overflow:hidden}
                .snacky-item.show{animation:snacky-in .4s cubic-bezier(.21,1.02,.73,1) forwards}
                .snacky-item.hide{animation:snacky-out .4s cubic-bezier(.25,.46,.45,.94) forwards}
                .snacky-item[data-direction="rtl"]{flex-direction:row-reverse}
                .snacky-content{display:flex;align-items:center;overflow:hidden;width:100%}
                .snacky-icon{flex-shrink:0;width:24px;height:24px;margin-right:12px}
                .snacky-item[data-direction="rtl"] .snacky-icon{margin-right:0;margin-left:12px}
                .snacky-icon svg{width:100%;height:100%}
                .snacky-icon .snacky-icon-path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;}
                .snacky-item.info .snacky-icon{color:#58a6ff}.snacky-item.warning .snacky-icon{color:#e3b341}.snacky-item.success .snacky-icon{color:#56d364}.snacky-item.error .snacky-icon{color:#f85149}.snacky-item.cart .snacky-icon{color:#a371f7}.snacky-item.online .snacky-icon{color:#56d364}.snacky-item.offline .snacky-icon{color:#a0a0a0}.snacky-item.wishlist .snacky-icon{color:#db61a2}.snacky-item.favorite .snacky-icon{color:#f0d553}.snacky-item.saved .snacky-icon{color:#58a6ff}.snacky-item.download .snacky-icon{color:#58a6ff}.snacky-item.loading .snacky-icon{color:#a0a0a0}
                .snacky-message{font-weight:500;font-size:.95rem;line-height:1.4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-grow:1;min-width:0;-webkit-mask-image:linear-gradient(to right,black 90%,transparent 100%);mask-image:linear-gradient(to right,black 90%,transparent 100%)}
                .snacky-item[data-direction="rtl"] .snacky-message{-webkit-mask-image:linear-gradient(to left,black 90%,transparent 100%);mask-image:linear-gradient(to left,black 90%,transparent 100%);text-align:right}
                .snacky-message strong{font-weight:700;color:#fff}
                .snacky-progress-bar{position:absolute;bottom:0;left:0;height:4px;width:100%;background:rgba(255,255,255,0.15);animation:snacky-progress linear forwards;overflow:hidden}
                .snacky-progress-bar::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent);animation:snacky-shine 1.5s infinite}
                .snacky-icon-circle,.snacky-icon-triangle{stroke-dasharray:60;stroke-dashoffset:60}.snacky-icon-checkmark{stroke-dasharray:10;stroke-dashoffset:10}.snacky-icon-cross-1,.snacky-icon-cross-2{stroke-dasharray:10;stroke-dashoffset:10}.snacky-icon-dot{fill-opacity:0}.snacky-icon-line{stroke-dasharray:10;stroke-dashoffset:10}
                .snacky-item.show .snacky-icon-circle,.snacky-item.show .snacky-icon-triangle{animation:snacky-draw .4s .2s ease-out forwards}
                .snacky-item.show.success .snacky-icon-checkmark{animation:snacky-draw .3s .5s ease-out forwards}
                .snacky-item.show.error .snacky-icon-cross-1{animation:snacky-draw .2s .5s ease-out forwards}
                .snacky-item.show.error .snacky-icon-cross-2{animation:snacky-draw .2s .6s ease-out forwards}
                .snacky-item.show .snacky-icon-line{animation:snacky-draw .2s .5s ease-out forwards}
                .snacky-item.show .snacky-icon-dot{animation:snacky-pop-in .2s .4s ease-out forwards}
                @keyframes snacky-draw{to{stroke-dashoffset:0}}
                @keyframes snacky-pop-in{to{fill-opacity:1}}
                @keyframes snacky-in{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
                @keyframes snacky-out{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(20px) scale(.95)}}
                @keyframes snacky-progress{from{width:100%}to{width:0%}}
                @keyframes snacky-shine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
                @keyframes snacky-rotate{100%{transform:rotate(360deg)}}
                @keyframes snacky-dash{0%{stroke-dasharray:1,150;stroke-dashoffset:0}50%{stroke-dasharray:90,150;stroke-dashoffset:-35}100%{stroke-dasharray:90,150;stroke-dashoffset:-124}}
                .snacky-spinner{animation:snacky-rotate 2s linear infinite}.snacky-spinner .path{stroke:currentColor;stroke-linecap:round;animation:snacky-dash 1.5s ease-in-out infinite}
                @media(max-width:768px){.snacky-container{left:10px!important;right:10px!important;width:auto!important;transform:none!important;align-items:stretch!important}.snacky-container[class*="top-"]{top:10px!important;bottom:auto!important}.snacky-container[class*="bottom-"]{bottom:10px!important;top:auto!important}.snacky-item{width:100%!important;min-width:unset!important;box-sizing:border-box!important}}
            `;
            document.head.appendChild(style);
        };
        const _createContainer = (position) => { if (containerStore[position]) return containerStore[position]; const container = document.createElement('div'); container.className = `snacky-container ${position.replace(/([A-Z])/g, '-$1').toLowerCase()}`; document.body.appendChild(container); containerStore[position] = container; return container; };
        const _hideAndRemove = (snackbar) => { snackbar.classList.add('hide'); snackbar.addEventListener('animationend', (e) => { if (e.animationName !== 'snacky-out') return; const container = snackbar.parentElement; snackbar.remove(); if (container && container.childElementCount === 0) { container.remove(); for (const pos in containerStore) { if (containerStore[pos] === container) delete containerStore[pos]; } } }, { once: true }); };
        const _init = () => { if (isInitialized) return; _injectCSS(); isInitialized = true; };
        const show = (message, options = {}) => {
            _init();
            const settings = { ...defaultConfig, ...options };
            const container = _createContainer(settings.position);
            if (container.childElementCount >= MAX_SNACKBARS) { const snackbarToRemove = settings.position.startsWith('top') ? container.lastElementChild : container.firstElementChild; _hideAndRemove(snackbarToRemove); }
            const snackbar = document.createElement('div');
            snackbar.className = `snacky-item ${settings.type}`;
            snackbar.setAttribute('data-direction', settings.direction);
            let content = `<div class="snacky-content">`;
            if (settings.icon === 'show') { content += `<div class="snacky-icon">${ICONS[settings.type] || ICONS.info}</div>`; }
            const messageDiv = document.createElement('div');
            messageDiv.className = 'snacky-message';
            if (settings.wordHighlight) { const highlightWords = Array.isArray(settings.wordHighlight) ? settings.wordHighlight : [settings.wordHighlight]; const regex = new RegExp(`(${highlightWords.join('|').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'); messageDiv.innerHTML = message.replace(regex, '<strong>$1</strong>'); } else { messageDiv.textContent = message; }
            content += messageDiv.outerHTML + `</div>`;
            if (settings.progressBar === 'show' && settings.autoHide) { content += `<div class="snacky-progress-bar" style="animation-duration: ${settings.duration}ms;"></div>`; }
            snackbar.innerHTML = content;
            if (settings.position.startsWith('top')) { container.prepend(snackbar); } else { container.appendChild(snackbar); }
            if (settings.soundEffect){ playBeep();}
            if (settings.vibrate && 'vibrate' in navigator) navigator.vibrate(100);
            requestAnimationFrame(() => snackbar.classList.add('show'));
            if (settings.autoHide) { setTimeout(() => _hideAndRemove(snackbar), settings.duration); }
        };
        return { show };
    })();
