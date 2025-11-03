const ytSearch = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_URL = "http://65.109.80.126:20409/aryan/yx";
const spinner = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

module.exports = {
  config: {
    name: "video2",
    version: "1.6.1",
    author: "AHMED TARIF",
    role: 0,
    prefixRequired: true,
    premium: true,
    description: "Displays all video...!!",
    category: "Music",
    guide: { en: "${prefix} video <name or URL>" }
  },

  onStart: async ({ api, args, event }) => {
    const query = args.join(" ");
    if (!query) return api.sendMessage("❌ Provide video name or URL.", event.threadID, event.messageID);

    try {
      let url = query;
      let title = "";

      if (!query.startsWith("http")) {
        const res = await ytSearch(query);
        if (!res.videos.length) return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
        url = res.videos[0].url;
        title = res.videos[0].title;
      } else {
        const id = url.includes("v=") ? url.split("v=")[1] : url.split("/").pop();
        const info = await ytSearch({ videoId: id });
        title = info.videos[0]?.title || "Unknown Title";
      }

      const waitMsg = await api.sendMessage(`${spinner[0]} 𝚜𝚎𝚊𝚛𝚌𝚑...`, event.threadID);
      let f = 0;
      const intv = setInterval(() => { f = (f+1)%spinner.length; api.editMessage(`${spinner[f]} 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...`, waitMsg.messageID).catch(() => {}); }, 200);

      const { data } = await axios.get(`${API_URL}?url=${encodeURIComponent(url)}&type=mp4`);
      if (!data.status || !data.download_url) throw new Error("API failed");

      const file = path.join(__dirname, `video_${Date.now()}.mp4`);
      const writer = fs.createWriteStream(file);
      (await axios({ url: data.download_url, responseType: "stream" })).data.pipe(writer);
      await new Promise((r, rej) => { writer.on("finish", r); writer.on("error", rej); });

      clearInterval(intv); await api.unsendMessage(waitMsg.messageID).catch(() => {});
      await api.sendMessage({ body: `♲︎︎︎| 𝐏𝐥𝐚𝐲𝐢𝐧𝐠...⌨︎\n𐙚━━━━━━━━━𐙚\n⧉| 𝐔𝐑𝐋: ${title}`, attachment: fs.createReadStream(file) }, event.threadID, event.messageID);
      fs.unlinkSync(file);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to download video.", event.threadID, event.messageID);
    }
  }
};
