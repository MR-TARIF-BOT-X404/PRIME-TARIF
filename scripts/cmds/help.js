const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

// Fancy uppercase font
function formatFont(text) {
  const map = {
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠",
    N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
    0: "𝟎", 1: "𝟏", 2: "𝟐", 3: "𝟑", 4: "𝟒", 5: "𝟓", 6: "𝟔", 7: "𝟕", 8: "𝟖", 9: "𝟗"
  };
  return text.split('').map(c => map[c.toUpperCase()] || c).join('');
}

// Fancy lowercase font
function formatFonts(text) {
  const map = {
    a: "a", b: "b", c: "c", d: "d", e: "e", f: "f", g: "g", h: "h", i: "i", j: "j", k: "k", l: "l", m: "m",
    n: "n", o: "o", p: "p", q: "q", r: "r", s: "s", t: "t", u: "u", v: "v", w: "w", x: "x", y: "y", z: "z",
    0: "𝟬", 1: "𝟭", 2: "𝟮", 3: "𝟯", 4: "𝟰", 5: "𝟱", 6: "𝟲", 7: "𝟳", 8: "𝟴", 9: "𝟵"
  };
  return text.split('').map(c => map[c.toLowerCase()] || c).join('');
}

// Convert role number to string
function roleTextToString(role) {
  return role === 0 ? "Everyone" : role === 1 ? "Group Admin" : role === 2 ? "Bot Admin" : "Unknown";
}

module.exports = {
  config: {
    name: "help",
    aliases: ["hlp", "helo", "menu"],
    version: "1.20",
    author: "AHMED TARIF",
    role: 0,
    prefixRequired: true,
    premium: true,
    category: "Inform",
    description: "Displays all commands or detailed info about a specific command.",
    guide: { en: "{pn} [command_name]" }
  },

  onStart: async ({ message, args, event, role }) => {
    const prefix = await getPrefix(event.threadID);

    // List all commands if no specific command is requested
    if (!args[0]) {
      let msg = `☻︎────────☻︎\n𝚈𝙾𝚄𝚁 𝚅𝙾𝙳𝚁𝙾 𝚁𝙾𝙱𝙾𝚃\n☺︎────────☺︎\n`;

      const categories = {};
      let totalCommands = 0;

      for (const [name, cmd] of commands) {
        if (cmd.config.role > role) continue; // Skip commands above user's role
        const cat = cmd.config.category || "CATEGORY";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(name);
        totalCommands++;
      }

      for (const cat of Object.keys(categories).sort()) {
        msg += `╭─[ ${formatFont(cat.toUpperCase())} ]\n`;
        for (const cmdName of categories[cat].sort()) {
          const c = commands.get(cmdName);
          msg += `├⎘ ${formatFonts(cmdName)}${c.config.premium ? " ⚜" : ""}\n`;
        }
        msg += `╰────────↉\n`;
      }

				msg += `╭─[ 𝙸𝙽𝙵𝚁𝙾𝙼 ]───☹︎\n`;
      
      msg += `├‣𝚃𝙾𝚃𝙰𝙻𝙲𝙼𝙳: [${totalCommands}]\n`;
msg += `├‣𝙿𝚁𝙴𝙵𝙸𝚇: ${prefix}\n`;
msg += `├‣𝙱𝙾𝚃𝙶𝙲: ${prefix}supportgc\n`;
msg += `├‣𝙾𝚆𝙽𝙴𝚁: 𝙼𝚁 𝚃𝙰𝚁𝙸𝙵\n`;
msg += `├‣𝙵𝙱𝙻𝙸𝙽𝙺: m.me/61552422054139\n`;
msg += `╰──────────☹︎`;
      return message.reply({ body: msg });
    }

    // Show details for a specific command
    const name = args[0].toLowerCase();
    const cmd = commands.get(name) || commands.get(aliases.get(name));
    if (!cmd) return message.reply(`Command "${name}" not found.`);

    const c = cmd.config;
    const usage = c.guide?.en?.replace(/{p}/g, prefix).replace(/{n}/g, c.name) || "No guide";

    const resp = `╭──[ ${formatFont(c.name.toUpperCase())} ]
├‣📜 𝐍𝐚𝐦𝐞: ${formatFonts(c.name)}
├‣🪶 𝐀𝐥𝐢𝐚𝐬𝐞𝐬: ${c.aliases?.length ? c.aliases.map(a => formatFonts(a)).join(", ") : "None"}
├‣🔬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${c.version || "1.0"}
├‣👤𝐂𝐫𝐞𝐝𝐢𝐭𝐬: ${c.author || "Unknown"}
├‣🔑 𝐏𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧: ${roleTextToString(c.role)}
├‣📝 𝐆𝐮𝐢𝐝𝐞: ${usage}
╰‣📰 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${c.description || "No description provided."}\n\n
╭─✦ [ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 ]
├‣🚩 𝐏𝐫𝐞𝐟𝐢𝐱 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝: ${c.prefixRequired ? "✓" : "✗"}
╰‣⚜ 𝐏𝐫𝐞𝐦𝐢𝐮𝐦: ${c.premium ? "✓" : "✗"}`;

    return message.reply(resp);
  }
};
