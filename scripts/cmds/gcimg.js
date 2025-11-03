const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");

const spinner = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'];

module.exports = {
  config: {
    name: "gcimg",
    aliases: ["groupimg"],
    version: "2.0",
    author: "AHMED TARIF",
    role: 0,
    prefixRequired: true,
    premium: true,
    description: "Displays Group Userphoto with 8 avatars per row",
    category: "Image",
    guide: { en: "${prefix} gcimg,groupimg" }
  },

  onStart: async ({ api, event, usersData, message }) => {
    let waitMsg, frame = 0, interval;

    try {
      // Send initial waiting message
      waitMsg = await message.reply(`${spinner[0]} 𝚜𝚎𝚊𝚛𝚌𝚑 𝚐𝚛𝚘𝚞𝚙 𝚒𝚖𝚊𝚐𝚎...🚀`);

      // Spinner animation
      interval = setInterval(async () => {
        frame = (frame + 1) % spinner.length;
        try { 
          await api.editMessage(`${spinner[frame]} 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐  𝚒𝚖𝚊𝚐𝚎...🎨`, waitMsg.messageID); 
        } catch {}
      }, 200);

      // Get thread info
      const t = await api.getThreadInfo(event.threadID);
      const parts = t.participantIDs;
      const admins = t.adminIDs.map(a => a.id);

      // Count active participants
      const msgs = await api.getThreadHistory(event.threadID, 100, null);
      const count = {};
      msgs.forEach(m => parts.includes(m.senderID) && (count[m.senderID] = (count[m.senderID] || 0) + 1));

      // Fetch user avatars
      const imgs = await Promise.all(parts.map(async id => {
        try {
          const url = await usersData.getAvatarUrl(id);
          return (await axios.get(url, { responseType: "arraybuffer" })).data;
        } catch {
          return null;
        }
      }));

      // Avatar settings
      const avatarSize = 70;
      const spacing = 20;
      const avatarsPerRow = 8;

      const rows = Math.ceil(parts.length / avatarsPerRow);
      const canvasWidth = 700;
      const canvasHeight = 250 + rows * (avatarSize + spacing) + 50;

      const c = createCanvas(canvasWidth, canvasHeight);
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.textAlign = "center";
      ctx.font = "26px Arial";
      ctx.fillStyle = "black";

      // Draw circular group image
      if (t.imageSrc) {
        try {
          const groupImg = await loadImage(t.imageSrc);
          const centerX = canvasWidth / 2;
          const centerY = 80;
          const radius = 80;

          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(groupImg, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();
        } catch {}
      }

      // Draw group name & stats
      ctx.fillText(t.threadName, canvasWidth / 2, 180);
      ctx.fillText(`Admins: ${admins.length} | Active: ${Object.keys(count).length} | Members: ${parts.length - admins.length}`, canvasWidth / 2, 220);

      // Draw user avatars in grid
      let x = 20, y = 250, col = 0;
      for (const b of imgs) {
        if (b) {
          const avatarImg = await loadImage(b);
          const centerX = x + avatarSize / 2;
          const centerY = y + avatarSize / 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, avatarSize / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(avatarImg, x, y, avatarSize, avatarSize);
          ctx.restore();

          col++;
          if (col >= avatarsPerRow) {
            col = 0;
            x = 20;
            y += avatarSize + spacing;
          } else {
            x += avatarSize + spacing;
          }
        }
      }

      // Save and send
      const out = path.join(__dirname, "cache", `gcimg_${Date.now()}.png`);
      fs.ensureDirSync(path.dirname(out));
      fs.writeFileSync(out, c.toBuffer("image/png"));

      // Stop spinner and remove message
      clearInterval(interval);
      await api.unsendMessage(waitMsg.messageID);

      // Send final image
      message.reply({ body: `🖼️ ${t.threadName}`, attachment: fs.createReadStream(out) });

    } catch (e) {
      clearInterval(interval);
      console.error(e);
      message.reply("❌ Error: " + e.message);
    }
  },

  onChat: async ({ event, message }) => {
    if (event.body.toLowerCase() === "gcimg") {
      message.body = "+gcimg";
      return this.onStart(...arguments);
    }
  }
};
