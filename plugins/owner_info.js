const { cmd } = require('../command');
const fs = require("fs");

const channelJid = '120363420746032294@newsletter'; 
const channelName = 'ミ★【﻿𝘿𝙄𝙇𝙎𝙃𝘼𝙉 - 𝙈𝘿 °•° 𝙒𝙝𝙖𝙨𝙩𝙖𝙥𝙥 𝘽𝙤𝙩 】★彡';

cmd({
    pattern: "owner",
    alias: ["dilshan", "bot"],
    react: "👑",
    desc: "Show bot owner information",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const ownerImage = "https://github.com/dilshan62/DILSHAN-MD/blob/main/images/DILSHAN.jpeg?raw=true"; 

        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Dilshan Chanushka
ORG:Bot Owner
TEL;type=CELL;type=VOICE;waid=94743376317:+94 74 337 6317
END:VCARD`;

const caption = `╭━━〔 👑 *OWNER INFO* 👑 〕━━╮
┃────────────────────────
┃ 🧑‍💻 *Name* :  *Dilshan Chanushka*
┃ 🌐 *GitHub* :  github.com/dilshan62
┃ 📘 *Facebook* :  fb.com/share/1CsddoGyrb/
┃ 🎥 *YouTube* :  youtube.com/@djzdilshanxjay
┃────────────────────────
┃ 🔥 *Powered By:*  *DILSHAN-MD*
╰━━━━━━━━━━━━━━━━━━━━━━━╯
✨ *Stay connected & support the project!* 🚀
`;

        await conn.sendMessage(from, {
            image: { url: ownerImage },
            caption,
            contextInfo: {
             forwardingScore: 999,
             isForwarded: true,
             forwardedNewsletterMessageInfo: {
              newsletterJid: channelJid,
              newsletterName: channelName,
              serverMessageId: -1
            }
          }
        }, { quoted: mek });

        await conn.sendMessage(from, {
            contacts: { displayName: "Dilshan Chanushka", contacts: [{ vcard }] }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Owner plugin error:", e);
        reply("⚠️ Failed to fetch owner info.");
    }
});
