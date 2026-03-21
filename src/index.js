/**
 * Cloudflare Workers でサブドメインを判定してリダイレクトするスクリプト
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname; // 例: kj.hiko14.cc
    const pathname = url.pathname;
    const search = url.search;
    const hash = url.hash;

    const CONFIG = {
      oldDomain: "hiko14.cc",
      newDomain: "super-hiko14.com",
      subdomainMapping: {
        "kj": "kokyujene",
        "dc": "discord"
      },
      externalMapping: {
        "yt": "https://youtube.com/@super-hiko14",
        "kjyt": "https://youtube.com/@KokyuJene",
        "msk": "https://misskey.io/@KokyuJene",
        "ofs": "https://ofuse.io/@superhiko14",
        "mc": "https://launch.minecraft.net/profile/Super%20Hiko14"
      }
    };

    const parts = hostname.split('.');
    let newURL = "";

    // サブドメインの判定
    if (parts.length >= 3) {
      const sub = parts[0].toLowerCase();

      if (CONFIG.externalMapping[sub]) {
        newURL = CONFIG.externalMapping[sub];
      } else {
        let newHostname = hostname.replace(CONFIG.oldDomain, CONFIG.newDomain);
        if (CONFIG.subdomainMapping[sub]) {
          const mappedSub = CONFIG.subdomainMapping[sub];
          newHostname = newHostname.replace(`${sub}.`, `${mappedSub}.`);
        }
        newURL = `https://${newHostname}${pathname}${search}${hash}`;
      }
    } else {
      let newHostname = hostname.replace(CONFIG.oldDomain, CONFIG.newDomain);
      newURL = `https://${newHostname}${pathname}${search}${hash}`;
    }

    const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loading...</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 100%; height: 100%; }
        body {
          background-color: #080808; /* デフォルトをダークに */
          color: #d0d0d0;
          font-family: 'Jost', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-wrap { display: flex; flex-direction: column; align-items: center; gap: 28px; }
        .loading-bar-track { width: 120px; height: 1px; background-color: #1e1e1e; position: relative; overflow: hidden; }
        .loading-bar-fill {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, #275766, #baffc0);
          animation: slide 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes slide { 0% { left: -60%; } 100% { left: 110%; } }
        .loading-text { font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase; color: #383838; animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      </style>
      <script>
        setTimeout(() => { window.location.replace("${newURL}"); }, 1000);
      </script>
    </head>
    <body>
      <div class="loading-wrap">
        <div class="loading-bar-track"><div class="loading-bar-fill"></div></div>
        <span class="loading-text">Loading</span>
      </div>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  }
};