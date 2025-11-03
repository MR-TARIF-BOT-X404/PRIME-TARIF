const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

const API_URL = "http://65.109.80.126:20409/aryan/yx";
const spinner = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

module.exports = {
  config: {
    name: "song",
    version: "1.0.5",
    author: "AHMED TARIF",
    role: 0,
    usePrefix: false,
    prefixRequired: true,
    premium: true,
    description: "Searches and downloads YouTube song!",
    category: "Music",
    guide: { en: "${prefix} song name" }
  },
  onStart: async ({ api, args, event }) => {
    const query = args.join(" ");
    if (!query) return api.sendMessage("❌ Provide song name or URL.", event.threadID, event.messageID);

    let url = query;
    try {
      if (!query.startsWith("http")) {
        const res = await ytSearch(query);
        if (!res.videos.length) return api.sendMessage("❌ No results found.", event.threadID, event.messageID);
        url = res.videos[0].url;
      }

      // Spinner message
      let frame = 0;
      const waitMsg = await api.sendMessage(`${spinner[frame]} Downloading...`, event.threadID);
      const interval = setInterval(() => {
        frame = (frame + 1) % spinner.length;
        api.editMessage(`${spinner[frame]} 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐...`, waitMsg.messageID).catch(() => {});
      }, 200);

      // Download MP3 via API
      const { data } = await axios.get(API_URL, { params: { url, type: "mp3" }, timeout: 15000 });
      if (!data.status || !data.download_url) throw new Error("API failed");

      const filePath = path.join(__dirname, "song.mp3");
      const writer = fs.createWriteStream(filePath);
      (await axios({ url: data.download_url, responseType: "stream" })).data.pipe(writer);
      await new Promise((res, rej) => { writer.on("finish", res); writer.on("error", rej); });

      clearInterval(interval);
      await api.unsendMessage(waitMsg.messageID).catch(() => {});
      await api.sendMessage({ body: "🎵 Here is your song", attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);
      api.sendMessage(`❌ Failed: ${err.message}`, event.threadID, event.messageID);
    }
  }
};
