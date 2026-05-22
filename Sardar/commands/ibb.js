module.exports = {
  config: {
    credits: "SARDAR RDX",
    name: 'ibb',
    aliases: ['imgbb', 'uploadimg'],
    description: 'Upload images to ImgBB and get a shareable link.',
    usage: 'ibb [reply to one or more images]',
    category: 'Utility',
    prefix: true,
    cooldowns: 5
  },
  async run({ api, event }) {
    const axios = require('axios');

    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0
    ) {
      return api.sendMessage(
        `༻﹡﹡﹡﹡﹡﹡﹡༺\n\n❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐨𝐧𝐞 𝐨𝐫 𝐦𝐨𝐫𝐞 𝐢𝐦𝐚𝐠𝐞𝐬!\n\n༻﹡﹡﹡﹡﹡﹡﹡༺`,
        event.threadID,
        event.messageID
      );
    }

    const apiKey = 'e17a15dd6af452cbe53747c0b2b0866d';
    const uploadUrl = 'https://api.imgbb.com/1/upload';
    const uploadedUrls = [];

    api.sendMessage('⏳ 𝐔𝐩𝐥𝐨𝐚𝐝𝐢𝐧𝐠 𝐢𝐦𝐚𝐠𝐞(𝐬)...', event.threadID, event.messageID);

    for (const attachment of event.messageReply.attachments) {
      if (!attachment.url) {
        uploadedUrls.push(`❌ 𝐍𝐨 𝐔𝐑𝐋 𝐟𝐨𝐮𝐧𝐝 𝐟𝐨𝐫 𝐚𝐭𝐭𝐚𝐜𝐡𝐦𝐞𝐧𝐭`);
        continue;
      }
      try {
        const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        const formData = new URLSearchParams();
        formData.append('key', apiKey);
        formData.append('image', base64Image);

        const uploadResponse = await axios.post(uploadUrl, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        uploadedUrls.push(uploadResponse.data.data.url);
      } catch (err) {
        uploadedUrls.push(`❌ 𝐅𝐚𝐢𝐥𝐞𝐝 𝐭𝐨 𝐮𝐩𝐥𝐨𝐚𝐝: ${attachment.url}`);
      }
    }

    let message = '⚡ 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐈𝐦𝐚𝐠𝐞 𝐋𝐢𝐧𝐤𝐬 ⚡\n\n';
    uploadedUrls.forEach((url, index) => {
      message += `👉 ${index + 1}. ${url}\n`;
    });

    return api.sendMessage(`\n\n${message}\n`, event.threadID, event.messageID);
  }
};
