const logs = require('../../utility/logs');

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
}

async function handleCreateDatabase({ api, event, Users, Threads, Currencies }) {
  const { threadID, senderID, isGroup } = event;
  try {
    if (senderID) {
      const user = await Users.get(senderID);
      if (!user) {
        try {
          const info = await withTimeout(
            new Promise((res, rej) => api.getUserInfo(senderID, (e, d) => e ? rej(e) : res(d))),
            4000
          );
          const name = info[senderID]?.name || 'Unknown';
          await Users.create(senderID, name);
        } catch { await Users.create(senderID); }
      }
      if (Currencies) {
        const c = await Currencies.get(senderID);
        if (!c) await Currencies.create(senderID);
      }
    }
    if (isGroup && threadID) {
      const thread = await Threads.get(threadID);
      if (!thread) {
        try {
          const info = await withTimeout(
            new Promise((res, rej) => api.getThreadInfo(threadID, (e, d) => e ? rej(e) : res(d))),
            4000
          );
          await Threads.create(threadID, info?.threadName || info?.name || '');
        } catch { await Threads.create(threadID); }
      }
    }
  } catch (e) { logs.error('DATABASE', e.message); }
}

module.exports = handleCreateDatabase;
