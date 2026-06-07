const { cmd } = require('../command');
const fetch = require('node-fetch');
const yts = require('yt-search');

cmd({
    pattern: "song2",
    react: "🎵",
    alias: ["ytaudio", "mp3"],
    desc: "Download songs by name or YouTube link",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, prefix, command }) => {
    try {
        const userName = m.pushName || "User";

        if (!args[0]) {
            return reply(`🎵 Hey ${userName}, send a YouTube link or a song name.\n\nExample: ${prefix + command} Despacito`);
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

        await reply(`⏳ Fetching song info for ${userName}...`);

        // Get audio from API
        const apiUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.status !== 200 || !json.result?.download?.url) {
            return reply(`❌ Failed to fetch audio. Reason: ${json.message || 'Invalid server response'}`);
        }

        const meta = json.result.metadata;
        const title = meta.title;
        const thumbnail = meta.thumbnail;
        const timestamp = meta.timestamp;
        const views = meta.views?.toLocaleString() || "Unknown";
        const quality = json.result.download.quality;

        const downloadURL = json.result.download.url;
        const audioRes = await fetch(downloadURL);
        const audioBuffer = await audioRes.buffer();

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

        // 1️⃣ Send thumbnail with caption
        await conn.sendMessage(
            from,
            {
                image: { url: thumbnail },
                caption: desc
            },
            { quoted: mek }
        );

        // 2️⃣ Send the audio file
        await conn.sendMessage(
            from,
            {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${title || "song"}.mp3`,
                ptt: false
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("❌ Song plugin error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
