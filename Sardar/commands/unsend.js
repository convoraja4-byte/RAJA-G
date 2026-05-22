module.exports = {
  config: {
    credits: "SARDAR RDX",
    name: 'unsend',
    aliases: ['uns', 'delete', 'del'],
    description: 'Bot apna last message delete kar deta hai.',
    usage: 'uns',
    category: 'Utility',
    prefix: true
  },
  async run({ api, event, send, isAdmin }) {
    const { threadID, messageID, messageReply, senderID } = event;
    const botID = api.getCurrentUserID();

    function getErrMsg(e) {
      if (e && e.error === 1357031) return '❌ Yeh message already delete ho chuka hai ya time limit cross ho gayi.';
      if (e && e.errorSummary) return '❌ Delete nahi hua: ' + e.errorSummary;
      if (e && e.message) return '❌ Delete nahi hua: ' + e.message;
      return '❌ Delete nahi hua. Message expired ya unavailable hai.';
    }

    if (messageReply) {
      if (messageReply.senderID !== botID && !isAdmin) {
        return send.reply('❌ Sirf bot ke messages delete ho sakte hain.');
      }
      try {
        await api.unsendMessage(messageReply.messageID);
        try { await api.unsendMessage(messageID); } catch {}
      } catch (e) {
        send.reply(getErrMsg(e));
      }
      return;
    }

    try {
      api.getThreadHistory(threadID, 20, null, async (err, msgs) => {
        if (err || !msgs?.length) {
          return send.reply('❌ Messages nahi mile.');
        }

        const botMsgs = msgs.filter(m => m.senderID === botID && m.messageID !== messageID);
        if (!botMsgs.length) {
          return send.reply('❌ Koi bot message nahi mila delete karne ke liye.');
        }

        const lastBotMsg = botMsgs[botMsgs.length - 1];
        try {
          await api.unsendMessage(lastBotMsg.messageID);
          try { await api.unsendMessage(messageID); } catch {}
        } catch (e) {
          send.reply(getErrMsg(e));
        }
      });
    } catch (e) {
      send.reply(getErrMsg(e));
    }
  }
};
