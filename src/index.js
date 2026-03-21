/**
 * 完全自動リダイレクト・ハブ
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    const CONFIG = {
      oldDomain: "hiko14.cc",
      newDomain: "super-hiko14.com",
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

    if (parts.length >= 3) {
      const sub = parts[0].toLowerCase();

      if (CONFIG.exceptions[sub]) {
        destination = CONFIG.exceptions[sub];
      } 
      else {
        const mappedSub = CONFIG.subdomainMapping[sub] || sub;
        destination = `https://${mappedSub}.${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
      }
    } else {
      destination = `https://${CONFIG.newDomain}${url.pathname}${url.search}${url.hash}`;
    }

    return new Response(generateHTML(destination), {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  }
};

function generateHTML(newURL) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Loading...</title>
    <link rel="shortcut icon" href="https://super-hiko14.com/favicon.ico">
    <link rel="shortcut icon" type="image/webp" href="https://super-hiko14.com/favicon.ico">
    <link rel="apple-touch-icon" sizes="32x32" href="https://super-hiko14.com/favicon.ico">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400&display=swap');
      body { background: #080808; color: #d0d0d0; font-family: 'Jost', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
      .wrap { display: flex; flex-direction: column; align-items: center; gap: 24px; }
      .bar { width: 120px; height: 1px; background: #1e1e1e; position: relative; overflow: hidden; }
      .fill { position: absolute; width: 60%; height: 100%; background: linear-gradient(90deg, #275766, #baffc0); animation: s 1.4s infinite; }
      @keyframes s { 0% { left: -60%; } 100% { left: 110%; } }
      .text { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #383838; }
    </style>
    <script>setTimeout(() => location.replace("${newURL}"), 800);</script>
  </head>
  <body>
    <div class="wrap">
      <div class="bar"><div class="fill"></div></div>
      <div class="text">Loading</div>
    </div>
  </body>
  </html>`;
}