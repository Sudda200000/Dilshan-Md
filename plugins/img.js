const { cmd } = require("../command");
const googleIt = require("google-it");

const pendingGoogle = {};

cmd(
  {
    pattern: "google",
    react: "🔍",
    desc: "Search anything on Google and get top results.",
    category: "tools",
    filename: __filename,
  },
  async (dilshan, mek, m, { from, q, sender, reply }) => {
    try {
      if (!q) return reply("❌ *Please provide a search query.*\n\n💡 Example: `.google Dilshan MD Bot`");

      await dilshan.sendMessage(from, { react: { text: "⏳", key: mek.key } });

      const results = await googleIt({ query: q, limit: 7 });

      if (!results || results.length === 0) {
        return reply("❌ No Google results found. Try another query.");
      }

      pendingGoogle[sender] = results;

      const resultList = results.map((v, i) => (
`╭─❰ 🔗 *${i + 1}. Title:* ${v.title || "No title"} ❱
│ 🌐 *Link:* ${v.link}
│ 📝 *Snippet:* ${v.snippet?.slice(0, 100) || "-"}
╰───────────────⭓`
      )).join("\n\n");

      const caption = `
╭━━━❰ 🔍 *GOOGLE SEARCH* ❱━━━╮
┃🔰 *WELCOME TO DILSHAN-MD* 🔰
┃───────────────────────
┃ 🔎 *Query:* ${q}
┃───────────────────────
${resultList}
┃───────────────────────
┃ 💡 Reply with a *number* (1-${results.length}) to get the full link
╰━━━━━━━━━━━━━━━━━━━━━━━╯

⚡ Powered by: *Dilshan Chanushka*
`;

      await dilshan.sendMessage(
        from,
        {
          image: { url: "https://github.com/dilshan62/DILSHAN-MD/blob/main/images/DILSHAN-MD-ALIVE.png?raw=true" },
          caption,
        },
        { quoted: mek }
      );

      await dilshan.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log("Google Search Error:", e);
      reply("❌ *Error:* " + e.message);
    }
  }
);

cmd(
  {
    filter: (text, { sender }) => {
      return pendingGoogle[sender] && /^[1-7]$/.test(text.trim());
    },
  },
  async (dilshan, mek, m, { from, body, sender, reply }) => {
    const selected = parseInt(body.trim()) - 1;
    const results = pendingGoogle[sender];
    const result = results[selected];
    delete pendingGoogle[sender]; // Clear cache

    if (!result) return reply("❌ Invalid selection.");

    const caption = `
╭━━❰ 🌐 *GOOGLE RESULT* ❱━━╮
┃ 📝 *Title:* ${result.title || "No title"}
┃ 🌐 *Link:* ${result.link}
┃ 🖊️ *Snippet:* ${result.snippet || "-"}
╰━━━━━━━━━━━━━━━━━━━━━━━╯

⚡ Powered by: *Dilshan Chanushka*
`;

    await dilshan.sendMessage(from, { react: { text: "🔗", key: mek.key } });
    await dilshan.sendMessage(
      from,
      { text: caption, mentions: [sender] },
      { quoted: mek }
    );
  }
);
