require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

app.use(express.json());
app.use(express.static("public"));

app.post("/send-order", async (req, res) => {
  try {
    const { table, notes, cart, total } = req.body;

    const itemsText = cart
      .map(item => `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`)
      .join("\n");

    const pizzeriaMessage = `
🍕 NUOVA COMANDA

Tavolo: ${table}

${itemsText}

Note:
${notes || "Nessuna nota"}
`;

    const cassaMessage = `
💰 NUOVO ORDINE

Tavolo: ${table}

${itemsText}

Totale: €${total.toFixed(2)}

Note:
${notes || "Nessuna nota"}
`;

    await bot.sendMessage(process.env.PIZZERIA_CHAT_ID, pizzeriaMessage);
    await bot.sendMessage(process.env.CASSA_CHAT_ID, cassaMessage);

    res.json({ success: true });
  } catch (error) {
    console.error("Errore invio ordine:", error);
    res.status(500).json({ success: false });
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Bot comande attivo ✅");
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});