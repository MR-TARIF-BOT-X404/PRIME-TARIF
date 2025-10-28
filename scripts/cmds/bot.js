const axios = require('axios');

const baseApiUrl = () => 'https://www.noobs-api.rf.gd/dipto';

const prefixes = [
  "bby", "janu", "বাবু", "babu", "bbu", "botli", "bot",
  "baby", "বেবি", "জানু", "বট", "hlw", "hi", "babe"
];

const autoReacts = ["❤️", "😍", "😘", "😎", "🥰", "😂", "😇", "🤖", "😉", "🔥", "💋"];

module.exports = {
  config: {
    name: "bot",
    version: "1.8.0",
    author: "dipto|AHMED TARIF",
    role: 0,
    description: { en: "No prefix command with auto reaction & mention support." },
    category: "GROUP",
    guide: { en: "just type bby or reply to bot" },
  },

  onStart: async function () {},

  removePrefix(str, prefixes) {
    for (const prefix of prefixes) {
      if (str.startsWith(prefix)) return str.slice(prefix.length).trim();
    }
    return str;
  },

  // 💬 When user replies to bot
  onReply: async function ({ api, event }) {
    if (!event.messageReply) return;
    let reply = (event.body || "").toLowerCase();
    reply = this.removePrefix(reply, prefixes) || "bby";

    try {
      const response = await axios.get(
        `${baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`
      );
      const { reply: message, react } = response.data;

      // 🧡 Mention sender
      const userInfo = await api.getUserInfo(event.senderID);
      const userName = userInfo?.[event.senderID]?.name || "User";
      const mention = [{ tag: userName, id: event.senderID }];

      // 💫 Auto react (random)
      const randomReact = autoReacts[Math.floor(Math.random() * autoReacts.length)];
      setTimeout(() => api.setMessageReaction(randomReact, event.messageID, () => {}, true), 250);

      // If API gives custom react, override
      if (react) setTimeout(() => api.setMessageReaction(react, event.messageID, () => {}, true), 400);

      api.sendMessage(
        { body: `${message}`, mentions: mention },
        event.threadID,
        (err, info) => {
          if (!err) {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              text: message,
            });
          }
        },
        event.messageID
      );
    } catch (err) {
      console.error(err.message);
      api.sendMessage("🥹 Error occurred while replying!", event.threadID, event.messageID);
    }
  },

  // 📩 When user calls bot by prefix (bby, baby, etc.)
  onChat: async function ({ api, event }) {
    const commandName = module.exports.config.name;
    const tl = [
      "ɴᴀᴡ ᴍᴇssᴀɢ ᴅᴇᴏ /m.me/your.arafat.404",
      "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘",
      "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো___❤‍🩹😘",
      "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
      "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
      "আজকে আমার মন ভালো নেই__🙉",
      "[███████]100%",
    ];

    const rand = tl[Math.floor(Math.random() * tl.length)];
    let dipto = (event.body || "").toLowerCase();
    const words = dipto.split(" ");
    const count = words.length;

    if (!event.messageReply && prefixes.some(p => dipto.startsWith(p))) {
      if (event.senderID == api.getCurrentUserID()) return;

      // 💛 Fetch username for mention
      const userInfo = await api.getUserInfo(event.senderID);
      const userName = userInfo?.[event.senderID]?.name || "User";
      const mention = [{ tag: userName, id: event.senderID }];

      // ✨ Auto react random
      const randomReact = autoReacts[Math.floor(Math.random() * autoReacts.length)];
      setTimeout(() => api.setMessageReaction(randomReact, event.messageID, () => {}, true), 200);

      if (count === 1) {
        setTimeout(() => {
          api.sendMessage(
            { body: `${userName}, ${rand}`, mentions: mention },
            event.threadID,
            (err, info) => {
              if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName,
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                });
              }
            },
            event.messageID
          );
        }, 400);
      } else {
        words.shift();
        const oop = words.join(" ");
        try {
          const response = await axios.get(`${baseApiUrl()}/baby?text=${encodeURIComponent(oop)}&senderID=${event.senderID}&font=1`);
          const { reply: mg, react } = response.data;

          // 😍 Auto random react
          const randomReact2 = autoReacts[Math.floor(Math.random() * autoReacts.length)];
          setTimeout(() => api.setMessageReaction(randomReact2, event.messageID, () => {}, true), 250);

          if (react)
            setTimeout(() => api.setMessageReaction(react, event.messageID, () => {}, true), 400);

          api.sendMessage(
            { body: `${mg}`, mentions: mention },
            event.threadID,
            (err, info) => {
              if (!err) {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName,
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                });
              }
            },
            event.messageID
          );
        } catch (error) {
          console.error(error);
          api.sendMessage("⚠️ Error while contacting API", event.threadID, event.messageID);
        }
      }
    }
  },
};
