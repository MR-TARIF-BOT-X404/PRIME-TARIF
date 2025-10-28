const ytSearch = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "http://65.109.80.126:20409/aryan/yx";

module.exports = {
  config: {
    name: "video",
    version: "1.6.0",
    usePrefix: false,
    author: "AHMED TARIF",
    description: { en: "Download YouTube video automatically" },
    category: "MUSIC",
    guide: { en: "{pn} <video name or URL>" }
  },

  onStart: async ({ api, args, event }) => {
    const query = args.join(" ");
    if (!query) return api.sendMessage("❌ Provide a video name or URL.", event.threadID, event.messageID);

    try {
      let url = query, title = "";

      if (!query.startsWith("http")) {
        const res = await ytSearch(query);
        if (!res.videos.length) return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
        url = res.videos[0].url;
        title = res.videos[0].title;
      } else {
        const info = await ytSearch({ videoId: url.split("v=")[1] });
        title = info.videos[0]?.title || "Unknown Title";
      }

      // Send waiting message
      const waitMsg = await api.sendMessage("♲︎︎︎| 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐕𝐢𝐝𝐞𝐨...✘", event.threadID);

      // Download video
      const { data } = await axios.get(`${API_URL}?url=${encodeURIComponent(url)}&type=mp4`);
      if (!data.status || !data.download_url) throw new Error("API failed");

      const file = path.join(__dirname, `video_${Date.now()}.mp4`);
      const writer = fs.createWriteStream(file);
      const stream = await axios({ url: data.download_url, responseType: "stream" });
      stream.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // Remove waiting message
      await api.unsendMessage(waitMsg.messageID);

      // Send the video
      await api.sendMessage(
        { body: `♲︎︎︎| 𝐏𝐥𝐚𝐲𝐢𝐧𝐠...⌨︎\n𐙚━━━━━━━━━𐙚\n⧉| 𝐔𝐫𝐋..: ${title}`, attachment: fs.createReadStream(file) },
        event.threadID,
        event.messageID
      );

      // Delete temp file
      fs.unlinkSync(file);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to download video.", event.threadID, event.messageID);
    }
  }
};
