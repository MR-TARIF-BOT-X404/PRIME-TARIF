const axios = require('axios');

const baseApiUrl = async () => {
  const base = 'https://www.noobs-api.rf.gd/dipto';
  return base;
};

const prefixes = [
  "bby", "janu", "বাবু", "babu", "bbu", "botli", "bot", "baby", "বেবি", "জানু", "বট", "طفل", "بوت", "babe"
];

module.exports = {
  config: {
    name: "bot",
    version: "1.6.9",
    author: "Error.x404",
    role: 0,
    description: {
      en: "no prefix command.",
    },
    category: "GROUP",
    guide: {
      en: "just type bby",
    },
  },
  onStart: async function () {},
  
  removePrefix: function (str, prefixes) {
    for (const prefix of prefixes) {
      if (str.startsWith(prefix)) {
        return str.slice(prefix.length).trim();
      }
    }
    return str;
  },

  onReply: async function ({ api, event }) {
    if (event.type == "message_reply") {
      let reply = event.body.toLowerCase();
      reply = this.removePrefix(reply, prefixes) || "bby";

      if (reply) {
        try {
          const response = await axios.get(
            `${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`
          );
          const message = response.data.reply;
          
          if (response.data.react) {
            setTimeout(() => {
              api.setMessageReaction(
                response.data.react,
                event.messageID,
                (err) => {},
                true
              );
            }, 400);
          }
          
          await api.sendMessage(
            message,
            event.threadID,
            (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "bot",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                text: message,
              });
            },
            event.messageID
          );
        } catch (err) {
          console.log(err.message);
          api.sendMessage("🥹🥹error", event.threadID, event.messageID);
        }
      }
    }
  },

  onChat: async function ({ api, event }) {
    const tl = ["ɴᴀᴡ ᴍᴇssᴀɢ ᴅᴇᴏ /m.me/your.arafat.404","𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘","𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘","𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো___❤‍🩹😘","𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂❤‍🩹","🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲","𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺","𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে,TᴀRɪF✈︎TᴀRɪF ও তো করতে পারো😑?","আজকে আমার মন ভালো নেই__🙉","𝗕𝗯𝘆 বললে চাকরি থাকবে না__😫","চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹😫","𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো__😘","[███████]100%"];

    const rand = tl[Math.floor(Math.random() * tl.length)];

    let dipto = event.body ? event.body.toLowerCase() : "";
    const words = dipto.split(" ");
    const count = words.length;

    if (event.type !== "message_reply") {
      let messageToSend = dipto;
      messageToSend = this.removePrefix(messageToSend, prefixes);

      if (prefixes.some((prefix) => dipto.startsWith(prefix))) {
        setTimeout(function () {
          api.setMessageReaction("📝", event.messageID, (err) => {}, true);
        }, 400);
        api.sendTypingIndicator(event.threadID, true);

        if (event.senderID == api.getCurrentUserID()) return;

        var msg = {
          body: rand,
        };
        if (count === 1) {
          setTimeout(function () {
            return api.sendMessage(
              msg,
              event.threadID,
              (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName: "bot",
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                  link: msg,
                });
              },
              event.messageID
            );
          }, 400);
        } else {
          words.shift();
          const oop = words.join(" ");
          try {
            const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(oop)}&senderID=${event.senderID}&font=1`);
            const mg = response.data.reply;
            if (response.data.react) {
              setTimeout(function () {
                api.setMessageReaction(
                  response.data.react,
                  event.messageID,
                  (err) => {},
                  true
                );
              }, 500);
            }
            await api.sendMessage(
              { body: mg },
              event.threadID,
              (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName: this.config.name,
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                  link: mg,
                });
              },
              event.messageID
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  },
};
