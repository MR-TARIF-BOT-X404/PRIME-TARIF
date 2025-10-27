const { GoatWrapper } = require("fca-liane-utils");

module.exports = {
  config: {
    name: "uid",
    aliases: [],
    author: "AHMED TARIF",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: { en: "Show UID." },
    longDescription: { en: "Displays the UID of yourself, a mention, or a replied message." },
    category: "Inform",
    guide: { en: "Send message, mention someone, reply, or send profile link." }
  },

  onStart: async function({ api, event }) {
    try {
      let targetID = event.senderID;

      // Reply
      if (event.type === "message_reply") targetID = event.messageReply.senderID;
      // Mention
      else if (Object.keys(event.mentions).length > 0) targetID = Object.keys(event.mentions)[0];
      // Facebook profile link
      else if (event.body.match(/facebook\.com\/(?:profile\.php\?id=)?(\d+)/i)) {
        const match = event.body.match(/facebook\.com\/(?:profile\.php\?id=)?(\d+)/i);
        targetID = match[1];
      }

      await api.sendMessage(`${targetID}`, event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Could not fetch UID.", event.threadID, event.messageID);
    }
  }
};

// No prefix needed
const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
