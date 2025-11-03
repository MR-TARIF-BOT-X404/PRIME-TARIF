const Canvas = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "upt",
    aliases: ["uptime"],
    version: "1.20",
    author: "AHMED TARIF",
    role: 0,
    usePrefix: false,
    prefixRequired: true,
    premium: true,
    description: "uptime info about a specific command!",
    category: "Inform",
    guide: { en: "just tryp upt" }
  },


  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      const startTime = Date.now();

      // -------------------- 3-frame Loading Animation --------------------
      const loadingFrames = [];
      const steps = ["LOADING...UPTIME", "Loading Data...", "Almost Ready!"];
      for (let i = 0; i < 3; i++) {
        const canvas = Canvas.createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 800, 400);
        bgGradient.addColorStop(0, "#1f4037");
        bgGradient.addColorStop(1, "#99f2c8");
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, 800, 400);

        // Rounded overlay
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.roundRect(50, 150, 700, 100, 25);
        ctx.fill();

        // 3D-style progress bar
        ctx.fillStyle = "#111";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 15;
        ctx.fillRect(100, 280, 600, 40);
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 4;
        ctx.strokeRect(100, 280, 600, 40);

        // Progress fill
        const progressWidth = ((i + 1) / 3) * 600;
        const barGradient = ctx.createLinearGradient(100, 280, 700, 280);
        barGradient.addColorStop(0, "#00f5ff");
        barGradient.addColorStop(1, "#00ff94");
        ctx.fillStyle = barGradient;
        ctx.fillRect(100, 280, progressWidth, 40);

        // Glow text
        ctx.font = "bold 40px 'Segoe UI'";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = "#00ffea";
        ctx.shadowBlur = 25;
        ctx.fillText(steps[i], 150, 220);

        const buffer = canvas.toBuffer("image/png");
        const tempPath = path.join(__dirname, `loading_${i}.png`);
        fs.writeFileSync(tempPath, buffer);
        loadingFrames.push(tempPath);
      }

      let sentMessage;
      for (const frame of loadingFrames) {
        if (!sentMessage) {
          sentMessage = await api.sendMessage(
            { body: "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐬...", attachment: fs.createReadStream(frame) },
            event.threadID
          );
        } else {
          await new Promise(r => setTimeout(r, 3000));
          try {
            await api.editMessage(
              { body: "⏳ 𝐋𝐨𝐚𝐝𝐢𝐧𝐠 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐬...", attachment: fs.createReadStream(frame) },
              sentMessage.messageID
            );
          } catch (e) {}
        }
        fs.unlinkSync(frame);
      }

      // -------------------- Fetch Data & Uptime --------------------
      const [allUsers, allThreads] = await Promise.all([usersData.getAll(), threadsData.getAll()]);
      const uptimeSec = process.uptime();
      const days = Math.floor(uptimeSec / 86400);
      const hours = Math.floor((uptimeSec % 86400) / 3600);
      const minutes = Math.floor((uptimeSec % 3600) / 60);
      const seconds = Math.floor(uptimeSec % 60);
      const uptimeString = `${days}𝐝 ${hours}𝐡 ${minutes}𝐦 ${seconds}𝐬`;
      const ping = Date.now() - startTime;
      const nodeVersion = process.version;

      // -------------------- Final Stats Image with Clock --------------------
      const canvas = Canvas.createCanvas(800, 400);
      const ctx = canvas.getContext("2d");

      // Background gradient
      const finalGradient = ctx.createLinearGradient(0, 0, 800, 400);
      finalGradient.addColorStop(0, "#1a2a6c");
      finalGradient.addColorStop(0.5, "#b21f1f");
      finalGradient.addColorStop(1, "#fdbb2d");
      ctx.fillStyle = finalGradient;
      ctx.fillRect(0, 0, 800, 400);

      // Rounded overlay
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.roundRect(50, 50, 700, 300, 30);
      ctx.fill();

      // Title
      ctx.font = "bold 48px 'Segoe UI'";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#00ffea";
      ctx.shadowBlur = 30;
      ctx.fillText("TARIF BOT UPTIME", 150, 120);

      // Bot stats
      ctx.font = "30px 'Segoe UI'";
      ctx.fillStyle = "#00ffea";
      ctx.shadowBlur = 15;
      ctx.fillText(`⎙| 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}`, 80, 180);
      ctx.fillText(`⎒| 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${allUsers.length}`, 80, 220);
      ctx.fillText(`⎒| 𝐓𝐨𝐭𝐚𝐥 𝐆𝐫𝐨𝐮𝐩𝐬: ${allThreads.length}`, 80, 260);
      ctx.fillText(`⎘| 𝐏𝐢𝐧𝐠: ${ping} ms`, 80, 300);
      ctx.fillText(`⎘| 𝐍𝐨𝐝𝐞.𝐣𝐬: ${nodeVersion}`, 80, 340);

      // -------------------- Draw Clock on Right Side --------------------
      const clockX = 650;
      const clockY = 250;
      const clockRadius = 70;

      function drawClock() {
        const now = new Date();
        const sec = now.getSeconds();
        const min = now.getMinutes();
        const hr = now.getHours() % 12;

        ctx.save();
        ctx.translate(clockX, clockY);

        // Clock circle
        ctx.beginPath();
        ctx.arc(0, 0, clockRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Hour hand
        ctx.save();
        ctx.rotate(((Math.PI * 2) / 12) * hr + ((Math.PI * 2) / 12) * (min / 60));
        ctx.strokeStyle = "#00ffea";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -clockRadius * 0.5);
        ctx.stroke();
        ctx.restore();

        // Minute hand
        ctx.save();
        ctx.rotate(((Math.PI * 2) / 60) * min + ((Math.PI * 2) / 60) * (sec / 60));
        ctx.strokeStyle = "#00ffea";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -clockRadius * 0.8);
        ctx.stroke();
        ctx.restore();

        // Second hand
        ctx.save();
        ctx.rotate(((Math.PI * 2) / 60) * sec);
        ctx.strokeStyle = "#ff2e2e";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -clockRadius * 0.9);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      drawClock();

      const finalImagePath = path.join(__dirname, "uptime_final.png");
      fs.writeFileSync(finalImagePath, canvas.toBuffer("image/png"));

      await api.sendMessage(
        { body: `𝗧𝗔𝗥𝗜𝗙 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘...\n\n⎙| 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}\n\n⎒| 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${allUsers.length}\n⎒| 𝐓𝐨𝐭𝐚𝐥 𝐆𝐫𝐨𝐮𝐩𝐬:${allThreads.length}\n\n⎘| 𝐏𝐢𝐧𝐠: ${ping} ms\n⎘| 𝐍𝐨𝐝𝐞.𝐣𝐬: ${nodeVersion}`, attachment: fs.createReadStream(finalImagePath) },
        event.threadID
      );

      fs.unlinkSync(finalImagePath);

    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Error generating stats.", event.threadID);
    }
  }
};
