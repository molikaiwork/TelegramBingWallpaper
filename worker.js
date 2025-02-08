export default {
  async scheduled(event, env, ctx) {
    try {
      const bingUrl = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";
      const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;

      const response = await fetch(bingUrl);
      if (!response.ok) throw new Error(`获取 Bing 壁纸失败: ${response.status} ${response.statusText}`);

      const { images } = await response.json();
      if (!images?.length) throw new Error("Bing API 返回的数据格式异常");

      const { title = "Null", copyright = "Null", enddate: issueNumber = "Null", urlbase } = images[0];
      const imageUrl = `https://www.bing.com${urlbase}_UHD.jpg`;
      const caption = `${title}\n${copyright}\nBing Wallpaper 第 [${issueNumber}](${imageUrl}) 期`;

      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
      const sendMessage = await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, photo: imageUrl, caption, parse_mode: "Markdown" })
      });

      if (!sendMessage.ok) throw new Error(`Telegram 消息发送失败: ${sendMessage.status} ${sendMessage.statusText}`);
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
};
