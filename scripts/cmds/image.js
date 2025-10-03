const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "image",
    aliases: [],
    author: "Mahi--",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image based on a prompt.",
    longDescription: "Generates an image using the provided prompt.",
    category: "IMAGE",
    guide: "{p}gen <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    // Obfuscated author name check
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 105, 45, 45);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("📜 | 𝐘𝐨𝐮 𝐧𝐞𝐞𝐝 𝐭𝐨 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭.", event.threadID);
    }

    api.sendMessage("🎨| 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰8 𝐲𝐨𝐮𝐫 𝐩𝐢𝐜𝐭𝐮𝐫𝐞!", event.threadID, event.messageID);

    try {
      const mrgenApiUrl = `https://hopelessmahi.onrender.com/api/image?prompt=${encodeURIComponent(prompt)}`;

      const mrgenResponse = await axios.get(mrgenApiUrl, {
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(mrgenResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "🔰| 𝐈𝐦𝐚𝐠𝐞 𝐟𝐨𝐫:\n𐙚━━━━━━━𐙚",
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("🔰 | An error occurred. Please try again later.");
    }
  }
};
