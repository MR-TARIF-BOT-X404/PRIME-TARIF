const axios = require('axios');

module.exports = {
  config: {
    name: "pinter2",
    aliases:["pin2"],
    author: "ChatGPT",
    version: "4.0",
    shortDescription: "Search for images using Unsplash API",
    longDescription: "Search for high-quality images using Unsplash API and return a specified number of results.",
    category: "IMAGE",
    guide: {
      vi: "",
      en: ""
    }
  },

  onStart: async function({ args, message, getLang }) {
    try {
      const query = args.join(' ');
      const numResults = parseInt(args[0]) || 5; // Default to 5 if no number is provided
      const url = `https://api.unsplash.com/search/photos?page=1&per_page=${numResults}&query=${query}&client_id=oWmBq0kLICkR_5Sp7m5xcLTAdkNtEcRG7zrd55ZX6oQ`;

      const { data } = await axios.get(url);
      const results = data.results.map(result => result.urls.regular);

      const attachments = await Promise.all(results.map(url => global.utils.getStreamFromURL(url)));

      return message.reply({body: `🔰| 𝐇𝐞𝐫𝐞 𝐚𝐫𝐞 𝐭𝐡𝐞 𝐭𝐨𝐩 ${numResults} 𝐡𝐢𝐠𝐡-𝐪𝐮𝐚𝐥𝐢𝐭𝐲 𝐢𝐦𝐚𝐠𝐞\n𐙚━━━━━━━━━━━━━━━━━𐙚\n📜|  𝐏𝐫𝐨𝐦𝐩𝐭: "${query}"`, attachment: attachments});
    } catch (error) {
      console.error(error);
      return message.reply("Sorry, I couldn't find any results.")
    }
  }
}
