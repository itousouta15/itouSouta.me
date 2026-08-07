/* 幾個外部服務要用的識別碼。刻意跟 data.ts 分開放：data.ts 是 83KB 的內容檔，
   而 LanyardCards 是掛在首頁的 client component——它只要一個 Discord ID，卻會
   因為 import 自 data.ts 而把整包 PROJECTS / LIKE_CATEGORIES 拖進首頁的 JS
   bundle（實測 /page 的 chunk 會多背 58KB）。放這裡就只帶走這一行。 */
export const DISCORD_USER_ID = "942765194571055164";
export const GITHUB_USERNAME = "itousouta15";
