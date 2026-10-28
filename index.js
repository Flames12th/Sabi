import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { questions } from "./questions.js";
import { askAI } from "./ai.js";

const bot = new Bot(process.env.BOT_TOKEN);
const current = new Map();

bot.command("start", (ctx) =>
  ctx.reply("Welcome to Sabi 📚 /drill for JAMB practice, or type any question."));

bot.command("drill", (ctx) => {
  const q = questions[Math.floor(Math.random() * questions.length)];
  current.set(ctx.from.id, q);
  const kb = new InlineKeyboard();
  q.options.forEach((o, i) => kb.text(`${"ABCD"[i]}. ${o}`, `ans:${i}`).row());
  ctx.reply(`${q.subject}\n\n${q.text}`, { reply_markup: kb });
});

bot.callbackQuery(/ans:(\d)/, async (ctx) => {
  const q = current.get(ctx.from.id);
  await ctx.answerCallbackQuery();
  if (!q) return ctx.reply("Send /drill first.");
  const pick = Number(ctx.match[1]);
  ctx.reply(pick === q.answer
    ? "✅ Correct!"
    : `❌ Answer: ${"ABCD"[q.answer]}. ${q.options[q.answer]}`);
});

bot.on("message:text", async (ctx) => ctx.reply(await askAI(ctx.message.text)));

bot.start();
