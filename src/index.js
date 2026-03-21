/**
 * メインドメイン & サブドメイン両対応版 (判定強化)
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();
    
    const CONFIG = {
      oldDomain: "hiko14.cc",
      newDomain: "super-hiko14.com",
      faviconUrl: "https://super-hiko14.com/favicon.png", 
      exceptions: {
        "yt": "https://youtube.com/@super-hiko14",
        "kjyt": "https://youtube.com/@KokyuJene",
        "msk": "https://misskey.io/@KokyuJene",
        "ofs": "https://ofuse.io/@superhiko14",
        "mc": "https://launch.minecraft.net/profile/Super%20Hiko14"
      },
      subdomainMapping: {
        "kj": "kokyujene",
        "dc": "discord"
      }
    };

    let destination = "";
    let title = "Loading...";

    if (hostname === CONFIG.oldDomain) {
      // メインドメインの場合
      destination = `https://${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
    } else {
      // サブドメインがある場合
      const sub = hostname.split('.')[0];
      
      if (CONFIG.exceptions[sub]) {
        destination = CONFIG.exceptions[sub];
        title = `Loading to ${sub.toUpperCase()}...`;
      } else {
        const mappedSub = CONFIG.subdomainMapping[sub] || sub;
        destination = `https://${mappedSub}.${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
        title = `Loading to ${mappedSub}...`;
      }
    }

    try {
      destination = new URL(destination).toString();
    } catch (e) {
    }

    return new Response(generateHTML(destination, title, CONFIG.faviconUrl), {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  }
};

function generateHTML(newURL, pageTitle, faviconUrl) {
  const finalFavicon = faviconUrl || "https://super-hiko14.com/favicon.png";

  return `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    <link rel="icon" href="${finalFavicon}">
    <meta property="og:title" content="${pageTitle}">
    <meta property="og:description" content="Redirecting to ${newURL}">
    <noscript><meta http-equiv="refresh" content="1;url=${newURL}"></noscript>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap');

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html, body {
        width: 100%;
        height: 100%;
      }

      body {
        background-color: #fff;
        color: #000;
        font-family: 'Jost', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      html[data-theme="dark"] body {
        background-color: #080808;
        color: #d0d0d0;
      }

      /* ── ローディング本体 ── */
      .loading-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
        opacity: 0;
        animation: fadeIn 0.5s ease forwards;
      }

      @keyframes fadeIn {
        to { opacity: 1; }
      }

      /* バー */
      .loading-bar-track {
        width: 120px;
        height: 1px;
        background-color: #e8e8e8;
        position: relative;
        overflow: hidden;
      }

      html[data-theme="dark"] .loading-bar-track {
        background-color: #1e1e1e;
      }

      .loading-bar-fill {
        position: absolute;
        top: 0;
        left: -100%;
        width: 60%;
        height: 100%;
        background: linear-gradient(90deg, #275766, #baffc0);
        animation: slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }

      @keyframes slide {
        0%   { left: -60%; }
        100% { left: 110%; }
      }

      /* テキスト */
      .loading-text {
        font-size: 0.72rem;
        font-weight: 400;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #ccc;
        animation: pulse 1.4s ease-in-out infinite;
      }

      html[data-theme="dark"] .loading-text {
        color: #383838;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }
    </style>
  </head>
  <body>
    <div class="loading-wrap">
      <div class="loading-bar-track">
        <div class="loading-bar-fill"></div>
      </div>
      <span class="loading-text">Loading</span>
    </div>

    <script>
      const theme = localStorage.getItem('theme') || 
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

      setTimeout(() => { window.location.replace("${newURL}"); }, 800);
    </script>
  </body>
  </html>`;
}