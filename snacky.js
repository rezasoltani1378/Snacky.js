/**
 * snacky.js | A professional, zero-dependency snackbar library.
 * Version: 1.0.0
 * Created by: Mohammadreza Soltani
 */
const snacky = (() => {
    let isInitialized = false;
    const containerStore = {};
    const defaultConfig = { direction: 'ltr', type: 'info', position: 'bottomRight', icon: 'show', progressBar: 'hidden', autoHide: true, duration: 4000, wordHighlight: null, soundEffect: false, vibrate: false };
    const MAX_SNACKBARS = 5;
    const sound = new Audio("data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAARAAACY29kZTpMYXZmNTYuMjUuMTAxVVRYWFgAAAAMAAAZGF0ZToxMS4wMy4yMDE2VFNTRQAAAA8AAExhdmM1Ni4yOC4xMDDIAAAAA/+k4AAAAAAAAAAAAAAAB2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZA3//6TggAAAAAAAAAAAAAAAB2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZm..AAAADAA...AAAAA//+k4AoAAAAAAAAAAAAAAAAAAAAAAB2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZm-'-'+'-Malign:center}
        .creator { margin-top: 0.5rem; color: #666; }
        h2 { font-size: 1.8rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem; margin: 2.5rem 0 1.5rem 0; }
        section { background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; }
        pre { background: #111; border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; white-space: pre-wrap; word-wrap: break-word; font-size: 0.9rem; }
        code { font-family: 'SF Mono', 'Menlo', 'Consolas', monospace; }
        .control-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; }
        button {
            background-color: #2a2a2a; color: #f0f0f0; padding: 10px 15px; border: 1px solid #444; border-radius: 8px;
            cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.2s ease; -webkit-tap-highlight-color: transparent;
        }
        button:hover { background-color: #3a3a3a; border-color: #666; transform: translateY(-2px); }
        button:active { transform: translateY(0) scale(0.98); }
        table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
        th, td { padding: 0.8rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
        th { font-weight: 600; color: var(--secondary-text); }
        td code { background: #333; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.85rem; }
    </style>
</head>
<body>

    <div class="container">
        <header>
            <h1><span>snacky</span>.js</h1>
            <p class="subtitle">A professional, zero-dependency, and highly customizable snackbar library.</p>
            <p class="creator">Created by Mohammadreza Soltani</p>
        </header>

        <section>
            <h2>How to Use</h2>
            <p>Using snacky.js is incredibly simple. Just include the script in your HTML file, and you can call it from anywhere.</p>
            <pre><code>&lt;!-- Include the script right before your closing &lt;/body&gt; tag --&gt;
&lt;script src="snacky.js"&gt;&lt;/script&gt; 

&lt;!-- Then call it from your own script --&gt;
&lt;script&gt;
  snacky.show("Your profile has been updated!", {
    type: 'success',
    position: 'bottomRight',
    duration: 5000,
    progressBar: 'show'
  });
&lt;/script&gt;</code></pre>
        </section>

        <section>
            <h2>Interactive Demo</h2>
            <h3>Notification Types</h3>
            <div class="control-grid">
                <button onclick="demo('success')">Success</button>
                <button onclick="demo('error')">Error</button>
                <button onclick="demo('warning')">Warning</button>
                <button onclick="demo('info')">Info</button>
                <button onclick="demo('cart')">Cart</button>
                <button onclick="demo('wishlist')">Wishlist</button>
                <button onclick="demo('favorite')">Favorite</button>
                <button onclick="demo('saved')">Saved</button>
                <button onclick="demo('download')">Download</button>
                <button onclick="demo('online')">Online</button>
                <button onclick="demo('offline')">Offline</button>
                <button onclick="demo('loading')">Loading</button>
            </div>
            <h3 style="margin-top: 2rem;">Features & Positions</h3>
             <div class="control-grid">
                <button onclick="demo('feature_progress')">Progress Bar</button>
                <button onclick="demo('feature_noHide')">No Auto-Hide</button>
                <button onclick="demo('feature_sound')">Sound Effect</button>
                <button onclick="demo('feature_vibrate')">Vibrate</button>
                <button onclick="demo('feature_highlight')">Word Highlight</button>
                <button onclick="demo('feature_rtl')">RTL Language</button>
                <button onclick="demo('pos_topCenter')">Top Center</button>
                <button onclick="demo('pos_bottomLeft')">Bottom Left</button>
            </div>
        </section>

        <section>
            <h2>API Reference</h2>
            <p>Customize every aspect of your notifications with these options.</p>
            <table>
                <!-- Table content from previous response -->
            </table>
        </section>
    </div>

    <script src="snacky.js"></script>
    <script>
        // --- Demo Functions ---
        const demoMessages = {
            success: "Success! Your changes were saved.",
            error: "Error! Could not connect to the server.",
            warning: "Warning: Your session is about to expire.",
            info: "Heads up! A new software update is available.",
            cart: "Added to Cart: The new Vision Pro.",
            wishlist: "Added to your Wishlist.",
            favorite: "Marked as a Favorite!",
            saved: "Your document has been saved.",
            download: "Download started...",
            online: "You are back online.",
            offline: "Connection lost. You are now offline.",
            loading: "Processing your request..."
        };
        function demo(type) {
            switch(type) {
                case 'feature_progress': snacky.show("This snackbar has a progress bar.", { type: 'download', progressBar: 'show', duration: 6000 }); break;
                case 'feature_noHide': snacky.show("This one won't auto-hide.", { type: 'offline', autoHide: false }); break;
                case 'feature_sound': snacky.show("This one has a sound effect.", { type: 'success', soundEffect: true }); break;
                case 'feature_vibrate': snacky.show("This one vibrates (on mobile).", { type: 'warning', vibrate: true }); break;
                case 'feature_highlight': snacky.show("Your order #S12345 has been confirmed.", { type: 'cart', wordHighlight: '#S12345' }); break;
                case 'feature_rtl': snacky.show("این یک پیام راست به چپ است.", { type: 'saved', direction: 'rtl' }); break;
                case 'pos_topCenter': snacky.show("Position: Top Center", { type: 'info', position: 'topCenter' }); break;
                case 'pos_bottomLeft': snacky.show("Position: Bottom Left", { type: 'info', position: 'bottomLeft' }); break;
                default: snacky.show(demoMessages[type], { type: type });
            }
        }
    </script>
</body>
</html>