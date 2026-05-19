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

const kitchenCategories = [
  "Stuzzicherie",
  "Fondute",
  "Novità",
  "Pizze Novus",
  "Evergreen",
  "Meneghine",
  "Dolci"
];

function groupKitchenItems(items) {

  const grouped = {};

  items.forEach(item => {

    const key =
      `${item.name}_${item.modification || ""}`;

    if (!grouped[key]) {

      grouped[key] = {
        name: item.name,
        quantity: 0,
        modification: item.modification || ""
      };
    }

    grouped[key].quantity += item.quantity;
  });

  return Object.values(grouped);
}

function formatKitchenItems(items) {

  return items
    .map(item => {

      let text =
        `${item.quantity} x ${item.name}`;

      if (item.modification) {

        text += `\n✏️ ${item.modification}`;
      }

      return text;
    })
    .join("\n\n");
}

function formatFullItems(items) {

  return items
    .map(item => {

      let text =
        `${item.quantity} x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`;

      if (item.modification) {

        text += `\n   ✏️ ${item.modification}`;
      }

      return text;
    })
    .join("\n");
}

app.post("/send-order", async (req, res) => {

  try {

    const {
      table,
      notes,
      cart,
      total,
      orderType
    } = req.body;

    const title =
      orderType === "add"
        ? "➕ AGGIUNTA TAVOLO"
        : "🍕 NUOVA COMANDA";

    const kitchenItems =
      cart.filter(item =>
        kitchenCategories.includes(item.category)
      );

    const groupedKitchenItems =
      groupKitchenItems(kitchenItems);

    const kitchenText =
      groupedKitchenItems.length > 0
        ? formatKitchenItems(groupedKitchenItems)
        : "Nessun prodotto cucina";

    const fullText =
      formatFullItems(cart);

    const pizzeriaMessage = `
${title}

🍽️ Tavolo ${table}

${kitchenText}

${notes
  ? `📝 Note:\n${notes}`
  : ""}
`;

    const cassaMessage = `
${title}

🍽️ Tavolo ${table}

${fullText}

💰 Totale: €${total.toFixed(2)}

${notes
  ? `📝 Note:\n${notes}`
  : ""}
`;

    if (groupedKitchenItems.length > 0) {

      await bot.sendMessage(
        process.env.PIZZERIA_CHAT_ID,
        pizzeriaMessage
      );
    }

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

app.post("/close-table", async (req, res) => {

  try {

    const {
      table,
      total,
      summary
    } = req.body;

    const closeMessage = `
💰 TAVOLO CHIUSO

🍽️ Tavolo ${table}

💵 Totale finale: €${Number(total).toFixed(2)}

${summary}
`;

    await bot.sendMessage(
      process.env.CASSA_CHAT_ID,
      closeMessage
    );

    res.json({
      success: true
    });

  } catch (error) {

    console.error(
      "Errore chiusura tavolo:",
      error.response?.body || error.message
    );

    res.status(500).json({
      success: false
    });
  }
});

app.listen(PORT, () => {

  console.log(
    `Server avviato sulla porta ${PORT}`
  );
});
