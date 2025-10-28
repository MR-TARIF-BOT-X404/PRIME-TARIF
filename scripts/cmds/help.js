const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "𝙔𝙊𝙐𝙍 𝙑𝙊𝘿𝙍𝙊 𝘽𝙊𝙏";

function formatFont(text) {
  const fontMapping = {
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗", 0: "𝟎"
  };
  return text.split('').map(char => fontMapping[char.toUpperCase()] || char).join('');
}

function formatFonts(text) {
  const fontList = {
    a: "a", b: "b", c: "c", d: "d", e: "e", f: "f", g: "g", h: "h", i: "i", j: "j", k: "k", l: "l", m: "m",
    n: "n", o: "o", p: "p", q: "q", r: "r", s: "s", t: "t", u: "u", v: "v", w: "w", x: "x", y: "y", z: "z",
    1: "𝟷", 2: "𝟸", 3: "𝟹", 4: "𝟺", 5: "𝟻", 6: "𝟼", 7: "𝟽", 8: "𝟾", 9: "𝟿", 0: "𝟶"
  };
  return text.split('').map(char => fontList[char.toLowerCase()] || char).join('');
}

module.exports = {
  config: {
    name: "help",
    version: "1.20",
    author: "AHMED TARIF",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list"
    },
    longDescription: {
      en: "View detailed command usage and list all available commands"
    },
    category: "INFROM",
    guide: {
      en: "{pn} [command_name]"
    },
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = await getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = `☻︎────────☻︎\n	𝚈𝙾𝚄𝚁 𝚅𝙾𝙳𝚁𝙾 𝚁𝙾𝙱𝙾𝚃 \n☺︎︎────────☺︎︎\n`;

      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "CATEGORY";
        if (!categories[category]) {
          categories[category] = { commands: [] };
        }
        categories[category].commands.push(name);
      }

      Object.keys(categories).sort().forEach(category => {
        const formattedCategory = formatFont(category.toUpperCase());
        msg += `╭─[ ${formattedCategory} ]\n`;

        const names = categories[category].commands.sort();
        for (let i = 0; i < names.length; i++) {
          const formattedCmd = formatFonts(names[i]);
          msg += `├⎘ ${formattedCmd}\n`;
        }

        msg += `╰───────☻︎\n`;
      });

      const totalCommands = commands.size;
      msg += `╭─[ 𝙸𝙽𝙵𝚁𝙾𝙼 ]───☹︎\n`;
      msg += `├‣𝚃𝙾𝚃𝙰𝙻𝙲𝙼𝙳: [${totalCommands}]\n`;
      msg += `├‣𝙿𝚁𝙴𝙵𝙸𝚇: ${prefix} \n`;
      msg += `├‣𝙱𝙾𝚃𝙶𝙲: ${prefix}supportgc  \n├‣𝙾𝚆𝙽𝙴𝚁: 𝐌𝐫 𝐓𝐚𝐫𝐢𝐟\n├‣𝙵𝙱𝙻𝙸𝙽𝙺: m.me/61552422054139\n`;
      msg += `╰──────────☹︎\n`;
      msg += ``;
      msg += ``;
      msg += ``;

      await message.reply({ body: msg });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName || "undefined"}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription?.en || "No description";
        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭──[ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝: ${configCommand.name} ]
├‣ 📜 𝐍𝐚𝐦𝐞: ${configCommand.name}
├‣ 🪶 𝐀𝐥𝐢𝐚𝐬𝐞𝐬: ${configCommand.aliases ? configCommand.aliases.join(", ") : "None"}
├‣ 🔬𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${configCommand.version || "1.0"}
├‣ 👤 𝐂𝐫𝐞𝐝𝐢𝐭𝐬: ${author}
├‣ 🔑 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${roleText}
├‣ 𝐆𝐮𝐢𝐝𝐞: ${usage}
╰‣ 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${longDescription}


╭─✦ [ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 ]
├‣ 🚩 𝐏𝐫𝐞𝐟𝐢𝐱 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝: ✓ Required
╰‣ ⚜ 𝐏𝐫𝐞𝐦𝐢𝐮𝐦: ✗ Free to Use`;

        await message.reply(response);
      }
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return " Everyone";
    case 1: return " (Group administrators)";
    case 2: return " (Admin bot)";
    default: return "Unknown role";
  }
  }
