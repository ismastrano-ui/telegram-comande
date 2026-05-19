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

const excludedCategories = [
  "Bevande",
  "Birre",
  "Vini",
  "Coperti"
];

function isKitchenItem(item) {
  const category = item.category || "";
  const name = item.name.toLowerCase();

  if (excludedCategories.includes(category)) return false;
  if (name.includes("coperto")) return false;
  if (name.includes("acqua")) return false;
  if (name.includes("coca")) return false;
  if (name.includes("fanta")) return false;
  if (name.includes("sprite")) return false;
  if (name.includes("chinotto")) return false;
  if (name.includes("birra")) return false;
  if (name.includes("vino")) return false;
  if (name.includes("rallo")) return false;
  if (name.includes("purato")) return false;
  if (name.includes("feudo")) return false;
  if (name.includes("puglisi")) return false;
  if (name.includes("funaro")) return false;

  return true;
}

function formatItems(items, showPrice = true) {
  return items
    .map(item => {
      let text = showPrice
        ? `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`
        : `${item.quantity} x ${item.name}`;

      if (item.modification) {
        text += `\n   ✏️ ${item.modification}`;
      }

      return text;
    })
    .join("\n");
}

app.post("/send-order", async (req, res) => {
  try {
    const { table, notes, cart, total, orderType } = req.body;

    const title =
      orderType === "add"
        ? "➕ AGGIUNTA TAVOLO"
        : "🍕 NUOVA COMANDA";

    const kitchenItems = cart.filter(isKitchenItem);

    if (kitchenItems.length > 0) {
      const pizzeriaMessage = `
${title}

🍽️ Tavolo ${table}

${formatItems(kitchenItems, false)}

${notes ? `📝 Note:\n${notes}` : ""}
`;

      await bot.sendMessage(process.env.PIZZERIA_CHAT_ID, pizzeriaMessage);
    }

    const cassaMessage = `
${title}

🍽️ Tavolo ${table}

${formatItems(cart, true)}

💰 Totale: €${Number(total).toFixed(2)}

${notes ? `📝 Note:\n${notes}` : ""}
`;

    await bot.sendMessage(process.env.CASSA_CHAT_ID, cassaMessage);

    res.json({ success: true });

  } catch (error) {
    console.error("Errore invio ordine:", error.response?.body || error.message);
    res.status(500).json({ success: false });
  }
});

app.post("/close-table", async (req, res) => {
  try {
    const { table, total, summary } = req.body;

    const closeMessage = `
💰 TAVOLO CHIUSO

🍽️ Tavolo ${table}

💵 Totale finale: €${Number(total).toFixed(2)}

${summary}
`;

    await bot.sendMessage(process.env.CASSA_CHAT_ID, closeMessage);

    res.json({ success: true });

  } catch (error) {
    console.error("Errore chiusura tavolo:", error.response?.body || error.message);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
