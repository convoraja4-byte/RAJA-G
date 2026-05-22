module.exports = {
  config: {
    credits: "SARDAR RDX",
    name: 'spamgc',
    aliases: ['spamgroups', 'spamlist'],
    description: 'Spam groups ki list dekho aur unhe connect karo.',
    usage: 'spamgc',
    category: 'Admin',
    prefix: true,
    adminOnly: true
  },

  async run({ api, event, send, client, Threads }) {
    const { threadID, senderID } = event;

    await send.reply('⏳ Spam groups dhundh raha hun...');

    try {
      const allThreads = await Threads.getAll();
      const spamThreads = allThreads.filter(t => t.settings?.spam === true);

      if (!spamThreads.length) {
        return send.reply('✅ Koi spam group nahi hai abhi.');
      }

      const groupData = [];
      for (const t of spamThreads) {
        let name = t.name || 'Unknown Group';
        let members = '?';
        try {
          const info = await api.getThreadInfo(t.id);
          if (info?.threadName) name = info.threadName;
          members = info?.participantIDs?.length || '?';
        } catch {}
        groupData.push({ id: t.id, name, members });
        await new Promise(r => setTimeout(r, 200));
      }

      const lines = groupData.map((g, i) =>
        `${i + 1}. 📛 ${g.name}\n    🆔 ${g.id}\n    👥 Members: ${g.members}`
      );

      const msg =
        `╭──── ⚠️ SPAM GROUPS LIST ────╮\n` +
        `│ Total: ${groupData.length} spam groups\n` +
        `╰─────────────────────────────╯\n\n` +
        lines.join('\n\n') +
        `\n\n` +
        `💬 Jin groups ko connect karna hai unke numbers reply mein type karo.\n` +
        `📌 Multiple: 1,2,5,9 aise likho`;

      const info = await send.reply(msg);

      if (info?.messageID) {
        client.replies.set(info.messageID, {
          commandName: 'spamgc',
          author: senderID,
          data: { groupData }
        });
      }

    } catch (e) {
      send.reply('❌ Error: ' + e.message);
    }
  },

  async handleReply({ api, event, send, Threads, config, client, data }) {
    const { threadID, senderID, body, messageID } = event;
    const { groupData } = data;

    const input = body.trim();
    const selected = input.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n >= 1 && n <= groupData.length);

    if (!selected.length) {
      return send.reply('❌ Sahi numbers type karo. Example: 1,2,5');
    }

    await send.reply(`⏳ ${selected.length} group(s) connect ho rahe hain...`);

    const botID = api.getCurrentUserID();
    const botName = config.BOTNAME || 'SARDAR RDX BOT';
    let success = 0, failed = 0;
    const results = [];

    for (const num of selected) {
      const group = groupData[num - 1];
      try {
        await api.sendMessage('✅ RDX BOT SUCCESSFULLY CONNECTED', group.id);
        try { await api.changeNickname(botName, group.id, botID); } catch {}
        await Threads.setSettings(group.id, { spam: false });
        results.push(`✅ ${num}. ${group.name}`);
        success++;
      } catch {
        results.push(`❌ ${num}. ${group.name}`);
        failed++;
      }
      await new Promise(r => setTimeout(r, 500));
    }

    send.reply(
      `╭──── 🔗 CONNECT RESULT ────╮\n` +
      `│ ✅ Success: ${success}\n` +
      `│ ❌ Failed: ${failed}\n` +
      `╰───────────────────────────╯\n\n` +
      results.join('\n')
    );
  }
};
