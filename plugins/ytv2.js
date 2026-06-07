const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

cmd({
    pattern: "video2",
    react: "🎵",
    alias: ["ytvideo", "mp3"],
    desc: "Download YouTube video by name or link",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, prefix, command }) => {
    try {
        const userName = m.pushName || "User";

        if (!args[0]) {
            return reply(`🎵 Hey ${userName}, send a YouTube link or a video name.\n\nExample: ${prefix + command} Despacito`);
        }

        let url;
        if (args[0].startsWith("http")) {
            url = args[0];
        } else {
            const searchTerm = args.join(" ");
            const searchResult = await yts(searchTerm);
            if (!searchResult || !searchResult.videos.length) {
                return reply(`❌ No results found for "${searchTerm}"`);
            }
            url = searchResult.videos[0].url;
        }

        await reply(`⏳ Fetching video info for ${userName}...`);

        // Call API
        const apiUrl = `https://api.vreden.my.id/api/ytmp4?url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status !== 200 || !json.result?.download?.url) {
            return reply(`❌ Failed to fetch video. Reason: ${json.message || 'Invalid server response'}`);
        }

        const meta = json.result.metadata;
        const title = meta.title;
        const thumbnail = meta.thumbnail;
        const timestamp = meta.timestamp;
        const views = meta.views?.toLocaleString() || "Unknown";
        const quality = json.result.download.quality;
        const downloadURL = json.result.download.url;
        const filename = json.result.download.filename;

        // Caption
        const desc = `
╭━━❰ 🎵 *SONG DOWNLOAD* ❱━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃────────────────────────
┃ 🎬 *Title:* ${title}
┃ ⏳ *Duration:* ${timestamp || "Unknown"}
┃ 👀 *Views:* ${views}
┃ 📥 *Quality:* ${quality}
┃
┃ ⚡ Powered by: *Dilshan Chanushka*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

🔻 Download your favorite songs fast!
❤️ Made with passion by *Dilshan Chanushka* 💫`;

        // 1️⃣ Send thumbnail + caption
        await conn.sendMessage(
            from,
            {
                image: { url: thumbnail },
                caption: desc
            },
            { quoted: mek }
        );

        // 2️⃣ Send the real video (URL streaming)
        await conn.sendMessage(
            from,
            {
                video: { url: downloadURL },   // ✅ Proper playable video
                mimetype: 'video/mp4',
                fileName: filename,
                caption: `🎬 ${title}\n📥 Quality: ${quality}`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("❌ Video plugin error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
