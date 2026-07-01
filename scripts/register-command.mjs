// Run once to register the slash command:
// node scripts/register-command.mjs

const APP_ID = process.env.DISCORD_APP_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!APP_ID || !BOT_TOKEN) {
  console.error("Missing DISCORD_APP_ID or DISCORD_BOT_TOKEN");
  process.exit(1);
}

const command = {
  name: "碎碎念",
  description: "新增一則碎碎念",
  options: [
    {
      name: "內容",
      description: "你想說的話",
      type: 3, // STRING
      required: true,
    },
  ],
};

const res = await fetch(
  `https://discord.com/api/v10/applications/${APP_ID}/commands`,
  {
    method: "POST",
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  }
);

const data = await res.json();
if (res.ok) {
  console.log("✓ 指令已註冊:", data.name, `(id: ${data.id})`);
} else {
  console.error("✗ 失敗:", data);
}
