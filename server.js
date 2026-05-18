require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: false
});

app.use(express.json());

app.use(express.static("public"));

app.post("/send-order", async (req, res) => {
  try {
  orderType === "add"
    ? "➕ AGGIUNTA TAVOLO"
    : "🍕 NUOVA COMANDA";

    const itemsText = cart
      .map(item =>
        `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`
      )
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

    await bot.sendMessage(
      process.env.PIZZERIA_CHAT_ID,
      pizzeriaMessage
    );

    await bot.sendMessage(
      process.env.CASSA_CHAT_ID,
      cassaMessage
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(
      "Errore invio ordine:",
      error.response?.body || error.message
    );

    res.status(500).json({
      success: false
    });

  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
