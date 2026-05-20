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

function isNotKitchenItem(item) {
  const name = (item.name || "").toLowerCase();
  const category = item.category || "";

  return (
    category === "Bevande" ||
    category === "Birre" ||
    category === "Vini" ||
    category === "Coperti" ||
    name.includes("coperto") ||
    name.includes("acqua") ||
    name.includes("coca") ||
    name.includes("fanta") ||
    name.includes("sprite") ||
    name.includes("chinotto") ||
    name.includes("rallo") ||
    name.includes("purato") ||
    name.includes("funaro") ||
    name.includes("feudo") ||
    name.includes("puglisi") ||
    name.includes("trappe") ||
    name.includes("menabrea") ||
    name.includes("forst") ||
    name.includes("carlsberg") ||
    name.includes("kronenbourg") ||
    name.includes("birra") ||
    name.includes("semedorato")
  );
}

function getCoperti(cart) {
  const coperto = cart.find(item =>
    (item.name || "").toLowerCase().includes("coperto")
  );

  return coperto ? coperto.quantity : 0;
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
    const { table, notes, cart, total, orderType, waiter } = req.body;

    const title =
      orderType === "add"
        ? "➕ AGGIUNTA TAVOLO"
        : "🍕 NUOVA COMANDA";

    const coperti = getCoperti(cart);

    const kitchenItems = cart.filter(item => !isNotKitchenItem(item));

    const tableLine = coperti > 0
      ? `🍽️ Tavolo ${table} — 👥 Coperti: ${coperti}`
      : `🍽️ Tavolo ${table}`;

    const cassaMessage = `
${title}

${tableLine}
👤 Cameriere: ${waiter || "N/D"}

${formatItems(cart, true)}

💰 Totale: €${Number(total).toFixed(2)}

${notes ? `📝 Note:\n${notes}` : ""}
`;

    await bot.sendMessage(process.env.CASSA_CHAT_ID, cassaMessage);

    const pizzeriaMessage = `
${title}

${tableLine}
👤 Cameriere: ${waiter || "N/D"}

${kitchenItems.length > 0 ? formatItems(kitchenItems, false) : "⚠️ Nessun prodotto cucina riconosciuto"}

${notes ? `📝 Note:\n${notes}` : ""}
`;

    await bot.sendMessage(process.env.PIZZERIA_CHAT_ID, pizzeriaMessage);

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
