/**
 * メインドメイン & サブドメイン両対応版
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
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

    const parts = hostname.split('.');
    let destination = "";
    let title = "Loading...";

    // サブドメインの判定
    if (parts.length > 2) {
      const sub = parts[0].toLowerCase();
      if (CONFIG.exceptions[sub]) {
        destination = CONFIG.exceptions[sub];
        title = `Loading to ${sub.toUpperCase()}...`;
      } else {
        const mappedSub = CONFIG.subdomainMapping[sub] || sub;
        destination = `https://${mappedSub}.${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
        title = `Loading to ${mappedSub}...`;
      }
    } else {
      // メインドメインの場合
      destination = `https://${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
    }

    // ここで CONFIG.faviconUrl を渡しています
    return new Response(generateHTML(destination, title, CONFIG.faviconUrl), {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  }
};

// 引数に faviconUrl を追加しました
function generateHTML(newURL, pageTitle, faviconUrl) {
  // 直接指定でもOKですが、一応引数を使う形にします
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
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap');
      body { background: #080808; color: #d0d0d0; font-family: 'Jost', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
      .wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; }
      .bar { width: 120px; height: 1px; background: #1e1e1e; position: relative; overflow: hidden; }
      .fill { position: absolute; width: 60%; height: 100%; background: linear-gradient(90deg, #275766, #baffc0); animation: s 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      @keyframes s { 0% { left: -60%; } 100% { left: 110%; } }
      .text { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #383838; animation: p 1.4s ease-in-out infinite; }
      @keyframes p { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    </style>
    <script>setTimeout(() => { window.location.replace("${newURL}"); }, 800);</script>
  </head>
  <body>
    <div class="wrap">
      <div class="bar"><div class="fill"></div></div>
      <div class="text">Loading</div>
    </div>
  </body>
  </html>`;
}